import { Title } from "../enums/title.enum";
import { titleDefinitions } from "../data/title-data";

export const getHighestWeightTitle = (titles: Title[]): Title | undefined => {
  if (titles.length === 0) return undefined;
  return [...titles].sort(
    (a, b) => titleDefinitions[b].weight - titleDefinitions[a].weight
  )[0];
};
