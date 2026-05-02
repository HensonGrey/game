export interface Realm {
  id: number;
  stages: Stage[];
  title: string; //Title that the stage gives. Golden Core True Monarch etc
}

export interface Stage {
  id: number;
  name: string;
  title?: string; //Title that the stage gives, cosmetic and optional. For example max stage body refining is grandmaster
  description: string;
  lifespanIncrease: number;
  originPointsReward: number;
}
