import {
  getGlobalLevel,
  getRequiredQi,
  getLifespanIncrease,
  getOriginPointsReward,
  getStrength,
  getNextState,
  formatNumbers,
} from "../../helpers/cultivation-helper";

describe("getGlobalLevel", () => {
  it("returns stageIndex for realm 0", () => {
    expect(getGlobalLevel(0, 0)).toBe(0);
    expect(getGlobalLevel(0, 3)).toBe(3);
  });

  it("accumulates stages from previous realms", () => {
    // realm 0 has 6 stages, so realm 1 stage 0 = level 6
    expect(getGlobalLevel(1, 0)).toBe(6);
    expect(getGlobalLevel(1, 2)).toBe(8);
  });
});

describe("getRequiredQi", () => {
  it("returns 300 at realm 0 stage 0 (level 0)", () => {
    expect(getRequiredQi(0, 0)).toBe(300);
  });

  it("scales up with level", () => {
    const level0 = getRequiredQi(0, 0);
    const level1 = getRequiredQi(0, 1);
    expect(level1).toBeGreaterThan(level0);
    expect(level1).toBeCloseTo(300 * 1.6, 0);
  });
});

describe("getLifespanIncrease", () => {
  it("returns 7 at level 0", () => {
    expect(getLifespanIncrease(0, 0)).toBe(7);
  });

  it("grows with level", () => {
    expect(getLifespanIncrease(0, 1)).toBeGreaterThan(getLifespanIncrease(0, 0));
  });
});

describe("getOriginPointsReward", () => {
  it("returns 4 at level 0", () => {
    expect(getOriginPointsReward(0, 0)).toBe(4);
  });

  it("grows with level", () => {
    expect(getOriginPointsReward(0, 1)).toBeGreaterThan(getOriginPointsReward(0, 0));
  });
});

describe("getStrength", () => {
  it("returns 14 at level 0", () => {
    expect(getStrength(0, 0)).toBe(14);
  });

  it("grows with level", () => {
    expect(getStrength(0, 1)).toBeGreaterThan(getStrength(0, 0));
  });
});

describe("getNextState", () => {
  it("advances to next stage within same realm", () => {
    const next = getNextState(0, 0);
    expect(next).toEqual({ currentRealmIndex: 0, currentStageIndex: 1, reward: expect.anything() });
  });

  it("advances to realm 1 stage 0 from the last stage of realm 0", () => {
    // realm 0 has 6 stages (0-5), so the last is stage 5
    const next = getNextState(0, 5);
    expect(next).toEqual({ currentRealmIndex: 1, currentStageIndex: 0, reward: expect.anything() });
  });

  it("returns null when at the very last realm and last stage", () => {
    // Import realms to find the true last realm index and last stage index.
    const { realms } = require("../../data/cultivation-data");
    const lastRealmIdx = realms.length - 1;
    const lastStageIdx = realms[lastRealmIdx].stages.length - 1;
    expect(getNextState(lastRealmIdx, lastStageIdx)).toBeNull();
  });
});

describe("formatNumbers", () => {
  it("shows raw number below 1000", () => {
    expect(formatNumbers(999)).toBe("999");
  });

  it("formats thousands with k suffix", () => {
    expect(formatNumbers(1500)).toBe("1.5k");
  });

  it("formats millions with m suffix", () => {
    expect(formatNumbers(2_500_000)).toBe("2.5m");
  });

  it("formats billions with b suffix", () => {
    expect(formatNumbers(1_200_000_000)).toBe("1.2b");
  });
});
