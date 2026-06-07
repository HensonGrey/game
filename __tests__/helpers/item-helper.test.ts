import {
  getItemUpgradeCost,
  getPendantQiBoost,
  getSwordDmgReduction,
} from "../../helpers/item-helper";
import { ItemEnum } from "../../enums/item.enum";

describe("getItemUpgradeCost", () => {
  it("returns the pendant base cost (50) at level 1", () => {
    // level 1 = first upgrade: baseCost * 1.8^(1-1) = 50 * 1 = 50
    expect(getItemUpgradeCost(ItemEnum.PENDANT, 1)).toBe(50);
  });

  it("scales pendant cost by 1.8 per level", () => {
    // level 2: 50 * 1.8^1 = 90
    expect(getItemUpgradeCost(ItemEnum.PENDANT, 2)).toBe(90);
  });

  it("returns the sword base cost (100) at level 1", () => {
    expect(getItemUpgradeCost(ItemEnum.SWORD, 1)).toBe(100);
  });

  it("returns 0 for an unknown item (baseCost defaults to 0)", () => {
    expect(getItemUpgradeCost("unknown" as ItemEnum, 1)).toBe(0);
  });
});

describe("getPendantQiBoost", () => {
  it("returns 1 at level 0 (no boost)", () => {
    expect(getPendantQiBoost(0)).toBe(1);
  });

  it("returns 1.1 at level 1", () => {
    expect(getPendantQiBoost(1)).toBeCloseTo(1.1);
  });

  it("returns 2.0 at level 10 (maximum)", () => {
    expect(getPendantQiBoost(10)).toBeCloseTo(2.0);
  });
});

describe("getSwordDmgReduction", () => {
  it("returns 1 at level 0 (no reduction)", () => {
    expect(getSwordDmgReduction(0)).toBe(1);
  });

  it("returns 0.95 at level 1", () => {
    expect(getSwordDmgReduction(1)).toBeCloseTo(0.95);
  });

  it("returns 0.5 at level 10 (maximum)", () => {
    expect(getSwordDmgReduction(10)).toBeCloseTo(0.5);
  });
});
