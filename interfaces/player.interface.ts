import { TitleEnum } from "../enums/title.enum";
import { TitleType } from "../enums/title-type.enum";
import { InjuryTypeEnum } from "../enums/injury-type.enum";
import { AchievementEnum } from "../enums/achievement.enum";
import { ItemEnum } from "../enums/item.enum";

export interface Life {
  realmIndex: number;
  stageIndex: number;
  qi: number;
  currentAge: number;
  maxAge: number;
  currentHp: number;
  maxHp: number;
  titles: TitleEnum[];
  injuries: InjuryTypeEnum[];
}

export interface Title {
  name: TitleEnum;
  weight: number;
  type: TitleType;
  description: string;
  multiplier: number;
}

export interface Player {
  spiritualRootIndex: number;
  vitalityLevel: number;
  originPoints: number;

  lives: Life[];
  eternalInjuries: InjuryTypeEnum[]; // injuries that persist across death

  totalTaps: number; // qi taps accumulated across all lives
  claimedAchievements: AchievementEnum[];
  // Presence = unlocked; value = current level (starts at 1 on unlock, caps at ITEM_MAX_LEVEL).
  itemLevels: Partial<Record<ItemEnum, number>>;

  currentLife: Life;
}