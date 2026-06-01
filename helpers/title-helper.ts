import { TitleEnum } from "../enums/title.enum";
import { titles } from "../data/title-data";

const getWeight = (name: TitleEnum) =>
  titles.find((t) => t.name === name)?.weight ?? 0;

export const getHighestWeightTitle = (
  owned: TitleEnum[],
): TitleEnum | undefined => {
  if (owned.length === 0) return undefined;
  return [...owned].sort((a, b) => getWeight(b) - getWeight(a))[0];
};