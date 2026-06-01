import { InjuryTypeEnum } from "../enums/injury-type.enum";

export interface InjuryType {
  id: InjuryTypeEnum;
  lifespanReduction: number;
  hpReduction: number;
  qiMultiplier: number;
}

export const injuryTypes: InjuryType[] = [
  {
    id: InjuryTypeEnum.NORMAL,
    lifespanReduction: 0.05,
    hpReduction: 0.05,
    qiMultiplier: 0.9,
  },
  {
    id: InjuryTypeEnum.ETERNAL,
    lifespanReduction: 0.15,
    hpReduction: 0.1,
    qiMultiplier: 0.75,
  },
];