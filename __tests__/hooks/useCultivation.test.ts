import { renderHook, act } from "@testing-library/react-native";
import { usePlayerStore } from "../../store/player-store";
import { useCultivation } from "../../hooks/useCultivation";
import { InjuryTypeEnum } from "../../enums/injury-type.enum";
import { TitleEnum } from "../../enums/title.enum";

const BASE_LIFE = {
  realmIndex: 0,
  stageIndex: 0,
  qi: 0,
  currentAge: 0,
  maxAge: 80,
  currentHp: 100,
  maxHp: 100,
  titles: [] as TitleEnum[],
  injuries: [] as InjuryTypeEnum[],
};

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
    currentLife: { ...BASE_LIFE },
  });
});

describe("useCultivation", () => {
  it("BASE_MULTIPLIER is always 5", async () => {
    const { result } = await renderHook(() => useCultivation());
    expect(result.current.BASE_MULTIPLIER).toBe(5);
  });

  it("SPIRITUAL_ROOT_MULTIPLIER is 1 at root index 0 (ceil(3^0) = 1)", async () => {
    const { result } = await renderHook(() => useCultivation());
    expect(result.current.SPIRITUAL_ROOT_MULTIPLIER).toBe(1);
  });

  it("SPIRITUAL_ROOT_MULTIPLIER scales with spiritualRootIndex (ceil(3^1) = 3)", async () => {
    usePlayerStore.setState({ spiritualRootIndex: 1 });
    const { result } = await renderHook(() => useCultivation());
    expect(result.current.SPIRITUAL_ROOT_MULTIPLIER).toBe(3);
  });

  it("CULTIVATION_MULTIPLIER is 1 at realm 0 stage 0 (1.4^0 = 1)", async () => {
    const { result } = await renderHook(() => useCultivation());
    expect(result.current.CULTIVATION_MULTIPLIER).toBe(1);
  });

  it("canBreakthrough is false when qi < requiredQi", async () => {
    usePlayerStore.setState({ currentLife: { ...BASE_LIFE, qi: 0 } });
    const { result } = await renderHook(() => useCultivation());
    expect(result.current.canBreakthrough).toBe(false);
  });

  it("canBreakthrough is true when qi >= requiredQi", async () => {
    // requiredQi at realm 0, stage 0 is 300
    usePlayerStore.setState({ currentLife: { ...BASE_LIFE, qi: 300 } });
    const { result } = await renderHook(() => useCultivation());
    expect(result.current.canBreakthrough).toBe(true);
  });

  it("INJURY_MULTIPLIER is 1 with no injuries", async () => {
    const { result } = await renderHook(() => useCultivation());
    expect(result.current.INJURY_MULTIPLIER).toBe(1);
  });

  it("INJURY_MULTIPLIER is 0.9 with one NORMAL injury (qiMultiplier: 0.9)", async () => {
    usePlayerStore.setState({
      currentLife: { ...BASE_LIFE, injuries: [InjuryTypeEnum.NORMAL] },
    });
    const { result } = await renderHook(() => useCultivation());
    expect(result.current.INJURY_MULTIPLIER).toBeCloseTo(0.9);
  });

  it("TITLE_MULTIPLIER is 1 when no titles are owned", async () => {
    const { result } = await renderHook(() => useCultivation());
    expect(result.current.TITLE_MULTIPLIER).toBe(1);
  });

  it("TITLE_MULTIPLIER reflects the highest-weight title's multiplier", async () => {
    // IMMORTAL_MASTER_REINCARNATION has multiplier: 2
    usePlayerStore.setState({
      currentLife: {
        ...BASE_LIFE,
        titles: [TitleEnum.IMMORTAL_MASTER_REINCARNATION],
      },
    });
    const { result } = await renderHook(() => useCultivation());
    expect(result.current.TITLE_MULTIPLIER).toBe(2);
  });

  it("qiMultiplier is the product of all individual multipliers", async () => {
    const { result } = await renderHook(() => useCultivation());
    const {
      BASE_MULTIPLIER,
      SPIRITUAL_ROOT_MULTIPLIER,
      CULTIVATION_MULTIPLIER,
      INJURY_MULTIPLIER,
      PENDANT_MULTIPLIER,
      TITLE_MULTIPLIER,
      qiMultiplier,
    } = result.current;
    expect(qiMultiplier).toBeCloseTo(
      BASE_MULTIPLIER *
        SPIRITUAL_ROOT_MULTIPLIER *
        CULTIVATION_MULTIPLIER *
        INJURY_MULTIPLIER *
        PENDANT_MULTIPLIER *
        TITLE_MULTIPLIER,
    );
  });

  it("exposes the injuries arrays from the store", async () => {
    usePlayerStore.setState({
      currentLife: { ...BASE_LIFE, injuries: [InjuryTypeEnum.NORMAL] },
      eternalInjuries: [InjuryTypeEnum.ETERNAL],
    });
    const { result } = await renderHook(() => useCultivation());
    expect(result.current.injuries).toContain(InjuryTypeEnum.NORMAL);
    expect(result.current.eternalInjuries).toContain(InjuryTypeEnum.ETERNAL);
  });
});
