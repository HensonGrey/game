import { InjuryType } from "../enums/injury-type.enum";

interface InjuryEffect {
  lifespanReduction: number;
  hpReduction: number;
  qiMultiplier: number;
}

export const INJURY_EFFECTS: Record<InjuryType, InjuryEffect> = {
  [InjuryType.NORMAL]: {
    lifespanReduction: 0.05,
    hpReduction: 0.05,
    qiMultiplier: 0.9,
  },
  [InjuryType.ETERNAL]: {
    lifespanReduction: 0.15,
    hpReduction: 0.1,
    qiMultiplier: 0.75,
  },
};
