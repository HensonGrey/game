import { create } from "zustand";
import { Player } from "../interfaces/player.interface";
import { realms } from "../data/cultivation-data";
import { Stage } from "../interfaces/stage.interface";

interface PlayerStore extends Player {
  addQi: (amount: number) => void;
  getStage: () => Stage;
  getRealm: () => (typeof realms)[0];
  getRequiredQi: () => number;
  breakthrough: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Player fields
  currentRealmId: 0,
  currentStageId: 0,
  qi: 0,
  lifespan: 0,
  originPoints: 0,
  spiritualRoot: null,

  // Actions
  addQi: (amount: number) => set((state) => ({ qi: state.qi + amount })),

  getRealm: () => {
    const { currentRealmId } = get();
    return realms.find((r) => r.id === currentRealmId) ?? realms[0];
  },

  getStage: () => {
    const { currentRealmId, currentStageId } = get();
    const realm = realms.find((r) => r.id === currentRealmId) ?? realms[0];
    return realm.stages.find((s) => s.id === currentStageId) ?? realm.stages[0];
  },

  getRequiredQi: () => {
    const { currentRealmId, currentStageId } = get();
    const base = 5;
    const exponent = 1.5;
    const globalLevel = (currentRealmId + 1) * 6 + currentStageId; // since stages reset to 0 with every realm increase
    return Math.floor(base * Math.pow(globalLevel, exponent));
  },

  breakthrough: () => {
    const { currentRealmId, currentStageId, qi } = get();
    const requiredQi = get().getRequiredQi();
    const currentRealm = realms[currentRealmId];

    const isLastStage = currentStageId === currentRealm.stages.length - 1;

    if (isLastStage) {
      set({
        currentRealmId: currentRealmId + 1,
        currentStageId: 0,
        qi: qi - requiredQi,
      });
    } else {
      set({
        currentStageId: currentStageId + 1,
        qi: qi - requiredQi,
      });
    }
  },
}));
