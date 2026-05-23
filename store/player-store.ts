import { create } from "zustand";
import { Life, Player, Title } from "../interfaces/player.interface";
import { getNextState, getRequiredQi } from "../helpers/cultivation-helper";
import { roots } from "../data/spiritual-root-data";
import { UPGRADE_TYPES } from "../interfaces/store-upgrade.interface";
import { TitleType } from "../enums/title-type.enum";

interface PlayerStore extends Player {
  currentLife: Life;
  addQi: (amount: number) => void;
  breakthrough: () => void;
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
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  spiritualRootIndex: 5,
  vitalityLevel: 0,
  originPoints: 100,
  lives: [],
  titles: [],

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

  reincarnate: () => {
    const { vitalityLevel } = get();

    const randomBase = Math.floor(Math.random() * 31) + 50; //reincarnate with a random lifespan of 50-80
    const upgradedMaxAge = randomBase * Math.pow(1.2, vitalityLevel);

    set({
      currentLife: {
        ...INITIAL_LIFE,
        maxAge: upgradedMaxAge,
      },
    });
  },
}));
