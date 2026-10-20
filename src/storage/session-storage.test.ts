import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSession, startSession, type Session } from "../domain/session";
import {
    hasCompletedNotificationCycle,
    hasRequestedNotificationPermission,
    loadSession,
    markNotificationCycleCompleted,
    markNotificationPermissionRequested,
    resetNotificationStateForTesting,
    saveSession,
} from "./session-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    removeItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockedStorage = jest.mocked(AsyncStorage);

describe("session storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saves the complete session as JSON", async () => {
    const session = createSession({ durationMs: 10_000 });

    await saveSession(session);

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/session",
      JSON.stringify(session),
    );
  });

  it("persists the current phase and completed-pomodoro count", async () => {
    const session: Session = {
      ...createSession({ durationMs: 10_000 }),
      phase: "longBreak",
      durationMs: 900_000,
      remainingMs: 600_000,
      pomodorosCompleted: 3,
    };

    await saveSession(session);

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/session",
      JSON.stringify(session),
    );
  });

  it("subtracts elapsed time when recovering a running session", async () => {
    const running = startSession(createSession({ durationMs: 10_000 }), 1_000);
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(running));

    await expect(loadSession(4_000)).resolves.toEqual({
      ...running,
      remainingMs: 7_000,
      lastUpdatedAt: 4_000,
    });
    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/session",
      JSON.stringify({
        ...running,
        remainingMs: 7_000,
        lastUpdatedAt: 4_000,
      }),
    );
  });

  it("keeps a paused session unchanged when recovering it", async () => {
    const paused: Session = {
      ...createSession({ durationMs: 10_000 }),
      remainingMs: 6_000,
      isPaused: true,
      lastUpdatedAt: 1_000,
    };
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(paused));

    await expect(loadSession(9_000)).resolves.toEqual(paused);
  });

  it("normalizes a saved session without cycle fields as prepared study with zero progress", async () => {
    mockedStorage.getItem.mockResolvedValue(
      JSON.stringify({
        durationMs: 10_000,
        remainingMs: 6_000,
        isRunning: false,
        isPaused: false,
        isCompleted: false,
        lastUpdatedAt: null,
      }),
    );

    await expect(loadSession(9_000)).resolves.toMatchObject({
      studyDurationMs: 10_000,
      phase: "study",
      pomodorosCompleted: 0,
      shortBreakDurationMs: 5 * 60 * 1000,
      longBreakDurationMs: 15 * 60 * 1000,
      pomodorosPerCycle: 4,
      status: "prepared",
    });
  });

  it("allows starting a completed legacy study snapshot after restoring it", async () => {
    mockedStorage.getItem.mockResolvedValue(
      JSON.stringify({
        durationMs: 25 * 60 * 1000,
        remainingMs: 0,
        isRunning: false,
        isPaused: false,
        isCompleted: true,
        lastUpdatedAt: 25 * 60 * 1000,
      }),
    );

    const restored = await loadSession(30 * 60 * 1000);

    expect(startSession(restored as Session, 30 * 60 * 1000)).toMatchObject({
      phase: "study",
      durationMs: 25 * 60 * 1000,
      remainingMs: 25 * 60 * 1000,
      pomodorosCompleted: 0,
      status: "running",
      isRunning: true,
      isCompleted: false,
      lastUpdatedAt: 30 * 60 * 1000,
    });
  });

  it("persists the next prepared phase when a break expired while closed", async () => {
    const expiredShortBreak: Session = {
      ...createSession({ durationMs: 10_000, shortBreakDurationMs: 300 }),
      phase: "shortBreak",
      durationMs: 300,
      remainingMs: 300,
      isRunning: true,
      status: "running",
      lastUpdatedAt: 1_000,
    };
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(expiredShortBreak));

    const restored = await loadSession(1_300);

    expect(restored).toMatchObject({
      phase: "study",
      durationMs: 10_000,
      remainingMs: 10_000,
      pomodorosCompleted: 1,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/session",
      JSON.stringify(restored),
    );

    mockedStorage.getItem.mockResolvedValueOnce(JSON.stringify(restored));
    await expect(loadSession(9_000)).resolves.toEqual(restored);
  });

  it("keeps the pending cycle threshold and cycle-started flag of a paused session", async () => {
    const paused: Session = {
      ...createSession({ durationMs: 10_000, pomodorosPerCycle: 6 }),
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 2,
      cycleStarted: true,
      remainingMs: 6_000,
      status: "paused",
      isPaused: true,
      lastUpdatedAt: 1_000,
    };
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(paused));

    await expect(loadSession(9_000)).resolves.toEqual(paused);
    expect(mockedStorage.setItem).not.toHaveBeenCalled();
  });

  it("keeps the active cycle threshold when recovering a running session after time away", async () => {
    const running = startSession(
      {
        ...createSession({ durationMs: 60_000, pomodorosPerCycle: 6 }),
        pendingPomodorosPerCycle: 2,
      },
      0,
    );
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(running));

    await expect(loadSession(10_000)).resolves.toMatchObject({
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 2,
      cycleStarted: true,
      remainingMs: 50_000,
    });
  });

  it("derives the pending threshold and cycle-started flag for sessions saved before they existed", async () => {
    mockedStorage.getItem.mockResolvedValue(
      JSON.stringify({
        studyDurationMs: 60_000,
        durationMs: 900_000,
        remainingMs: 900_000,
        phase: "longBreak",
        pomodorosCompleted: 3,
        shortBreakDurationMs: 300_000,
        longBreakDurationMs: 900_000,
        pomodorosPerCycle: 4,
        status: "prepared",
        isRunning: false,
        isPaused: false,
        isCompleted: true,
        lastUpdatedAt: null,
      }),
    );

    await expect(loadSession(9_000)).resolves.toMatchObject({
      phase: "longBreak",
      pomodorosCompleted: 3,
      remainingMs: 900_000,
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 4,
      cycleStarted: true,
    });
  });

  it("treats a legacy untouched study snapshot as a cycle that has not started", async () => {
    mockedStorage.getItem.mockResolvedValue(
      JSON.stringify({
        durationMs: 10_000,
        remainingMs: 10_000,
        isRunning: false,
        isPaused: false,
        isCompleted: false,
        lastUpdatedAt: null,
      }),
    );

    await expect(loadSession(9_000)).resolves.toMatchObject({
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 4,
      cycleStarted: false,
    });
  });

  it("returns null when no session has been saved", async () => {
    mockedStorage.getItem.mockResolvedValue(null);

    await expect(loadSession(9_000)).resolves.toBeNull();
  });

  it("persists notification permission and first-cycle state separately", async () => {
    mockedStorage.getItem.mockResolvedValue(null);
    await expect(hasRequestedNotificationPermission()).resolves.toBe(false);
    await expect(hasCompletedNotificationCycle()).resolves.toBe(false);

    await markNotificationPermissionRequested();
    await markNotificationCycleCompleted();

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/notification-permission-requested",
      "true",
    );
    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/notification-cycle-completed",
      "true",
    );
  });

  it("resets only notification test flags without deleting the saved session", async () => {
    await resetNotificationStateForTesting();

    expect(mockedStorage.removeItem).toHaveBeenNthCalledWith(
      1,
      "@app_pomodoro/notification-permission-requested",
    );
    expect(mockedStorage.removeItem).toHaveBeenNthCalledWith(
      2,
      "@app_pomodoro/notification-cycle-completed",
    );
    expect(mockedStorage.removeItem).toHaveBeenCalledTimes(2);
    expect(mockedStorage.removeItem).not.toHaveBeenCalledWith(
      "@app_pomodoro/session",
    );
  });
});
