import { ItemEnum } from "../enums/item.enum";
import { Item } from "../interfaces/item.interface";

export const items: Item[] = [
  {
    id: ItemEnum.PENDANT,
    name: "Purple Gold Mysterious Pendant",
    description:
      "A pendant forged from purple-gold meteorite, sect insignia worn smooth by ten thousand years. Qi gathers around it of its own accord.",
    emoji: "📿",
    baseCost: 50,
  },
  {
    id: ItemEnum.SWORD,
    name: "Mortal Sword",
    description: "Rusted bronze sword with its tip missing",
    emoji: "⚔️",
    baseCost: 100,
  },
];