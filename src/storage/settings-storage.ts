import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_SETTINGS, type Settings } from "../domain/settings";

const SETTINGS_STORAGE_KEY = "@app_pomodoro/settings";

export async function loadSettings(): Promise<Settings> {
  const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

  if (storedSettings === null) {
    return DEFAULT_SETTINGS;
  }

  return JSON.parse(storedSettings) as Settings;
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
