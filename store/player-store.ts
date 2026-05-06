import { create } from "zustand";
import { Player } from "../interfaces/player.interface";
import { getNextState, getRequiredQi } from "../helpers/cultivation-helper";

interface PlayerStore extends Player {
  addQi: (amount: number) => void;
  breakthrough: () => void;
}

const defaultPlayer: Player = {
  currentRealmIndex: 0,
  currentStageIndex: 0,
  qi: 0,
  lifespan: 20,
  currentAge: 0,
  spiritualRootIndex: 0,
  vitalityLevel: 0,
  originPoints: 1000,
};

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  ...defaultPlayer,

  // Actions
  addQi: (amount: number) => set((state) => ({ qi: state.qi + amount })),

  breakthrough: () => {
    const { currentRealmIndex, currentStageIndex, qi } = get();
    const requiredQi = getRequiredQi(currentRealmIndex, currentStageIndex);
    const next = getNextState(currentRealmIndex, currentStageIndex);
    if (!next) return;

    set({
      currentRealmIndex: next.currentRealmIndex,
      currentStageIndex: next.currentStageIndex,
      qi: qi - requiredQi,
      originPoints: get().originPoints + next.reward.originPointsReward,
      lifespan: get().lifespan + next.reward.lifespanIncrease,
    });
  },
}));
