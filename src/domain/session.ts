import type { Settings } from "./settings";

export type SessionPhase = "study" | "shortBreak" | "longBreak";

export type SessionStatus = "prepared" | "running" | "paused" | "completed";

export interface Session {
  studyDurationMs: number;
  durationMs: number;
  remainingMs: number;
  phase: SessionPhase;
  pomodorosCompleted: number;
  shortBreakDurationMs: number;
  longBreakDurationMs: number;
  pomodorosPerCycle: number;
  pendingPomodorosPerCycle?: number;
  cycleStarted?: boolean;
  status: SessionStatus;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  lastUpdatedAt: number | null;
}

export interface SessionConfig {
  durationMs: number;
  shortBreakDurationMs?: number;
  longBreakDurationMs?: number;
  pomodorosPerCycle?: number;
}

export type NotificationPermissionState = "granted" | "denied" | "undetermined";

export type NotificationPermissionAction = "request" | "explain" | "none";

export function getNotificationPermissionAction(
  permissionState: NotificationPermissionState,
  hasRequestedPermission: boolean,
  isLaterCycle: boolean,
): NotificationPermissionAction {
  if (permissionState === "granted") {
    return "none";
  }

  if (!hasRequestedPermission) {
    return "request";
  }

  return isLaterCycle ? "explain" : "none";
}

export function createSession(config: SessionConfig): Session {
  return {
    studyDurationMs: config.durationMs,
    durationMs: config.durationMs,
    remainingMs: config.durationMs,
    phase: "study",
    pomodorosCompleted: 0,
    shortBreakDurationMs: config.shortBreakDurationMs ?? 5 * 60 * 1000,
    longBreakDurationMs: config.longBreakDurationMs ?? 15 * 60 * 1000,
    pomodorosPerCycle: config.pomodorosPerCycle ?? 4,
    pendingPomodorosPerCycle: config.pomodorosPerCycle ?? 4,
    cycleStarted: false,
    status: "prepared",
    isRunning: false,
    isPaused: false,
    isCompleted: false,
    lastUpdatedAt: null,
  };
}

export function startSession(session: Session, now: number): Session {
  if (session.status !== "prepared" && session.status !== "completed") {
    return session;
  }

  return {
    ...session,
    remainingMs:
      session.status === "completed" ? session.durationMs : session.remainingMs,
    status: "running",
    isRunning: true,
    isPaused: false,
    isCompleted: false,
    cycleStarted: true,
    lastUpdatedAt: now,
  };
}

function prepareNextPhase(session: Session): Session {
  let phase: SessionPhase;
  let pomodorosCompleted = session.pomodorosCompleted;
  let durationMs: number;
  let pomodorosPerCycle = session.pomodorosPerCycle;
  let pendingPomodorosPerCycle =
    session.pendingPomodorosPerCycle ?? session.pomodorosPerCycle;
  let cycleStarted = session.cycleStarted ?? false;

  if (session.phase === "study") {
    phase =
      pomodorosCompleted >= session.pomodorosPerCycle - 1
        ? "longBreak"
        : "shortBreak";
    durationMs =
      phase === "longBreak"
        ? session.longBreakDurationMs
        : session.shortBreakDurationMs;
  } else {
    phase = "study";
    durationMs = session.studyDurationMs;
    pomodorosCompleted =
      session.phase === "shortBreak" ? pomodorosCompleted + 1 : 0;

    if (session.phase === "longBreak") {
      pomodorosPerCycle = pendingPomodorosPerCycle;
      pendingPomodorosPerCycle = pomodorosPerCycle;
      cycleStarted = false;
    }
  }

  return {
    ...session,
    phase,
    pomodorosCompleted,
    pomodorosPerCycle,
    pendingPomodorosPerCycle,
    cycleStarted,
    durationMs,
    remainingMs: durationMs,
    status: "prepared",
    isRunning: false,
    isPaused: false,
    isCompleted: true,
    lastUpdatedAt: null,
  };
}

export function applySettingsToSession(
  session: Session,
  settings: Settings,
): Session {
  // El ciclo no ha comenzado si es estudio con 0 pomodoros y sin temporizador
  // corriendo ni en pausa (también tras iniciar y reiniciar). Se deduce del
  // estado y no de la bandera guardada (decisión 10, RF-10).
  const cycleStarted =
    session.phase !== "study" ||
    session.pomodorosCompleted > 0 ||
    session.isRunning ||
    session.isPaused;
  const studyDurationMs = settings.studyDurationMinutes * 60_000;
  const shortBreakDurationMs = settings.shortBreakDurationMinutes * 60_000;
  const longBreakDurationMs = settings.longBreakDurationMinutes * 60_000;
  const isPhasePrepared =
    session.status === "prepared" || session.status === "completed";

  const durationMs = isPhasePrepared
    ? session.phase === "study"
      ? studyDurationMs
      : session.phase === "shortBreak"
        ? shortBreakDurationMs
        : longBreakDurationMs
    : session.durationMs;

  return {
    ...session,
    studyDurationMs,
    shortBreakDurationMs,
    longBreakDurationMs,
    durationMs,
    remainingMs: isPhasePrepared ? durationMs : session.remainingMs,
    pomodorosPerCycle: cycleStarted
      ? session.pomodorosPerCycle
      : settings.pomodorosPerCycle,
    pendingPomodorosPerCycle: settings.pomodorosPerCycle,
    cycleStarted,
  };
}

export function syncSessionState(session: Session, now: number): Session {
  if (!session.isRunning || session.lastUpdatedAt === null) {
    return session;
  }

  const elapsedMs = Math.max(0, now - session.lastUpdatedAt);
  const remainingMs = Math.max(0, session.remainingMs - elapsedMs);

  if (remainingMs === 0) {
    return prepareNextPhase(session);
  }

  return {
    ...session,
    remainingMs,
    status: "running",
    isRunning: true,
    isCompleted: false,
    lastUpdatedAt: now,
  };
}

export function advanceSession(session: Session, now: number): Session {
  return syncSessionState(session, now);
}

export function pauseSession(session: Session, now: number): Session {
  const updatedSession = advanceSession(session, now);

  if (!updatedSession.isRunning) {
    return updatedSession;
  }

  return {
    ...updatedSession,
    status: "paused",
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
    status: "running",
    isRunning: true,
    isPaused: false,
    lastUpdatedAt: now,
  };
}

export function resetSession(session: Session, confirmed: boolean): Session {
  if (!confirmed || session.isCompleted) {
    return session;
  }

  const isCycleUntouched =
    session.phase === "study" && session.pomodorosCompleted === 0;

  return {
    ...session,
    // Un reinicio que devuelve el ciclo a 0 adopta el valor pendiente.
    ...(isCycleUntouched
      ? {
          pomodorosPerCycle:
            session.pendingPomodorosPerCycle ?? session.pomodorosPerCycle,
          cycleStarted: false,
        }
      : {}),
    remainingMs: session.durationMs,
    status: "prepared",
    isRunning: false,
    isPaused: false,
    isCompleted: false,
    lastUpdatedAt: null,
  };
}

export function shouldShowCompleted(session: Session): boolean {
  return session.isCompleted;
}
