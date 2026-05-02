export interface Player {
  currentRealmId: number;
  currentStageId: number;

  qi: number;
  lifespan: number;
  currentAge: number;

  originPoints: number;
  spiritualRoot: any;
  lives?: any[];
  titles?: any[];
}
