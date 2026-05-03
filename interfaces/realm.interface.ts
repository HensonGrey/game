import { Stage } from "./stage.interface";

export interface Realm {
  realm: string;
  stages: Stage[];
  title: string; //Title that the stage gives. Golden Core True Monarch etc
}
