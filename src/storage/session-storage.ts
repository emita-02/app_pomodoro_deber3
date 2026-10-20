import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    advanceSession,
    type Session,
    type SessionStatus,
} from "../domain/session";

const SESSION_STORAGE_KEY = "@app_pomodoro/session";
const NOTIFICATION_PERMISSION_REQUESTED_KEY =
  "@app_pomodoro/notification-permission-requested";
const NOTIFICATION_CYCLE_COMPLETED_KEY =
  "@app_pomodoro/notification-cycle-completed";

async function readFlag(key: string): Promise<boolean> {
  return (await AsyncStorage.getItem(key)) === "true";
}

export async function hasRequestedNotificationPermission(): Promise<boolean> {
  return readFlag(NOTIFICATION_PERMISSION_REQUESTED_KEY);
}

export async function markNotificationPermissionRequested(): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_PERMISSION_REQUESTED_KEY, "true");
}

export async function hasCompletedNotificationCycle(): Promise<boolean> {
  return readFlag(NOTIFICATION_CYCLE_COMPLETED_KEY);
}

export async function markNotificationCycleCompleted(): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_CYCLE_COMPLETED_KEY, "true");
}

export async function resetNotificationStateForTesting(): Promise<void> {
  await AsyncStorage.removeItem(NOTIFICATION_PERMISSION_REQUESTED_KEY);
  await AsyncStorage.removeItem(NOTIFICATION_CYCLE_COMPLETED_KEY);
}

export async function saveSession(session: Session): Promise<void> {
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function normalizeSession(stored: Partial<Session>): Session {
  const status: SessionStatus =
    stored.status ??
    (stored.isCompleted
      ? "completed"
      : stored.isPaused
        ? "paused"
        : stored.isRunning
          ? "running"
          : "prepared");

  return {
    studyDurationMs: stored.studyDurationMs ?? stored.durationMs!,
    durationMs: stored.durationMs!,
    remainingMs: stored.remainingMs!,
    phase: stored.phase ?? "study",
    pomodorosCompleted: stored.pomodorosCompleted ?? 0,
    shortBreakDurationMs: stored.shortBreakDurationMs ?? 5 * 60 * 1000,
    longBreakDurationMs: stored.longBreakDurationMs ?? 15 * 60 * 1000,
    pomodorosPerCycle: stored.pomodorosPerCycle ?? 4,
    status,
    isRunning: stored.isRunning ?? status === "running",
    isPaused: stored.isPaused ?? status === "paused",
    isCompleted: stored.isCompleted ?? status === "completed",
    lastUpdatedAt: stored.lastUpdatedAt ?? null,
  };
}

export async function loadSession(now: number): Promise<Session | null> {
  const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

  if (storedSession === null) {
    return null;
  }

  const session = normalizeSession(
    JSON.parse(storedSession) as Partial<Session>,
  );
  const restoredSession = session.isRunning
    ? advanceSession(session, now)
    : session;

  if (JSON.stringify(restoredSession) !== storedSession) {
    await saveSession(restoredSession);
  }

  return restoredSession;
}
