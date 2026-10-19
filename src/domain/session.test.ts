import {
    advanceSession,
    createSession,
    pauseSession,
    resetSession,
    resumeSession,
    shouldShowCompleted,
    startSession,
} from "./session";

describe("createSession", () => {
  it("creates an idle session with the configured duration", () => {
    expect(createSession({ durationMs: 25 * 60 * 1000 })).toEqual({
      durationMs: 25 * 60 * 1000,
      remainingMs: 25 * 60 * 1000,
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      lastUpdatedAt: null,
    });
  });
});

describe("startSession and advanceSession", () => {
  it("starts at the configured duration and records the start time", () => {
    const session = createSession({ durationMs: 2_500 });

    expect(startSession(session, 1_000)).toEqual({
      ...session,
      isRunning: true,
      lastUpdatedAt: 1_000,
    });
  });

  it("subtracts elapsed time and finishes at zero without starting another phase", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const updated = advanceSession(started, 1_800);

    expect(updated.remainingMs).toBe(1_700);
    expect(updated.isRunning).toBe(true);

    const finished = advanceSession(updated, 3_500);

    expect(finished).toEqual({
      ...updated,
      remainingMs: 0,
      isRunning: false,
      isCompleted: true,
      lastUpdatedAt: 3_500,
    });
    expect(finished).not.toHaveProperty("nextPhase");
  });

  it("reports completion only after the countdown reaches zero", () => {
    const started = startSession(createSession({ durationMs: 500 }), 1_000);

    expect(shouldShowCompleted(advanceSession(started, 1_499))).toBe(false);
    expect(shouldShowCompleted(advanceSession(started, 1_500))).toBe(true);
  });
});

describe("pauseSession and resumeSession", () => {
  it("preserves remaining time during pause and resumes from that amount", () => {
    const started = startSession(createSession({ durationMs: 2_500 }), 1_000);
    const paused = pauseSession(started, 1_600);

    expect(paused).toMatchObject({
      remainingMs: 1_900,
      isRunning: false,
      isPaused: true,
      isCompleted: false,
      lastUpdatedAt: 1_600,
    });
    expect(advanceSession(paused, 5_000)).toEqual(paused);

    const resumed = resumeSession(paused, 8_000);

    expect(resumed).toMatchObject({
      remainingMs: 1_900,
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
