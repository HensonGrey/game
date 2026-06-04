import { ItemEnum } from "../enums/item.enum";
import { Item } from "../interfaces/item.interface";
import pendantImage from "../assets/pendant.png";
import swordImage from "../assets/sword.png";

export const items: Item[] = [
  {
    id: ItemEnum.PENDANT,
    name: "Purple Gold Mysterious Pendant",
    description:
      "A pendant forged from purple-gold meteorite, sect insignia worn smooth by ten thousand years. Qi gathers around it of its own accord.",
    image: pendantImage,
    baseCost: 50,
  },
  {
    id: ItemEnum.SWORD,
    name: "Mortal Sword",
    description: "Rusted bronze sword with its tip missing",
    image: swordImage,
    baseCost: 100,
  },
];