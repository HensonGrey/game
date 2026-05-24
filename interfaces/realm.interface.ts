import { Title } from "../enums/title.enum";
import { Stage } from "./stage.interface";

export interface Realm {
  name: string;
  stages: Stage[];
  title?: Title;
}
