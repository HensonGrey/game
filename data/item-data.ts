import { Item } from "../enums/item.enum";
import { ItemDefinition } from "../interfaces/item.interface";

export const itemDefinitions: Record<Item, ItemDefinition> = {
  [Item.PENDANT]: {
    name: "Purple Gold Mysterious Pendant",
    description:
      "A pendant forged from purple-gold meteorite, sect insignia worn smooth by ten thousand years. Qi gathers around it of its own accord.",
    emoji: "📿",
    baseCost: 50,
  },
  [Item.SWORD]: {
    name: "Mortal Sword",
    description: "Rusted bronze sword with its tip missing",
    emoji: "⚔️",
    baseCost: 100,
  },
};
