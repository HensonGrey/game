import { Title } from "../enums/title.enum";
import { TitleType } from "../enums/title-type.enum";
import { TitleDefinition } from "../interfaces/player.interface";

export const titleDefinitions: Record<Title, TitleDefinition> = {
  // ─── Reincarnation ─────────────────────────────────────
  [Title.IMMORTAL_MASTER_REINCARNATION]: {
    weight: 1,
    name: "Immortal Master's Reincarnation",
    type: TitleType.REINCARNATION,
    description: "",
    multiplier: 1,
  },
  [Title.TRUE_LORD_REINCARNATION]: {
    weight: 2,
    name: "Golden Core True Lord's Reincarnation",
    type: TitleType.REINCARNATION,
    description: "",
    multiplier: 1,
  },
};
