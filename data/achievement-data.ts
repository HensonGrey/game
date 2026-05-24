import { Achievement } from "../enums/achievement.enum";
import { Item } from "../enums/item.enum";
import { AchievementDefinition } from "../interfaces/achievement.interface";

const GOLDEN_CORE_REALM_INDEX = 3;
const TAP_TARGET = 10_000;

export const achievementDefinitions: Record<
  Achievement,
  AchievementDefinition
> = {
  [Achievement.TEN_THOUSAND_TAPS]: {
    name: "Diligent Cultivator",
    description: "Gather qi by hand ten thousand times.",
    icon: "hand-rock",
    originPointsReward: 50,
    itemReward: Item.PENDANT,
    getProgress: ({ totalTaps }) => ({
      current: Math.min(totalTaps, TAP_TARGET),
      target: TAP_TARGET,
    }),
  },
  [Achievement.REACH_GOLDEN_CORE]: {
    name: "True Lord Ascension",
    description: "Reach the Golden Core realm.",
    icon: "yin-yang",
    originPointsReward: 200,
    itemReward: Item.SWORD,
    getProgress: ({ currentRealmIndex }) => ({
      completed: currentRealmIndex >= GOLDEN_CORE_REALM_INDEX,
    }),
  },
};
