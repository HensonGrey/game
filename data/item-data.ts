import { Item } from "../enums/item.enum";
import { ItemDefinition } from "../interfaces/item.interface";

// todo: real names, flavor text, and gameplay effects
export const itemDefinitions: Record<Item, ItemDefinition> = {
  [Item.PENDANT]: {
    name: "Mystic Pendant",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    emoji: "📿",
  },
  [Item.SWORD]: {
    name: "Ancestral Sword",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    emoji: "⚔️",
  },
};
