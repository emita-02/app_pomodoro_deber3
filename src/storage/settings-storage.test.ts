import AsyncStorage from "@react-native-async-storage/async-storage";
import { DEFAULT_SETTINGS, type Settings } from "../domain/settings";
import { loadSettings, saveSettings } from "./settings-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockedStorage = jest.mocked(AsyncStorage);

describe("settings storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads the defaults when no settings have been saved", async () => {
    mockedStorage.getItem.mockResolvedValue(null);

    await expect(loadSettings()).resolves.toEqual(DEFAULT_SETTINGS);
    expect(mockedStorage.setItem).not.toHaveBeenCalled();
  });

  it("saves and reloads all four settings", async () => {
    const settings: Settings = {
      studyDurationMinutes: 50,
      shortBreakDurationMinutes: 10,
      longBreakDurationMinutes: 30,
      pomodorosPerCycle: 6,
    };
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(settings));

    await saveSettings(settings);

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/settings",
      JSON.stringify(settings),
    );
    await expect(loadSettings()).resolves.toEqual(settings);
  });

  it("persists the default settings when resetting", async () => {
    await saveSettings(DEFAULT_SETTINGS);

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/settings",
      JSON.stringify(DEFAULT_SETTINGS),
    );
  });

  it("propagates a storage write failure", async () => {
    const error = new Error("storage unavailable");
    mockedStorage.setItem.mockRejectedValue(error);

    await expect(saveSettings(DEFAULT_SETTINGS)).rejects.toBe(error);
  });

  it("propagates a storage read failure", async () => {
    const error = new Error("storage unavailable");
    mockedStorage.getItem.mockRejectedValue(error);

    await expect(loadSettings()).rejects.toBe(error);
  });
});
