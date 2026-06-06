import { AchievementEnum } from "../enums/achievement.enum";
import { ItemEnum } from "../enums/item.enum";
import { Achievement } from "../interfaces/achievement.interface";

const FOUNDATION_REALM_INDEX = 2;
const TAP_TARGET = 1000;

export const achievements: Achievement[] = [
  {
    id: AchievementEnum.ONE_THOUSAND_TAPS,
    name: "Diligent Cultivator",
    description: "Gather qi by hand one thousand times.",
    icon: "hand-rock",
    originPointsReward: 50,
    itemReward: ItemEnum.PENDANT,
    getProgress: ({ totalTaps }) => ({
      current: Math.min(totalTaps, TAP_TARGET),
      target: TAP_TARGET,
    }),
  },
  {
    id: AchievementEnum.REACH_FOUNDATION_ESTABLISHMENT,
    name: "Immortal Master Ascension",
    description: "Reach the Foundation Establishment realm.",
    icon: "yin-yang",
    originPointsReward: 200,
    itemReward: ItemEnum.SWORD,
    getProgress: ({ currentRealmIndex }) => ({
      completed: currentRealmIndex >= FOUNDATION_REALM_INDEX,
    }),
  },
];