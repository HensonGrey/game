import { TitleEnum } from "../enums/title.enum";
import { Realm } from "../interfaces/realm.interface";

export const realms: Realm[] = [
  {
    name: "Body Strengthening",
    description: "",
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
    description:
      "A legendary existence among mortals. Walks on the wind, shrugs off blade and plague, and counts lifespan in centuries rather than decades.",
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
    description:
      "Supreme! Lifespans of thousands of years are no obstacle, and mountains tremble beneath their gaze.",
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
    description:
      "True Lord. A core of compressed Dao spins within the dantian — and the Heavens count its bearer among enemies, not subjects.",
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
    description:
      "Dao Lord. The golden core ruptures and births a second self — soul and body walk apart, and a single thought reshapes the land for a thousand miles.",
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
