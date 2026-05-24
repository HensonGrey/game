import { ComponentProps } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Item } from "../enums/item.enum";

export interface AchievementProgressSource {
  totalTaps: number;
  currentRealmIndex: number;
}

export type AchievementProgress =
  | { current: number; target: number }
  | { completed: boolean };

export interface AchievementDefinition {
  name: string;
  description: string;
  icon: ComponentProps<typeof FontAwesome5>["name"];
  originPointsReward: number;
  itemReward?: Item;
  getProgress: (state: AchievementProgressSource) => AchievementProgress;
}
