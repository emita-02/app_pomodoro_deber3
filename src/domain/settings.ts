export interface Settings {
  studyDurationMinutes: number;
  shortBreakDurationMinutes: number;
  longBreakDurationMinutes: number;
  pomodorosPerCycle: number;
}

export interface SettingsDraft {
  studyDurationMinutes: string;
  shortBreakDurationMinutes: string;
  longBreakDurationMinutes: string;
  pomodorosPerCycle: string;
}

export type SettingsField = keyof SettingsDraft;

export interface SettingsValidationResult {
  settings: Settings | null;
  errors: Partial<Record<SettingsField, string>>;
}

export const DEFAULT_SETTINGS: Settings = {
  studyDurationMinutes: 25,
  shortBreakDurationMinutes: 5,
  longBreakDurationMinutes: 15,
  pomodorosPerCycle: 4,
};

const SETTINGS_RANGES: Record<SettingsField, { minimum: number; maximum: number }> = {
  studyDurationMinutes: { minimum: 1, maximum: 120 },
  shortBreakDurationMinutes: { minimum: 1, maximum: 60 },
  longBreakDurationMinutes: { minimum: 1, maximum: 120 },
  pomodorosPerCycle: { minimum: 1, maximum: 12 },
};

export function validateSettings(draft: SettingsDraft): SettingsValidationResult {
  const errors: SettingsValidationResult["errors"] = {};
  const settings = {} as Settings;

  for (const field of Object.keys(SETTINGS_RANGES) as SettingsField[]) {
    const { minimum, maximum } = SETTINGS_RANGES[field];
    const value = draft[field].trim();

    if (!/^\d+$/.test(value)) {
      errors[field] = `Ingresa un número entero entre ${minimum}-${maximum}.`;
      continue;
    }

    const parsedValue = Number(value);
    if (parsedValue < minimum || parsedValue > maximum) {
      errors[field] = `Ingresa un número entero entre ${minimum}-${maximum}.`;
      continue;
    }

    settings[field] = parsedValue;
  }

  return Object.keys(errors).length > 0 ? { settings: null, errors } : { settings, errors };
}
