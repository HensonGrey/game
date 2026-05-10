import { TitleType } from "../enums/title-type.enum";

export interface Life {
  realmIndex: number;
  stageIndex: number;
  qi: number;
  currentAge: number;
  maxAge: number;
}

export interface Title {
  weight: number; //to display the most "important" title
  name: string;
  type: TitleType;
  description: string;
  multiplier: number; //example -> boosts cultivation speed / luck / vitality etc by X %
}

export interface Player {
  spiritualRootIndex: number;
  vitalityLevel: number;
  originPoints: number;

  lives: Life[];
  titles: Title[];

  currentLife: Life;
}
