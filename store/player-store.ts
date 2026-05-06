import { create } from "zustand";
import { Player } from "../interfaces/player.interface";
import { getNextState, getRequiredQi } from "../helpers/cultivation-helper";

interface PlayerStore extends Player {
  addQi: (amount: number) => void;
  breakthrough: () => void;
}

const defaultPlayer: Player = {
  currentRealmId: 0,
  currentStageId: 0,
  qi: 0,
  lifespan: 80,
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
    const { currentRealmId, currentStageId, qi } = get();
    const requiredQi = getRequiredQi(currentRealmId, currentStageId);
    const next = getNextState(currentRealmId, currentStageId);
    if (!next) return;

    set({
      currentRealmId: next.currentRealmId,
      currentStageId: next.currentStageId,
      qi: qi - requiredQi,
      originPoints: get().originPoints + next.reward.originPointsReward,
      lifespan: get().lifespan + next.reward.lifespanIncrease,
    });
  },
}));
