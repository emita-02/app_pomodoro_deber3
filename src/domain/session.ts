export interface Session {
  durationMs: number;
  remainingMs: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  lastUpdatedAt: number | null;
}

export interface SessionConfig {
  durationMs: number;
}

export function createSession(config: SessionConfig): Session {
  return {
    durationMs: config.durationMs,
    remainingMs: config.durationMs,
    isRunning: false,
    isPaused: false,
    isCompleted: false,
    lastUpdatedAt: null,
  };
}

export function startSession(session: Session, now: number): Session {
  if (session.isRunning || session.isPaused || session.isCompleted) {
    return session;
  }

  return {
    ...session,
    isRunning: true,
    lastUpdatedAt: now,
  };
}

export function advanceSession(session: Session, now: number): Session {
  if (!session.isRunning || session.lastUpdatedAt === null) {
    return session;
  }

  const elapsedMs = Math.max(0, now - session.lastUpdatedAt);
  const remainingMs = Math.max(0, session.remainingMs - elapsedMs);
  const isCompleted = remainingMs === 0;

  return {
    ...session,
    remainingMs,
    isRunning: !isCompleted,
    isCompleted,
    lastUpdatedAt: now,
  };
}

export function pauseSession(session: Session, now: number): Session {
  const updatedSession = advanceSession(session, now);

  if (!updatedSession.isRunning) {
    return updatedSession;
  }

  return {
    ...updatedSession,
    isRunning: false,
    isPaused: true,
  };
}

export function resumeSession(session: Session, now: number): Session {
  if (!session.isPaused || session.isCompleted) {
    return session;
  }

  return {
    ...session,
    isRunning: true,
    isPaused: false,
    lastUpdatedAt: now,
  };
}

export function resetSession(session: Session, confirmed: boolean): Session {
  if (!confirmed || session.isCompleted) {
    return session;
  }

  return {
    ...session,
    remainingMs: session.durationMs,
    isRunning: false,
    isPaused: false,
    isCompleted: false,
    lastUpdatedAt: null,
  };
}

export function shouldShowCompleted(session: Session): boolean {
  return session.isCompleted;
}
