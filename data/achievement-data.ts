import { AchievementEnum } from "../enums/achievement.enum";
import { ItemEnum } from "../enums/item.enum";
import { Achievement } from "../interfaces/achievement.interface";

const GOLDEN_CORE_REALM_INDEX = 1;
const TAP_TARGET = 20;

export const achievements: Achievement[] = [
  {
    id: AchievementEnum.TEN_THOUSAND_TAPS,
    name: "Diligent Cultivator",
    description: "Gather qi by hand ten thousand times.",
    icon: "hand-rock",
    originPointsReward: 50,
    itemReward: ItemEnum.PENDANT,
    getProgress: ({ totalTaps }) => ({
      current: Math.min(totalTaps, TAP_TARGET),
      target: TAP_TARGET,
    }),
  },
  {
    id: AchievementEnum.REACH_GOLDEN_CORE,
    name: "True Lord Ascension",
    description: "Reach the Golden Core realm.",
    icon: "yin-yang",
    originPointsReward: 200,
    itemReward: ItemEnum.SWORD,
    getProgress: ({ currentRealmIndex }) => ({
      completed: currentRealmIndex >= GOLDEN_CORE_REALM_INDEX,
    }),
  },
];