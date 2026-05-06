export enum UPGRADE_TYPES {
  SPIRITUAL_ROOT = "spiritualRoot",
  VITALITY = "vitality",
}

export interface Upgrade {
  type: UPGRADE_TYPES;
  label: string;
  icon: string;
  cost: number;
  level: string | number;
  desc: string;
  maxLevel?: number;
  isMaxed: boolean;
}
