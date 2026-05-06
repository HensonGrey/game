import { create } from "zustand";
import { Player } from "../interfaces/player.interface";
import { realms } from "../data/cultivation-data";

interface PlayerStore extends Player {
  addQi: (amount: number) => void;
  getRequiredQi: () => number;
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

  getRequiredQi: () => {
    const { currentRealmId, currentStageId } = get();
    const base = 5;
    const exponent = 1.5;
    const globalLevel = (currentRealmId + 1) * 6 + currentStageId; // since stages reset to 0 with every realm increase
    return Math.floor(base * Math.pow(globalLevel, exponent));
  },

  breakthrough: () => {
    const { currentRealmId, currentStageId } = get();
    const requiredQi = get().getRequiredQi();
    const currentRealm = realms[currentRealmId];

    const isLastStage = currentStageId === currentRealm.stages.length - 1;

    if (isLastStage) {
      const nextRealm = realms[currentRealmId + 1].stages[0];
      set((state) => ({
        currentRealmId: currentRealmId + 1,
        currentStageId: 0,
        qi: state.qi - requiredQi,
        originPoints: state.originPoints + nextRealm.originPointsReward,
        lifespan: state.lifespan + nextRealm.lifespanIncrease,
      }));
    } else {
      const nextStage = realms[currentRealmId].stages[currentStageId + 1];
      set((state) => ({
        currentStageId: currentStageId + 1,
        qi: state.qi - requiredQi,
        originPoints: state.originPoints + nextStage.originPointsReward,
        lifespan: state.lifespan + nextStage.lifespanIncrease,
      }));
    }
  },
}));
