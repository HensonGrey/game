import { TitleEnum } from "../enums/title.enum";
import { Stage } from "./stage.interface";

export interface Realm {
  name: string;
  stages: Stage[];
  title?: TitleEnum;
  /** Aura/glow hue for this realm, shown around the player as cultivation progresses. */
  color?: string;
}
