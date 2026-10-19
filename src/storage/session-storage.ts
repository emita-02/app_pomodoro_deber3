import AsyncStorage from "@react-native-async-storage/async-storage";
import { advanceSession, type Session } from "../domain/session";

const SESSION_STORAGE_KEY = "@app_pomodoro/session";

export async function saveSession(session: Session): Promise<void> {
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export async function loadSession(now: number): Promise<Session | null> {
  const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

  if (storedSession === null) {
    return null;
  }

  const session = JSON.parse(storedSession) as Session;
  return session.isRunning ? advanceSession(session, now) : session;
}
