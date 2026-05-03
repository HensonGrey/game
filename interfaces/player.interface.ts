export interface Player {
  // current life information
  currentRealmId: number;
  currentStageId: number;
  qi: number;
  lifespan: number;
  currentAge: number;
  spiritualRootId: number;
  qiMultiplier: number;

  originPoints: number;
  lives?: any[];
  titles?: any[];
}
