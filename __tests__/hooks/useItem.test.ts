import { renderHook } from "@testing-library/react-native";
import { usePlayerStore } from "../../store/player-store";
import { useItem } from "../../hooks/useItem";
import { ItemEnum } from "../../enums/item.enum";

beforeEach(() => {
  usePlayerStore.setState({
    spiritualRootIndex: 0,
    vitalityLevel: 0,
    originPoints: 100,
    lives: [],
    eternalInjuries: [],
    totalTaps: 0,
    claimedAchievements: [],
    itemLevels: {},
    currentLife: {
      realmIndex: 0,
      stageIndex: 0,
      qi: 0,
      currentAge: 0,
      maxAge: 80,
      currentHp: 100,
      maxHp: 100,
      titles: [],
      injuries: [],
    },
  });
});

describe("useItem", () => {
  it("pendantLevel is 0 when the pendant is not in itemLevels", async () => {
    const { result } = await renderHook(() => useItem());
    expect(result.current.pendantLevel).toBe(0);
  });

  it("pendantLevel reflects the value stored in itemLevels", async () => {
    usePlayerStore.setState({ itemLevels: { [ItemEnum.PENDANT]: 3 } });
    const { result } = await renderHook(() => useItem());
    expect(result.current.pendantLevel).toBe(3);
  });

  it("PENDANT_MULTIPLIER = 1 + level × 0.1", async () => {
    usePlayerStore.setState({ itemLevels: { [ItemEnum.PENDANT]: 5 } });
    const { result } = await renderHook(() => useItem());
    expect(result.current.PENDANT_MULTIPLIER).toBeCloseTo(1.5);
  });

  it("SWORD_MULTIPLIER = 1 - level × 0.05", async () => {
    usePlayerStore.setState({ itemLevels: { [ItemEnum.SWORD]: 4 } });
    const { result } = await renderHook(() => useItem());
    expect(result.current.SWORD_MULTIPLIER).toBeCloseTo(0.8);
  });

  it("unlockedItems lists all item keys present in itemLevels", async () => {
    usePlayerStore.setState({
      itemLevels: { [ItemEnum.PENDANT]: 1, [ItemEnum.SWORD]: 2 },
    });
    const { result } = await renderHook(() => useItem());
    expect(result.current.unlockedItems).toContain(ItemEnum.PENDANT);
    expect(result.current.unlockedItems).toContain(ItemEnum.SWORD);
  });

  describe("getUpgradeInfo", () => {
    it("canAfford is true when originPoints >= cost", async () => {
      // pendant at level 1: cost = 50
      usePlayerStore.setState({
        itemLevels: { [ItemEnum.PENDANT]: 1 },
        originPoints: 50,
      });
      const { result } = await renderHook(() => useItem());
      expect(result.current.getUpgradeInfo(ItemEnum.PENDANT).canAfford).toBe(true);
    });

    it("canAfford is false when originPoints < cost", async () => {
      usePlayerStore.setState({
        itemLevels: { [ItemEnum.PENDANT]: 1 },
        originPoints: 1,
      });
      const { result } = await renderHook(() => useItem());
      expect(result.current.getUpgradeInfo(ItemEnum.PENDANT).canAfford).toBe(false);
    });

    it("atMax is true at ITEM_MAX_LEVEL (10)", async () => {
      usePlayerStore.setState({
        itemLevels: { [ItemEnum.PENDANT]: 10 },
        originPoints: 9999,
      });
      const { result } = await renderHook(() => useItem());
      const info = result.current.getUpgradeInfo(ItemEnum.PENDANT);
      expect(info.atMax).toBe(true);
      expect(info.canAfford).toBe(false);
      expect(info.cost).toBe(0);
    });
  });
});
