import { ItemEnum } from "../enums/item.enum";
import { items } from "../data/item-data";
import { ITEM_COST_GROWTH } from "../interfaces/item.interface";

// Unlock = level 1; level caps at ITEM_MAX_LEVEL.
// Cost to upgrade FROM the current level: baseCost at L1, then ×1.8 per level.
export const getItemUpgradeCost = (
  item: ItemEnum,
  currentLevel: number,
): number => {
  const baseCost = items.find((i) => i.id === item)?.baseCost ?? 0;
  return Math.ceil(baseCost * Math.pow(ITEM_COST_GROWTH, currentLevel - 1));
};

// +10% qi multiplier per level: L1 = ×1.1, L10 = ×2.0
export const getPendantQiBoost = (level: number): number => 1 + level * 0.1;

// 5% tribulation burst-damage reduction per level: L1 = ×0.95, L10 = ×0.5
export const getSwordDmgReduction = (level: number): number =>
  1 - level * 0.05;
