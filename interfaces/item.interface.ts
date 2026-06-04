import { ImageSourcePropType } from "react-native";
import { ItemEnum } from "../enums/item.enum";

export const ITEM_MAX_LEVEL = 10;
export const ITEM_COST_GROWTH = 1.8;

export interface Item {
  id: ItemEnum;
  name: string;
  description: string;
  image: ImageSourcePropType;
  // Origin Points cost for the level 0 → 1 upgrade. Subsequent levels scale geometrically.
  baseCost: number;
}