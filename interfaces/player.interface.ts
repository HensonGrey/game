export interface Player {
  // current life information
  currentRealmId: number;
  currentStageId: number;

  qi: number;

  lifespan: number;
  currentAge: number;

  spiritualRootIndex: number;

  vitalityLevel: number;

  originPoints: number;
  lives?: any[];
  titles?: any[];
}
