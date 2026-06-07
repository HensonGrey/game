import { getHighestWeightTitle } from "../../helpers/title-helper";
import { TitleEnum } from "../../enums/title.enum";

describe("getHighestWeightTitle", () => {
  it("returns undefined for an empty array", () => {
    expect(getHighestWeightTitle([])).toBeUndefined();
  });

  it("returns the only title when one is owned", () => {
    expect(
      getHighestWeightTitle([TitleEnum.IMMORTAL_MASTER_REINCARNATION]),
    ).toBe(TitleEnum.IMMORTAL_MASTER_REINCARNATION);
  });

  it("returns the highest-weight title when multiple are owned", () => {
    const owned = [
      TitleEnum.IMMORTAL_MASTER_REINCARNATION, // weight 1
      TitleEnum.TRUE_LORD_REINCARNATION, // weight 2
      TitleEnum.DAO_LORD_REINCARNATION, // weight 3 — winner
    ];
    expect(getHighestWeightTitle(owned)).toBe(TitleEnum.DAO_LORD_REINCARNATION);
  });

  it("does not mutate the input array", () => {
    const owned = [
      TitleEnum.DAO_LORD_REINCARNATION,
      TitleEnum.IMMORTAL_MASTER_REINCARNATION,
    ];
    const copy = [...owned];
    getHighestWeightTitle(owned);
    expect(owned).toEqual(copy);
  });
});
