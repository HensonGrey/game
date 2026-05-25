export const ITEM_MAX_LEVEL = 10;
export const ITEM_COST_GROWTH = 1.8;

export interface ItemDefinition {
  name: string;
  description: string;
  // todo: replace with real artwork; emoji is a stand-in
  emoji: string;
  // Origin Points cost for the level 0 → 1 upgrade. Subsequent levels scale geometrically.
  baseCost: number;
}
