import {
  DEFAULT_SETTINGS,
  SettingsDraft,
  validateSettings,
} from "./settings";

describe("settings defaults", () => {
  it("uses the approved default values", () => {
    expect(DEFAULT_SETTINGS).toEqual({
      studyDurationMinutes: 25,
      shortBreakDurationMinutes: 5,
      longBreakDurationMinutes: 15,
      pomodorosPerCycle: 4,
    });
  });
});

describe("validateSettings", () => {
  it("accepts the inclusive boundaries of every setting", () => {
    expect(
      validateSettings({
        studyDurationMinutes: "1",
        shortBreakDurationMinutes: "1",
        longBreakDurationMinutes: "120",
        pomodorosPerCycle: "12",
      }),
    ).toEqual({
      settings: {
        studyDurationMinutes: 1,
        shortBreakDurationMinutes: 1,
        longBreakDurationMinutes: 120,
        pomodorosPerCycle: 12,
      },
      errors: {},
    });
  });

  it.each([
    ["studyDurationMinutes", 1, 120],
    ["shortBreakDurationMinutes", 1, 60],
    ["longBreakDurationMinutes", 1, 120],
    ["pomodorosPerCycle", 1, 12],
  ] as const)(
    "rejects invalid input for %s and reports its integer range",
    (field, minimum, maximum) => {
      const invalidValues = ["", "   ", "abc", "1.5", "0", `${minimum - 1}`, `${maximum + 1}`];

      for (const value of invalidValues) {
        const draft: SettingsDraft = {
          studyDurationMinutes: "25",
          shortBreakDurationMinutes: "5",
          longBreakDurationMinutes: "15",
          pomodorosPerCycle: "4",
          [field]: value,
        };

        const result = validateSettings(draft);

        expect(result.settings).toBeNull();
        expect(result.errors).toEqual({
          [field]: expect.stringContaining(`${minimum}-${maximum}`),
        });
      }
    },
  );

  it("reports errors for every invalid field and returns no settings", () => {
    const result = validateSettings({
      studyDurationMinutes: "",
      shortBreakDurationMinutes: "61",
      longBreakDurationMinutes: "1.5",
      pomodorosPerCycle: "0",
    });

    expect(result.settings).toBeNull();
    expect(result.errors).toEqual({
      studyDurationMinutes: expect.stringContaining("1-120"),
      shortBreakDurationMinutes: expect.stringContaining("1-60"),
      longBreakDurationMinutes: expect.stringContaining("1-120"),
      pomodorosPerCycle: expect.stringContaining("1-12"),
    });
  });
});
