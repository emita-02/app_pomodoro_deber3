import {
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
});
