import { realms } from "../data/cultivation-data";

export const getGlobalLevel = (realmId: number, stageId: number): number => {
  let level = stageId;
  for (let i = 0; i < realmId; i++) level += realms[i].stages.length;
  return level;
};

export const getRequiredQi = (realmId: number, stageId: number): number => {
  return Math.ceil(300 * Math.pow(1.6, getGlobalLevel(realmId, stageId)));
};

export const getLifespanIncrease = (
  realmId: number,
  stageId: number,
): number => {
  return Math.floor(7 * Math.pow(1.15, getGlobalLevel(realmId, stageId)));
};

export const getOriginPointsReward = (
  realmId: number,
  stageId: number,
): number => {
  return Math.ceil(4 * Math.pow(1.35, getGlobalLevel(realmId, stageId)));
};

export const getStrength = (realmId: number, stageId: number): number => {
  return Math.ceil(14 * Math.pow(1.25, getGlobalLevel(realmId, stageId)));
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
