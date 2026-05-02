import { Realm } from "./cultivation.interface";

export interface Player {
  Realm: Realm;
  originPoints: number; //Store points, can increase varius stats
  spiritualRoot: any; //TODO, make it its own interface
  currentLifeLifespan: number;
  lives?: any; //TODO
}
