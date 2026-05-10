import { usePlayerStore } from "../store/player-store";
import { getRequiredQi } from "../helpers/cultivation-helper";

export function useCultivation() {
  const { qi, realmIndex, stageIndex } = usePlayerStore((s) => s.currentLife);
  const spiritualRootIndex = usePlayerStore((s) => s.spiritualRootIndex);

  const requiredQi = getRequiredQi(realmIndex, stageIndex);

  const BASE_MULTIPLIER = 5;
  const SPIRITUAL_ROOT_MULTIPLIER = Math.ceil(Math.pow(3, spiritualRootIndex));
  const CULTIVATION_MULTIPLIER = Math.pow(1.4, realmIndex * 4 + stageIndex);

  const qiMultiplier =
    BASE_MULTIPLIER * SPIRITUAL_ROOT_MULTIPLIER * CULTIVATION_MULTIPLIER;

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
  };
}
