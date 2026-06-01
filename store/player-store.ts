import { create } from "zustand";
import { Life, Player } from "../interfaces/player.interface";
import {
  getNextState,
  getRequiredQi,
  getLifespanIncrease,
  getOriginPointsReward,
} from "../helpers/cultivation-helper";
import { roots } from "../data/spiritual-root-data";
import { realms } from "../data/cultivation-data";
import { titles } from "../data/title-data";
import { UPGRADE_TYPES } from "../interfaces/store-upgrade.interface";
import { TitleEnum } from "../enums/title.enum";
import { TitleType } from "../enums/title-type.enum";
import { InjuryTypeEnum } from "../enums/injury-type.enum";
import { AchievementEnum } from "../enums/achievement.enum";
import { ItemEnum } from "../enums/item.enum";
import { ITEM_MAX_LEVEL } from "../interfaces/item.interface";
import { achievements } from "../data/achievement-data";
import { getItemUpgradeCost } from "../helpers/item-helper";
import { MIN_LIFESPAN, MAX_LIFESPAN } from "../constants/life-constants";
import { injuryTypes } from "../constants/injury-constants";

interface PlayerStore extends Player {
  currentLife: Life;
  addQi: (amount: number) => void;
  breakthrough: () => void;
  recordDeath: () => void;
  reincarnate: () => void;
  inflictInjury: (type: InjuryTypeEnum) => void;
  purchaseUpgrade: (type: UPGRADE_TYPES, cost: number) => void;
  claimAchievement: (id: AchievementEnum) => void;
  upgradeItem: (item: ItemEnum) => void;
}

const INITIAL_LIFE: Life = {
  realmIndex: 0,
  stageIndex: 0,
  qi: 0,
  currentAge: 0,
  maxAge: Math.floor(Math.random() * 20) + 60,
  currentHp: 100,
  maxHp: 100,
  titles: [],
  injuries: [],
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  spiritualRootIndex: 3,
  vitalityLevel: 0,
  originPoints: 100,
  lives: [],
  eternalInjuries: [],
  totalTaps: 0,
  claimedAchievements: [],
  itemLevels: {},

  currentLife: { ...INITIAL_LIFE },

  addQi: (amount: number) =>
    set((state) => ({
      currentLife: { ...state.currentLife, qi: Math.round(state.currentLife.qi + amount) },
      totalTaps: state.totalTaps + 1,
    })),

  claimAchievement: (id: AchievementEnum) => {
    const {
      claimedAchievements,
      itemLevels,
      originPoints,
      totalTaps,
      currentLife,
    } = get();
    if (claimedAchievements.includes(id)) return;

    const def = achievements.find((a) => a.id === id);
    if (!def) return;

    const progress = def.getProgress({
      totalTaps,
      currentRealmIndex: currentLife.realmIndex,
    });
    const done =
      "completed" in progress
        ? progress.completed
        : progress.current >= progress.target;
    if (!done) return;

    const nextItemLevels = def.itemReward
      ? { ...itemLevels, [def.itemReward]: itemLevels[def.itemReward] ?? 1 }
      : itemLevels;

    set({
      claimedAchievements: [...claimedAchievements, id],
      itemLevels: nextItemLevels,
      originPoints: originPoints + def.originPointsReward,
    });
  },

  upgradeItem: (item: ItemEnum) => {
    const { itemLevels, originPoints } = get();
    const currentLevel = itemLevels[item];
    if (currentLevel === undefined) return; // not unlocked
    if (currentLevel >= ITEM_MAX_LEVEL) return;

    const cost = getItemUpgradeCost(item, currentLevel);
    if (originPoints < cost) return;

    set({
      originPoints: originPoints - cost,
      itemLevels: { ...itemLevels, [item]: currentLevel + 1 },
    });
  },

  purchaseUpgrade: (type: UPGRADE_TYPES, cost: number) => {
    const { originPoints, spiritualRootIndex, vitalityLevel } = get();
    if (originPoints < cost) return;

    switch (type) {
      case UPGRADE_TYPES.SPIRITUAL_ROOT: {
        if (spiritualRootIndex >= roots.length - 1) return;
        set({
          spiritualRootIndex: spiritualRootIndex + 1,
          originPoints: originPoints - cost,
        });
        break;
      }
      case UPGRADE_TYPES.VITALITY: {
        set({
          vitalityLevel: vitalityLevel + 1,
          originPoints: originPoints - cost,
        });
        break;
      }
      case UPGRADE_TYPES.CLEANSE_ETERNAL_INJURIES: {
        const { eternalInjuries } = get();
        if (eternalInjuries.length === 0) return;
        set({
          eternalInjuries: [],
          originPoints: originPoints - cost,
        });
        break;
      }
    }
  },

  breakthrough: () => {
    const { currentLife } = get();
    const { realmIndex, stageIndex, qi } = currentLife;

    const requiredQi = getRequiredQi(realmIndex, stageIndex);
    const next = getNextState(realmIndex, stageIndex);

    if (!next || qi < requiredQi) return;

    const lifespanIncrease = getLifespanIncrease(
      next.currentRealmIndex,
      next.currentStageIndex,
    );
    const originPointsReward = getOriginPointsReward(
      next.currentRealmIndex,
      next.currentStageIndex,
    );

    set((state) => ({
      originPoints: state.originPoints + originPointsReward,
      currentLife: {
        ...state.currentLife,
        realmIndex: next.currentRealmIndex,
        stageIndex: next.currentStageIndex,
        qi: qi - requiredQi,
        maxAge: state.currentLife.maxAge + lifespanIncrease,
      },
    }));
  },

  /**
   * @description Saves the finished life to `lives` and gives the player the title of the highest realm they reached, if that realm has one.
   */
  recordDeath: () => {
    const { currentLife, lives } = get();

    const last = lives[lives.length - 1];
    if (
      last &&
      last.currentAge === currentLife.currentAge &&
      last.realmIndex === currentLife.realmIndex &&
      last.stageIndex === currentLife.stageIndex
    ) {
      return;
    }

    const earned = realms[currentLife.realmIndex]?.title;
    const liveWithTitle: Life =
      earned !== undefined && !currentLife.titles.includes(earned)
        ? { ...currentLife, titles: [...currentLife.titles, earned] }
        : currentLife;

    set({
      currentLife: liveWithTitle,
      lives: [...lives, liveWithTitle],
    });
  },

  reincarnate: () => {
    const { lives, vitalityLevel, eternalInjuries } = get();

    const bestPerType = new Map<TitleType, TitleEnum>();
    for (const life of lives) {
      for (const t of life.titles) {
        const def = titles.find((d) => d.name === t);
        if (!def) continue;
        const currentBest = bestPerType.get(def.type);
        const currentBestWeight = currentBest
          ? (titles.find((d) => d.name === currentBest)?.weight ?? 0)
          : -Infinity;
        if (currentBestWeight < def.weight) {
          bestPerType.set(def.type, t);
        }
      }
    }
    const inheritedTitles = Array.from(bestPerType.values());

    const range = MAX_LIFESPAN - MIN_LIFESPAN + 1;
    const randomBase = Math.floor(Math.random() * range) + MIN_LIFESPAN;
    let maxAge = randomBase * Math.pow(1.2, vitalityLevel);
    let maxHp = INITIAL_LIFE.maxHp;

    for (const injury of eternalInjuries) {
      const effect = injuryTypes.find((i) => i.id === injury);
      if (!effect) continue;
      maxAge *= 1 - effect.lifespanReduction;
      maxHp *= 1 - effect.hpReduction;
    }

    set({
      currentLife: {
        ...INITIAL_LIFE,
        maxAge,
        maxHp,
        currentHp: maxHp,
        titles: inheritedTitles,
      },
    });
  },

  // HP reduction is deferred — applied at the start of the next tribulation via
  // useTribulation's mount effect, so the player's HP bar doesn't shrink mid-fight.
  inflictInjury: (type: InjuryTypeEnum) => {
    const effect = injuryTypes.find((i) => i.id === type);
    if (!effect) return;
    set((state) => {
      const life = state.currentLife;
      const newMaxAge = Math.max(
        life.currentAge + 1,
        life.maxAge * (1 - effect.lifespanReduction),
      );

      if (type === InjuryTypeEnum.ETERNAL) {
        return {
          eternalInjuries: [...state.eternalInjuries, type],
          currentLife: { ...life, maxAge: newMaxAge },
        };
      }

      return {
        currentLife: {
          ...life,
          maxAge: newMaxAge,
          injuries: [...life.injuries, type],
        },
      };
    });
  },
}));
