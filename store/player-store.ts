import { create } from "zustand";
import { Life, Player } from "../interfaces/player.interface";
import { getNextState, getRequiredQi } from "../helpers/cultivation-helper";
import { roots } from "../data/spiritual-root-data";
import { realms } from "../data/cultivation-data";
import { titleDefinitions } from "../data/title-data";
import { UPGRADE_TYPES } from "../interfaces/store-upgrade.interface";
import { Title } from "../enums/title.enum";
import { TitleType } from "../enums/title-type.enum";
import { MIN_LIFESPAN, MAX_LIFESPAN } from "../constants/life-constants";

interface PlayerStore extends Player {
  currentLife: Life;
  addQi: (amount: number) => void;
  breakthrough: () => void;
  recordDeath: () => void;
  reincarnate: () => void;
  purchaseUpgrade: (type: UPGRADE_TYPES, cost: number) => void;
}

const INITIAL_LIFE: Life = {
  realmIndex: 0,
  stageIndex: 0,
  qi: 0,
  currentAge: 0,
  maxAge: Math.floor(Math.random() * 20) + 60,
  currentHp: 100,
  maxHp: 100,
  strength: 10,
  titles: [],
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  spiritualRootIndex: 5,
  vitalityLevel: 0,
  originPoints: 100,
  lives: [],

  currentLife: { ...INITIAL_LIFE },

  addQi: (amount: number) =>
    set((state) => ({
      currentLife: { ...state.currentLife, qi: state.currentLife.qi + amount },
    })),

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
    }
  },

  breakthrough: () => {
    const { currentLife } = get();
    const { realmIndex, stageIndex, qi } = currentLife;

    const requiredQi = getRequiredQi(realmIndex, stageIndex);
    const next = getNextState(realmIndex, stageIndex);

    if (!next || qi < requiredQi) return;

    set((state) => ({
      originPoints: state.originPoints + next.reward.originPointsReward,
      currentLife: {
        ...state.currentLife,
        realmIndex: next.currentRealmIndex,
        stageIndex: next.currentStageIndex,
        qi: qi - requiredQi,
        maxAge: state.currentLife.maxAge + next.reward.lifespanIncrease,
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
    const { lives, vitalityLevel } = get();

    const bestPerType = new Map<TitleType, Title>();
    for (const life of lives) {
      for (const t of life.titles) {
        const def = titleDefinitions[t];
        const currentBest = bestPerType.get(def.type);
        if (!currentBest || titleDefinitions[currentBest].weight < def.weight) {
          bestPerType.set(def.type, t);
        }
      }
    }
    const inheritedTitles = Array.from(bestPerType.values());

    const range = MAX_LIFESPAN - MIN_LIFESPAN + 1;
    const randomBase = Math.floor(Math.random() * range) + MIN_LIFESPAN;
    const upgradedMaxAge = randomBase * Math.pow(1.2, vitalityLevel);

    set({
      currentLife: {
        ...INITIAL_LIFE,
        maxAge: upgradedMaxAge,
        titles: inheritedTitles,
      },
    });
  },
}));
