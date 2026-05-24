import { Title } from "../enums/title.enum";
import { TitleType } from "../enums/title-type.enum";
import { InjuryType } from "../enums/injury-type.enum";
import { Achievement } from "../enums/achievement.enum";
import { Item } from "../enums/item.enum";

export interface Life {
  realmIndex: number;
  stageIndex: number;
  qi: number;
  currentAge: number;
  maxAge: number;
  currentHp: number;
  maxHp: number;
  titles: Title[];
  injuries: InjuryType[];
}

export interface TitleDefinition {
  weight: number;
  name: string;
  type: TitleType;
  description: string;
  multiplier: number;
}

export interface Player {
  spiritualRootIndex: number;
  vitalityLevel: number;
  originPoints: number;

  lives: Life[];
  eternalInjuries: InjuryType[]; // injuries that persist across death

  totalTaps: number; // qi taps accumulated across all lives
  claimedAchievements: Achievement[];
  unlockedItems: Item[];

  currentLife: Life;
}
