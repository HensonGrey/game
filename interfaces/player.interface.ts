export interface Player {
  spiritualRootIndex: number;
  vitalityLevel: number;
  originPoints: number;

  lives: Life[];
  titles?: any[];

  currentLife: Life;
}

export interface Life {
  realmIndex: number;
  stageIndex: number;
  qi: number;
  currentAge: number;
  maxAge: number;
}