import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSession, startSession, type Session } from "../domain/session";
import { loadSession, saveSession } from "./session-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

const mockedStorage = jest.mocked(AsyncStorage);

describe("session storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("saves the complete session as JSON", async () => {
    const session = createSession({ durationMs: 10_000 });

    await saveSession(session);

    expect(mockedStorage.setItem).toHaveBeenCalledWith(
      "@app_pomodoro/session",
      JSON.stringify(session),
    );
  });

  it("subtracts elapsed time when recovering a running session", async () => {
    const running = startSession(createSession({ durationMs: 10_000 }), 1_000);
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(running));

    await expect(loadSession(4_000)).resolves.toEqual({
      ...running,
      remainingMs: 7_000,
      lastUpdatedAt: 4_000,
    });
  });

  it("keeps a paused session unchanged when recovering it", async () => {
    const paused: Session = {
      ...createSession({ durationMs: 10_000 }),
      remainingMs: 6_000,
      isPaused: true,
      lastUpdatedAt: 1_000,
    };
    mockedStorage.getItem.mockResolvedValue(JSON.stringify(paused));

    await expect(loadSession(9_000)).resolves.toEqual(paused);
  });

  it("returns null when no session has been saved", async () => {
    mockedStorage.getItem.mockResolvedValue(null);

    await expect(loadSession(9_000)).resolves.toBeNull();
  });
});
