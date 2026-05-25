import { usePlayerStore } from "../store/player-store";
import { Item } from "../enums/item.enum";
import {
  getItemUpgradeCost,
  getPendantQiBoost,
  getSwordDmgReduction,
} from "../helpers/item-helper";
import { ITEM_MAX_LEVEL } from "../interfaces/item.interface";

export function useItem() {
  const itemLevels = usePlayerStore((s) => s.itemLevels);
  const originPoints = usePlayerStore((s) => s.originPoints);
  const upgradeItem = usePlayerStore((s) => s.upgradeItem);

  const pendantLevel = itemLevels[Item.PENDANT] ?? 0;
  const swordLevel = itemLevels[Item.SWORD] ?? 0;

  const PENDANT_MULTIPLIER = getPendantQiBoost(pendantLevel);
  const SWORD_MULTIPLIER = getSwordDmgReduction(swordLevel);

  const unlockedItems = Object.keys(itemLevels) as Item[];

  const getUpgradeInfo = (item: Item) => {
    const level = itemLevels[item] ?? 0;
    const atMax = level >= ITEM_MAX_LEVEL;
    const cost = atMax ? 0 : getItemUpgradeCost(item, level);
    return {
      level,
      atMax,
      cost,
      canAfford: !atMax && originPoints >= cost,
    };
  };

  return {
    itemLevels,
    unlockedItems,
    pendantLevel,
    swordLevel,
    PENDANT_MULTIPLIER,
    SWORD_MULTIPLIER,
    upgradeItem,
    getUpgradeInfo,
  };
}
