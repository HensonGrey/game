import { usePlayerStore } from "../store/player-store";
import { getRequiredQi } from "../helpers/cultivation-helper";
import { getHighestWeightTitle } from "../helpers/title-helper";
import { injuryTypes } from "../constants/injury-constants";
import { titles } from "../data/title-data";
import { useItem } from "./useItem";

export function useCultivation() {
  const { qi, realmIndex, stageIndex } = usePlayerStore((s) => s.currentLife);
  const spiritualRootIndex = usePlayerStore((s) => s.spiritualRootIndex);
  const injuries = usePlayerStore((s) => s.currentLife.injuries);
  const eternalInjuries = usePlayerStore((s) => s.eternalInjuries);
  const ownedTitles = usePlayerStore((s) => s.currentLife.titles);
  const { PENDANT_MULTIPLIER, pendantLevel } = useItem();

  const requiredQi = getRequiredQi(realmIndex, stageIndex);

  const BASE_MULTIPLIER = 5;
  const SPIRITUAL_ROOT_MULTIPLIER = Math.ceil(Math.pow(3, spiritualRootIndex));
  const CULTIVATION_MULTIPLIER = Math.pow(1.4, realmIndex * 4 + stageIndex);

  const INJURY_MULTIPLIER = [...injuries, ...eternalInjuries].reduce(
    (acc, type) =>
      acc * (injuryTypes.find((i) => i.id === type)?.qiMultiplier ?? 1),
    1,
  );

  // Only the highest-weight title's boost applies (titles don't stack).
  const bestTitle = getHighestWeightTitle(ownedTitles);
  const TITLE_MULTIPLIER = bestTitle
    ? (titles.find((t) => t.name === bestTitle)?.multiplier ?? 1)
    : 1;

  const qiMultiplier =
    BASE_MULTIPLIER *
    SPIRITUAL_ROOT_MULTIPLIER *
    CULTIVATION_MULTIPLIER *
    INJURY_MULTIPLIER *
    PENDANT_MULTIPLIER *
    TITLE_MULTIPLIER;

  return {
    qi,
    realmIndex,
    stageIndex,
    requiredQi,
    qiMultiplier,
    canBreakthrough: qi >= requiredQi,

    BASE_MULTIPLIER,
    SPIRITUAL_ROOT_MULTIPLIER,
    CULTIVATION_MULTIPLIER,
    INJURY_MULTIPLIER,
    PENDANT_MULTIPLIER,
    TITLE_MULTIPLIER,
    pendantLevel,

    injuries,
    eternalInjuries,
  };
}
