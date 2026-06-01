import { ComponentProps } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { AchievementEnum } from "../enums/achievement.enum";
import { ItemEnum } from "../enums/item.enum";

export interface AchievementProgressSource {
  totalTaps: number;
  currentRealmIndex: number;
}

export type AchievementProgress =
  | { current: number; target: number }
  | { completed: boolean };

export interface Achievement {
  id: AchievementEnum;
  name: string;
  description: string;
  icon: ComponentProps<typeof FontAwesome5>["name"];
  originPointsReward: number;
  itemReward?: ItemEnum;
  getProgress: (state: AchievementProgressSource) => AchievementProgress;
}