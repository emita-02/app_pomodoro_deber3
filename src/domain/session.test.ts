import {
    applySettingsToSession,
    advanceSession,
    createSession,
    getNotificationPermissionAction,
    pauseSession,
    resetSession,
    resumeSession,
    shouldShowCompleted,
    startSession,
    syncSessionState,
} from "./session";
import { DEFAULT_SETTINGS } from "./settings";

describe("createSession", () => {
  it("creates a prepared study session with the cycle configuration", () => {
    expect(createSession({ durationMs: 25 * 60 * 1000 })).toEqual({
      durationMs: 25 * 60 * 1000,
      studyDurationMs: 25 * 60 * 1000,
      remainingMs: 25 * 60 * 1000,
      phase: "study",
      pomodorosCompleted: 0,
      shortBreakDurationMs: 5 * 60 * 1000,
      longBreakDurationMs: 15 * 60 * 1000,
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 4,
      cycleStarted: false,
      status: "prepared",
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      lastUpdatedAt: null,
    });
  });

  it("uses configured break durations and cycle length", () => {
    expect(
      createSession({
        durationMs: 2_500,
        shortBreakDurationMs: 500,
        longBreakDurationMs: 1_500,
        pomodorosPerCycle: 3,
      }),
    ).toMatchObject({
      phase: "study",
      shortBreakDurationMs: 500,
      longBreakDurationMs: 1_500,
      pomodorosPerCycle: 3,
      pomodorosCompleted: 0,
      status: "prepared",
    });
  });
});

describe("startSession and advanceSession", () => {
  it("starts at the configured duration and records the start time", () => {
    const session = createSession({ durationMs: 2_500 });

    expect(startSession(session, 1_000)).toEqual({
      ...session,
      status: "running",
      isRunning: true,
      cycleStarted: true,
      lastUpdatedAt: 1_000,
    });
  });

  it("synchronizes elapsed time exactly across repeated updates", () => {
    const started = startSession(createSession({ durationMs: 10_000 }), 1_000);
    const once = syncSessionState(started, 4_333);
    const repeatedly = syncSessionState(
      syncSessionState(started, 2_222),
      4_333,
    );

    expect(repeatedly).toEqual(once);
    expect(repeatedly.remainingMs).toBe(6_667);
  });

  it("does not start a session that is already running or paused", () => {
    const prepared = createSession({ durationMs: 2_500 });
    const started = startSession(prepared, 1_000);
    const paused = pauseSession(started, 1_500);

    expect(startSession(started, 2_000)).toEqual(started);
    expect(startSession(paused, 2_000)).toEqual(paused);
  });

  it("subtracts elapsed time and finishes at zero without starting another phase", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const updated = advanceSession(started, 1_800);

    expect(updated.remainingMs).toBe(1_700);
    expect(updated.isRunning).toBe(true);

    const finished = advanceSession(updated, 3_500);

    expect(finished).toEqual({
      ...updated,
      durationMs: 5 * 60 * 1000,
      remainingMs: 5 * 60 * 1000,
      phase: "shortBreak",
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
    expect(finished.isRunning).toBe(false);
  });

  it("prepares the next phase when synchronization happens after the deadline", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const recoveredLate = syncSessionState(started, 6_000);

    expect(recoveredLate).toMatchObject({
      phase: "shortBreak",
      remainingMs: 5 * 60 * 1000,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
  });

  it("reports completion only after the countdown reaches zero", () => {
    const started = startSession(createSession({ durationMs: 500 }), 1_000);

    expect(shouldShowCompleted(advanceSession(started, 1_499))).toBe(false);
    expect(shouldShowCompleted(advanceSession(started, 1_500))).toBe(true);
  });

  it("allows explicitly starting the prepared phase after a study phase ends", () => {
    const study = startSession(createSession({ durationMs: 500 }), 1_000);
    const preparedBreak = advanceSession(study, 1_500);

    expect(startSession(preparedBreak, 2_000)).toMatchObject({
      phase: "shortBreak",
      status: "running",
      isRunning: true,
      isCompleted: false,
      lastUpdatedAt: 2_000,
    });
  });

  it("restarts a completed legacy study snapshot when the user starts it", () => {
    const completedLegacySession = {
      ...createSession({ durationMs: 2_500 }),
      remainingMs: 0,
      status: "completed" as const,
      isCompleted: true,
      lastUpdatedAt: 2_500,
    };

    expect(startSession(completedLegacySession, 3_000)).toMatchObject({
      durationMs: 2_500,
      remainingMs: 2_500,
      status: "running",
      isRunning: true,
      isCompleted: false,
      lastUpdatedAt: 3_000,
    });
  });
});

describe("study phase transitions", () => {
  const config = {
    durationMs: 1_000,
    shortBreakDurationMs: 300,
    longBreakDurationMs: 900,
    pomodorosPerCycle: 4,
  };

  it("prepares a short break before reaching the long-break threshold", () => {
    const started = startSession(createSession(config), 0);

    expect(advanceSession(started, 1_000)).toMatchObject({
      phase: "shortBreak",
      durationMs: 300,
      remainingMs: 300,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
  });

  it("prepares a long break at the configured threshold without starting it", () => {
    const session = {
      ...createSession(config),
      pomodorosCompleted: 3,
    };
    const started = startSession(session, 0);

    expect(advanceSession(started, 1_000)).toMatchObject({
      phase: "longBreak",
      durationMs: 900,
      remainingMs: 900,
      pomodorosCompleted: 3,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
  });

  it("increments the counter when a short break ends and prepares study", () => {
    const session = {
      ...createSession(config),
      phase: "shortBreak" as const,
      durationMs: config.shortBreakDurationMs,
      remainingMs: config.shortBreakDurationMs,
    };
    const started = startSession(session, 0);

    expect(advanceSession(started, 300)).toMatchObject({
      phase: "study",
      durationMs: config.durationMs,
      remainingMs: config.durationMs,
      pomodorosCompleted: 1,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
  });

  it("keeps three completed pomodoros during long break and resets after it ends", () => {
    const session = {
      ...createSession(config),
      phase: "longBreak" as const,
      durationMs: config.longBreakDurationMs,
      remainingMs: config.longBreakDurationMs,
      pomodorosCompleted: 3,
    };
    const started = startSession(session, 0);
    const duringBreak = advanceSession(started, 300);

    expect(duringBreak).toMatchObject({
      phase: "longBreak",
      pomodorosCompleted: 3,
      remainingMs: 600,
      status: "running",
    });
    expect(advanceSession(duringBreak, 1_200)).toMatchObject({
      phase: "study",
      durationMs: config.durationMs,
      remainingMs: config.durationMs,
      pomodorosCompleted: 0,
      status: "prepared",
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: null,
    });
  });
});

describe("applySettingsToSession", () => {
  it("applies settings to a prepared phase before the first cycle starts", () => {
    const session = createSession({ durationMs: 25 * 60 * 1000 });

    expect(
      applySettingsToSession(session, {
        studyDurationMinutes: 30,
        shortBreakDurationMinutes: 8,
        longBreakDurationMinutes: 20,
        pomodorosPerCycle: 6,
      }),
    ).toMatchObject({
      studyDurationMs: 30 * 60 * 1000,
      durationMs: 30 * 60 * 1000,
      remainingMs: 30 * 60 * 1000,
      shortBreakDurationMs: 8 * 60 * 1000,
      longBreakDurationMs: 20 * 60 * 1000,
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 6,
      cycleStarted: false,
    });
  });

  it("keeps the running phase snapshot and uses new durations for future phases", () => {
    const started = startSession(
      createSession({ durationMs: 25 * 60 * 1000 }),
      0,
    );
    const updated = applySettingsToSession(started, {
      studyDurationMinutes: 40,
      shortBreakDurationMinutes: 8,
      longBreakDurationMinutes: 20,
      pomodorosPerCycle: 6,
    });

    expect(updated).toMatchObject({
      durationMs: 25 * 60 * 1000,
      remainingMs: 25 * 60 * 1000,
      studyDurationMs: 40 * 60 * 1000,
      shortBreakDurationMs: 8 * 60 * 1000,
      longBreakDurationMs: 20 * 60 * 1000,
      cycleStarted: true,
    });
    expect(advanceSession(updated, 25 * 60 * 1000)).toMatchObject({
      phase: "shortBreak",
      durationMs: 8 * 60 * 1000,
      remainingMs: 8 * 60 * 1000,
    });
  });

  it("keeps the active cycle threshold and adopts the pending value after long break", () => {
    const started = startSession(
      {
        ...createSession({
          durationMs: 60_000,
          longBreakDurationMs: 900_000,
          pomodorosPerCycle: 6,
        }),
        pomodorosCompleted: 5,
      },
      0,
    );
    const updated = applySettingsToSession(started, {
      ...DEFAULT_SETTINGS,
      pomodorosPerCycle: 2,
    });

    expect(updated).toMatchObject({
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 2,
    });

    const preparedLongBreak = advanceSession(updated, 60_000);
    expect(preparedLongBreak).toMatchObject({
      phase: "longBreak",
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 2,
    });

    expect(advanceSession(startSession(preparedLongBreak, 60_000), 960_000))
      .toMatchObject({
        phase: "study",
        pomodorosCompleted: 0,
        pomodorosPerCycle: 2,
        pendingPomodorosPerCycle: 2,
        cycleStarted: false,
      });
  });

  it("preserves the active phase and cycle when restoring default settings", () => {
    const session = startSession(
      {
        ...createSession({
          durationMs: 30 * 60 * 1000,
          pomodorosPerCycle: 6,
        }),
        remainingMs: 20 * 60 * 1000,
        pomodorosCompleted: 2,
      },
      1_000,
    );

    expect(applySettingsToSession(session, DEFAULT_SETTINGS)).toMatchObject({
      durationMs: 30 * 60 * 1000,
      remainingMs: 20 * 60 * 1000,
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 4,
      studyDurationMs: 25 * 60 * 1000,
      shortBreakDurationMs: 5 * 60 * 1000,
      longBreakDurationMs: 15 * 60 * 1000,
    });
  });
});

describe("applying saved settings to an active session", () => {
  const newSettings = {
    studyDurationMinutes: 40,
    shortBreakDurationMinutes: 10,
    longBreakDurationMinutes: 30,
    pomodorosPerCycle: 6,
  };

  it("keeps the snapshot and remaining time of a paused phase", () => {
    const paused = pauseSession(
      startSession(createSession({ durationMs: 25 * 60 * 1000 }), 0),
      5 * 60 * 1000,
    );

    const updated = applySettingsToSession(paused, newSettings);

    expect(updated).toMatchObject({
      status: "paused",
      isPaused: true,
      durationMs: 25 * 60 * 1000,
      remainingMs: 20 * 60 * 1000,
      studyDurationMs: 40 * 60 * 1000,
      shortBreakDurationMs: 10 * 60 * 1000,
      longBreakDurationMs: 30 * 60 * 1000,
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 6,
    });
  });

  it("uses the new break duration when the study phase ended before the change", () => {
    const started = startSession(createSession({ durationMs: 60_000 }), 0);
    const synced = syncSessionState(started, 60_000);

    expect(synced).toMatchObject({
      phase: "shortBreak",
      durationMs: 5 * 60 * 1000,
      status: "prepared",
    });
    expect(applySettingsToSession(synced, newSettings)).toMatchObject({
      phase: "shortBreak",
      durationMs: 10 * 60 * 1000,
      remainingMs: 10 * 60 * 1000,
      status: "prepared",
      isRunning: false,
    });
  });

  it("does not start a prepared phase when settings are applied", () => {
    const prepared = createSession({ durationMs: 25 * 60 * 1000 });

    expect(applySettingsToSession(prepared, newSettings)).toMatchObject({
      status: "prepared",
      isRunning: false,
      lastUpdatedAt: null,
    });
  });

  it("returns the same session when the same settings are applied again", () => {
    const once = applySettingsToSession(
      startSession(createSession({ durationMs: 60_000 }), 0),
      newSettings,
    );

    expect(applySettingsToSession(once, newSettings)).toEqual(once);
  });
});

describe("cycle size while the cycle has not started", () => {
  const sixPomodoros = { ...DEFAULT_SETTINGS, pomodorosPerCycle: 6 };

  it("applies a new cycle size after the first study timer was started and reset", () => {
    const started = startSession(createSession({ durationMs: 25 * 60_000 }), 0);
    const reset = resetSession(started, true);

    expect(applySettingsToSession(reset, sixPomodoros)).toMatchObject({
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 6,
      cycleStarted: false,
    });
  });

  it("keeps the cycle size while the study timer is running", () => {
    const started = startSession(createSession({ durationMs: 25 * 60_000 }), 0);

    expect(applySettingsToSession(started, sixPomodoros)).toMatchObject({
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 6,
    });
  });

  it("keeps the cycle size while the study timer is paused", () => {
    const paused = pauseSession(
      startSession(createSession({ durationMs: 25 * 60_000 }), 0),
      1_000,
    );

    expect(applySettingsToSession(paused, sixPomodoros)).toMatchObject({
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 6,
    });
  });

  it("keeps the cycle size once a pomodoro is completed, even with a stale flag", () => {
    const session = {
      ...createSession({ durationMs: 25 * 60_000 }),
      pomodorosCompleted: 1,
      cycleStarted: false,
    };

    expect(applySettingsToSession(session, sixPomodoros)).toMatchObject({
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 6,
      cycleStarted: true,
    });
  });

  it("adopts the pending cycle size when an untouched cycle is reset", () => {
    const running = applySettingsToSession(
      startSession(createSession({ durationMs: 25 * 60_000 }), 0),
      sixPomodoros,
    );

    expect(resetSession(running, true)).toMatchObject({
      pomodorosPerCycle: 6,
      pendingPomodorosPerCycle: 6,
      cycleStarted: false,
    });
  });

  it("keeps the active cycle size when resetting in the middle of a cycle", () => {
    const running = applySettingsToSession(
      startSession(
        { ...createSession({ durationMs: 25 * 60_000 }), pomodorosCompleted: 2 },
        0,
      ),
      sixPomodoros,
    );

    expect(resetSession(running, true)).toMatchObject({
      pomodorosPerCycle: 4,
      pendingPomodorosPerCycle: 6,
      cycleStarted: true,
    });
  });
});

describe("pauseSession and resumeSession", () => {
  it("preserves remaining time during pause and resumes from that amount", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const paused = pauseSession(started, 1_600);

    expect(paused).toMatchObject({
      remainingMs: 1_900,
      status: "paused",
      isRunning: false,
      isPaused: true,
      isCompleted: false,
      lastUpdatedAt: 1_600,
    });
    expect(advanceSession(paused, 5_000)).toEqual(paused);

    const resumed = resumeSession(paused, 8_000);

    expect(resumed).toMatchObject({
      remainingMs: 1_900,
      status: "running",
      isRunning: true,
      isPaused: false,
      lastUpdatedAt: 8_000,
    });
    expect(advanceSession(resumed, 8_500).remainingMs).toBe(1_400);
  });
});

describe("resetSession", () => {
  it("keeps the running session unchanged when reset is canceled", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const updated = advanceSession(started, 1_600);

    expect(resetSession(updated, false)).toEqual(updated);
  });

  it("restores the configured duration and idle state when confirmed", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const paused = pauseSession(started, 1_600);

    expect(resetSession(paused, true)).toEqual({
      ...paused,
      remainingMs: 2_500,
      cycleStarted: false,
      status: "prepared",
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      lastUpdatedAt: null,
    });
  });

  it("does not restart a completed session", () => {
    const started = startSession(createSession({ durationMs: 500 }), 1_000);
    const finished = advanceSession(started, 1_500);

    expect(resetSession(finished, true)).toEqual(finished);
  });
});

describe("notification permission policy", () => {
  it("requests permission only before its first request", () => {
    expect(getNotificationPermissionAction("undetermined", false, false)).toBe(
      "request",
    );
    expect(getNotificationPermissionAction("denied", true, false)).toBe("none");
  });

  it("does not request an already granted permission", () => {
    expect(getNotificationPermissionAction("granted", false, false)).toBe(
      "none",
    );
  });

  it("explains how to enable denied notifications at a later cycle", () => {
    expect(getNotificationPermissionAction("denied", true, true)).toBe(
      "explain",
    );
  });

  it("keeps the session start available when notification permission is denied", () => {
    const session = createSession({ durationMs: 2_500 });

    expect(getNotificationPermissionAction("denied", true, false)).toBe("none");
    expect(startSession(session, 1_000)).toMatchObject({
      status: "running",
      isRunning: true,
      lastUpdatedAt: 1_000,
    });
  });
});
