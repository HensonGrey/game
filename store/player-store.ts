import { create } from "zustand";
import { Player, Life } from "../interfaces/player.interface";
import { getNextState, getRequiredQi } from "../helpers/cultivation-helper";

interface PlayerStore extends Player {
  currentLife: Life;
  addQi: (amount: number) => void;
  breakthrough: () => void;
  reincarnate: () => void;
}

const INITIAL_LIFE: Life = {
  realmIndex: 0,
  stageIndex: 0,
  qi: 0,
  currentAge: 0,
  maxAge: 100,
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  spiritualRootIndex: 0,
  vitalityLevel: 0,
  originPoints: 0,
  lives: [],
  titles: [],

  currentLife: { ...INITIAL_LIFE },

  addQi: (amount: number) =>
    set((state) => ({
      currentLife: { ...state.currentLife, qi: state.currentLife.qi + amount },
    })),

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
    const upgradedMaxAge = 100 * Math.pow(1.2, vitalityLevel);

    set({
      currentLife: {
        ...INITIAL_LIFE,
        maxAge: upgradedMaxAge,
      },
    });
  },
}));
