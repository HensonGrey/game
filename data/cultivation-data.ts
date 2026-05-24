import { Title } from "../enums/title.enum";
import { Realm } from "../interfaces/realm.interface";

export const realms: Realm[] = [
  {
    name: "Body Strengthening",
    stages: [
      { name: "Skin Refining", description: "" },
      { name: "Muscle Cleansing", description: "" },
      { name: "Bone Tempering", description: "" },
      { name: "Marrow Washing", description: "" },
      { name: "Organ Forging", description: "" },
      { name: "Meridian Opening", description: "" },
    ],
  },
  {
    name: "Qi Gathering",
    stages: [
      { name: "1st Heavenly Layer", description: "" },
      { name: "2nd Heavenly Layer", description: "" },
      { name: "3rd Heavenly Layer", description: "" },
      { name: "4th Heavenly Layer", description: "" },
      { name: "5th Heavenly Layer", description: "" },
      { name: "6th Heavenly Layer", description: "" },
      { name: "7th Heavenly Layer", description: "" },
      { name: "8th Heavenly Layer", description: "" },
      { name: "9th Heavenly Layer", description: "" },
    ],
  },
  {
    name: "Foundation Establishment",
    title: Title.IMMORTAL_MASTER_REINCARNATION,
    stages: [
      { name: "Early Stage", description: "" },
      { name: "Middle Stage", description: "" },
      { name: "Late Stage", description: "" },
      { name: "Perfection", description: "" },
    ],
  },
  {
    name: "Golden Core",
    title: Title.TRUE_LORD_REINCARNATION,
    stages: [
      { name: "Early Stage", description: "" },
      { name: "Middle Stage", description: "" },
      { name: "Late Stage", description: "" },
      { name: "Perfection", description: "" },
    ],
  },
];
