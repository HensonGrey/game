import { TitleEnum } from "../enums/title.enum";
import { Realm } from "../interfaces/realm.interface";

export const realms: Realm[] = [
  {
    name: "Body Strengthening",
    color: "#4ade80", // green
    stages: [
      { name: "Skin Refining" },
      { name: "Muscle Cleansing" },
      { name: "Bone Tempering" },
      { name: "Marrow Washing" },
      { name: "Organ Forging" },
      { name: "Meridian Opening" },
    ],
  },
  {
    name: "Qi Gathering",
    color: "#22d3ee", // cyan
    stages: [
      { name: "1st Heavenly Layer" },
      { name: "2nd Heavenly Layer" },
      { name: "3rd Heavenly Layer" },
      { name: "4th Heavenly Layer" },
      { name: "5th Heavenly Layer" },
      { name: "6th Heavenly Layer" },
      { name: "7th Heavenly Layer" },
      { name: "8th Heavenly Layer" },
      { name: "9th Heavenly Layer" },
    ],
  },
  {
    name: "Foundation Establishment",
    title: TitleEnum.IMMORTAL_MASTER_REINCARNATION,
    color: "#3b82f6", // blue
    stages: [
      { name: "Early Stage" },
      { name: "Middle Stage" },
      { name: "Late Stage" },
      { name: "Perfection" },
    ],
  },
  {
    name: "Golden Core",
    title: TitleEnum.TRUE_LORD_REINCARNATION,
    color: "#fbbf24", // gold
    stages: [
      { name: "Early Stage" },
      { name: "Middle Stage" },
      { name: "Late Stage" },
      { name: "Perfection" },
    ],
  },
  {
    name: "Nascent Soul",
    title: TitleEnum.DAO_LORD_REINCARNATION,
    color: "#a855f7", // purple
    stages: [
      { name: "Early Stage" },
      { name: "Middle Stage" },
      { name: "Late Stage" },
      { name: "Perfection" },
    ],
  },
];
