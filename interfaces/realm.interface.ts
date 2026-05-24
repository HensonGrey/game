import { Stage } from "./stage.interface";

export interface Realm {
  name: string;
  stages: Stage[];
  title?: string; //the title string that will later map to the actual title
}
