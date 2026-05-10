import { realms } from "../data/cultivation-data";

export const getRequiredQi = (realmId: number, stageId: number): number => {
  const globalLevel = realmId * 6 + stageId;
  return Math.ceil(300 * Math.pow(1.6, globalLevel));
};

//finds information about the next cultivation stage
//useful for deciding whether the player goes up a stage or an entire realm
export const getNextState = (realmId: number, stageId: number) => {
  const currentRealm = realms[realmId];
  const isLastStage = stageId === currentRealm.stages.length - 1;

  if (isLastStage) {
    const next = realms[realmId + 1]?.stages[0];
    if (!next) return null; // at max realm
    return {
      currentRealmIndex: realmId + 1,
      currentStageIndex: 0,
      reward: next,
    };
  }

  const next = currentRealm.stages[stageId + 1];
  return {
    currentRealmIndex: realmId,
    currentStageIndex: stageId + 1,
    reward: next,
  };
};

//format number
export function formatNumbers(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}b`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}m`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toLocaleString();
}
