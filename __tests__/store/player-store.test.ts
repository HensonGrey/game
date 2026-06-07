import { usePlayerStore } from "../../store/player-store";
import { UPGRADE_TYPES } from "../../interfaces/store-upgrade.interface";
import { getRequiredQi } from "../../helpers/cultivation-helper";
import { InjuryTypeEnum } from "../../enums/injury-type.enum";
import { AchievementEnum } from "../../enums/achievement.enum";
import { ItemEnum } from "../../enums/item.enum";

const INITIAL_LIFE = {
  realmIndex: 0,
  stageIndex: 0,
  qi: 0,
  currentAge: 0,
  maxAge: 80,
  currentHp: 100,
  maxHp: 100,
  titles: [],
  injuries: [],
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
    currentLife: { ...INITIAL_LIFE },
  });
});

// ─── addQi ───────────────────────────────────────────────────────────────────

describe("addQi", () => {
  it("increases qi by the given amount", () => {
    usePlayerStore.getState().addQi(50);
    expect(usePlayerStore.getState().currentLife.qi).toBe(50);
  });

  it("increments totalTaps", () => {
    usePlayerStore.getState().addQi(1);
    usePlayerStore.getState().addQi(1);
    expect(usePlayerStore.getState().totalTaps).toBe(2);
  });
});

// ─── breakthrough ─────────────────────────────────────────────────────────────

describe("breakthrough", () => {
  it("does nothing when qi is below the threshold", () => {
    const required = getRequiredQi(0, 0);
    usePlayerStore.setState({ currentLife: { ...INITIAL_LIFE, qi: required - 1 } });

    usePlayerStore.getState().breakthrough();

    expect(usePlayerStore.getState().currentLife.stageIndex).toBe(0);
    expect(usePlayerStore.getState().currentLife.qi).toBe(required - 1);
  });

  it("advances the stage when qi is sufficient", () => {
    const required = getRequiredQi(0, 0);
    usePlayerStore.setState({ currentLife: { ...INITIAL_LIFE, qi: required } });

    usePlayerStore.getState().breakthrough();

    expect(usePlayerStore.getState().currentLife.stageIndex).toBe(1);
  });

  it("deducts qi equal to the requirement, keeping the excess", () => {
    const required = getRequiredQi(0, 0);
    const extra = 50;
    usePlayerStore.setState({ currentLife: { ...INITIAL_LIFE, qi: required + extra } });

    usePlayerStore.getState().breakthrough();

    expect(usePlayerStore.getState().currentLife.qi).toBe(extra);
  });

  it("awards origin points on breakthrough", () => {
    const required = getRequiredQi(0, 0);
    const startingPoints = usePlayerStore.getState().originPoints;
    usePlayerStore.setState({ currentLife: { ...INITIAL_LIFE, qi: required } });

    usePlayerStore.getState().breakthrough();

    expect(usePlayerStore.getState().originPoints).toBeGreaterThan(startingPoints);
  });

  it("increases max lifespan on breakthrough", () => {
    const required = getRequiredQi(0, 0);
    usePlayerStore.setState({ currentLife: { ...INITIAL_LIFE, qi: required } });

    usePlayerStore.getState().breakthrough();

    expect(usePlayerStore.getState().currentLife.maxAge).toBeGreaterThan(
      INITIAL_LIFE.maxAge,
    );
  });
});

// ─── purchaseUpgrade — spiritual root ─────────────────────────────────────────

describe("purchaseUpgrade — spiritual root", () => {
  it("increments spiritualRootIndex and deducts cost", () => {
    usePlayerStore.setState({ spiritualRootIndex: 0, originPoints: 200 });
    usePlayerStore.getState().purchaseUpgrade(UPGRADE_TYPES.SPIRITUAL_ROOT, 50);

    expect(usePlayerStore.getState().spiritualRootIndex).toBe(1);
    expect(usePlayerStore.getState().originPoints).toBe(150);
  });

  it("does nothing when origin points are insufficient", () => {
    usePlayerStore.setState({ spiritualRootIndex: 0, originPoints: 10 });
    usePlayerStore.getState().purchaseUpgrade(UPGRADE_TYPES.SPIRITUAL_ROOT, 50);

    expect(usePlayerStore.getState().spiritualRootIndex).toBe(0);
    expect(usePlayerStore.getState().originPoints).toBe(10);
  });
});

// ─── purchaseUpgrade — vitality ───────────────────────────────────────────────

describe("purchaseUpgrade — vitality", () => {
  it("increments vitalityLevel and deducts cost", () => {
    usePlayerStore.setState({ vitalityLevel: 0, originPoints: 200 });
    usePlayerStore.getState().purchaseUpgrade(UPGRADE_TYPES.VITALITY, 30);

    expect(usePlayerStore.getState().vitalityLevel).toBe(1);
    expect(usePlayerStore.getState().originPoints).toBe(170);
  });
});

// ─── purchaseUpgrade — cleanse eternal injuries ───────────────────────────────

describe("purchaseUpgrade — cleanse eternal injuries", () => {
  it("clears all eternal injuries and deducts cost", () => {
    usePlayerStore.setState({
      eternalInjuries: [InjuryTypeEnum.ETERNAL],
      originPoints: 200,
    });
    usePlayerStore.getState().purchaseUpgrade(
      UPGRADE_TYPES.CLEANSE_ETERNAL_INJURIES,
      40,
    );

    expect(usePlayerStore.getState().eternalInjuries).toHaveLength(0);
    expect(usePlayerStore.getState().originPoints).toBe(160);
  });

  it("does nothing when there are no eternal injuries", () => {
    usePlayerStore.setState({ eternalInjuries: [], originPoints: 200 });
    usePlayerStore.getState().purchaseUpgrade(
      UPGRADE_TYPES.CLEANSE_ETERNAL_INJURIES,
      40,
    );

    expect(usePlayerStore.getState().originPoints).toBe(200);
  });
});

// ─── reincarnate ──────────────────────────────────────────────────────────────

describe("reincarnate", () => {
  it("resets the current life to initial values", () => {
    usePlayerStore.setState({
      currentLife: { ...INITIAL_LIFE, realmIndex: 2, stageIndex: 1, qi: 9999 },
    });

    usePlayerStore.getState().reincarnate();

    const life = usePlayerStore.getState().currentLife;
    expect(life.realmIndex).toBe(0);
    expect(life.stageIndex).toBe(0);
    expect(life.qi).toBe(0);
  });

  it("carries the highest-weight title from previous lives into the new life", () => {
    const { TitleEnum } = require("../../enums/title.enum");
    usePlayerStore.setState({
      lives: [{ ...INITIAL_LIFE, titles: [TitleEnum.IMMORTAL_MASTER_REINCARNATION] }],
    });

    usePlayerStore.getState().reincarnate();

    expect(usePlayerStore.getState().currentLife.titles).toContain(
      TitleEnum.IMMORTAL_MASTER_REINCARNATION,
    );
  });
});

// ─── inflictInjury — normal ───────────────────────────────────────────────────

describe("inflictInjury — normal", () => {
  it("adds the injury to currentLife.injuries", () => {
    usePlayerStore.getState().inflictInjury(InjuryTypeEnum.NORMAL);
    expect(usePlayerStore.getState().currentLife.injuries).toContain(
      InjuryTypeEnum.NORMAL,
    );
  });

  it("reduces maxAge by 5% (lifespanReduction = 0.05)", () => {
    const before = usePlayerStore.getState().currentLife.maxAge;
    usePlayerStore.getState().inflictInjury(InjuryTypeEnum.NORMAL);
    const after = usePlayerStore.getState().currentLife.maxAge;
    expect(after).toBeCloseTo(before * 0.95, 0);
  });

  it("does not add to eternalInjuries", () => {
    usePlayerStore.getState().inflictInjury(InjuryTypeEnum.NORMAL);
    expect(usePlayerStore.getState().eternalInjuries).toHaveLength(0);
  });
});

// ─── inflictInjury — eternal ──────────────────────────────────────────────────

describe("inflictInjury — eternal", () => {
  it("adds to eternalInjuries, not currentLife.injuries", () => {
    usePlayerStore.getState().inflictInjury(InjuryTypeEnum.ETERNAL);
    expect(usePlayerStore.getState().eternalInjuries).toContain(
      InjuryTypeEnum.ETERNAL,
    );
    expect(usePlayerStore.getState().currentLife.injuries).toHaveLength(0);
  });

  it("reduces maxAge by 15% (lifespanReduction = 0.15)", () => {
    const before = usePlayerStore.getState().currentLife.maxAge;
    usePlayerStore.getState().inflictInjury(InjuryTypeEnum.ETERNAL);
    const after = usePlayerStore.getState().currentLife.maxAge;
    expect(after).toBeCloseTo(before * 0.85, 0);
  });
});

// ─── recordDeath ──────────────────────────────────────────────────────────────

describe("recordDeath", () => {
  it("saves the current life to the lives array", () => {
    usePlayerStore.getState().recordDeath();
    expect(usePlayerStore.getState().lives).toHaveLength(1);
  });

  it("is idempotent — does not duplicate if called twice with identical state", () => {
    usePlayerStore.getState().recordDeath();
    usePlayerStore.getState().recordDeath();
    expect(usePlayerStore.getState().lives).toHaveLength(1);
  });

  it("awards the realm title to the life when the realm grants one", () => {
    const { realms } = require("../../data/cultivation-data");
    const realmIdx = realms.findIndex((r: any) => r.title !== undefined);
    if (realmIdx === -1) return;
    usePlayerStore.setState({
      currentLife: { ...INITIAL_LIFE, realmIndex: realmIdx },
    });
    usePlayerStore.getState().recordDeath();
    expect(usePlayerStore.getState().lives[0].titles).toContain(
      realms[realmIdx].title,
    );
  });
});

// ─── claimAchievement ─────────────────────────────────────────────────────────

describe("claimAchievement", () => {
  it("awards origin points and unlocks item when completed (1000 taps)", () => {
    usePlayerStore.setState({ totalTaps: 1000, originPoints: 0, itemLevels: {} });
    usePlayerStore.getState().claimAchievement(AchievementEnum.ONE_THOUSAND_TAPS);

    expect(usePlayerStore.getState().originPoints).toBe(50);
    expect(usePlayerStore.getState().itemLevels[ItemEnum.PENDANT]).toBe(1);
  });

  it("does nothing when the achievement is not yet completed", () => {
    usePlayerStore.setState({ totalTaps: 10, originPoints: 100 });
    usePlayerStore.getState().claimAchievement(AchievementEnum.ONE_THOUSAND_TAPS);

    expect(usePlayerStore.getState().originPoints).toBe(100);
  });

  it("is idempotent — does not award origin points twice", () => {
    usePlayerStore.setState({ totalTaps: 1000, originPoints: 0 });
    usePlayerStore.getState().claimAchievement(AchievementEnum.ONE_THOUSAND_TAPS);
    usePlayerStore.getState().claimAchievement(AchievementEnum.ONE_THOUSAND_TAPS);

    expect(usePlayerStore.getState().originPoints).toBe(50);
  });
});

// ─── upgradeItem ──────────────────────────────────────────────────────────────

describe("upgradeItem", () => {
  it("increments item level and deducts cost", () => {
    // pendant at level 1: cost = 50 * 1.8^0 = 50
    usePlayerStore.setState({
      itemLevels: { [ItemEnum.PENDANT]: 1 },
      originPoints: 200,
    });
    usePlayerStore.getState().upgradeItem(ItemEnum.PENDANT);

    expect(usePlayerStore.getState().itemLevels[ItemEnum.PENDANT]).toBe(2);
    expect(usePlayerStore.getState().originPoints).toBe(150);
  });

  it("does nothing if the item is not unlocked (not in itemLevels)", () => {
    usePlayerStore.setState({ itemLevels: {}, originPoints: 200 });
    usePlayerStore.getState().upgradeItem(ItemEnum.PENDANT);

    expect(usePlayerStore.getState().originPoints).toBe(200);
  });

  it("does nothing when the item is at max level (10)", () => {
    usePlayerStore.setState({
      itemLevels: { [ItemEnum.PENDANT]: 10 },
      originPoints: 9999,
    });
    usePlayerStore.getState().upgradeItem(ItemEnum.PENDANT);

    expect(usePlayerStore.getState().itemLevels[ItemEnum.PENDANT]).toBe(10);
  });

  it("does nothing when origin points are insufficient", () => {
    usePlayerStore.setState({
      itemLevels: { [ItemEnum.PENDANT]: 1 },
      originPoints: 10,
    });
    usePlayerStore.getState().upgradeItem(ItemEnum.PENDANT);

    expect(usePlayerStore.getState().itemLevels[ItemEnum.PENDANT]).toBe(1);
  });
});
