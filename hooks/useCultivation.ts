import { usePlayerStore } from "../store/player-store";
import { getRequiredQi } from "../helpers/cultivation-helper";

export function useCultivation() {
  const { qi, realmIndex, stageIndex } = usePlayerStore((s) => s.currentLife);
  const spiritualRootIndex = usePlayerStore((s) => s.spiritualRootIndex);

  const requiredQi = getRequiredQi(realmIndex, stageIndex);

  const qiMultiplier =
    5 *
    Math.ceil(Math.pow(3.3, spiritualRootIndex)) *
    Math.pow(2, realmIndex * 5 + stageIndex);

  return {
    qi,
    realmIndex,
    stageIndex,
    requiredQi,
    qiMultiplier,
    canBreakthrough: qi >= requiredQi,
  };
}
