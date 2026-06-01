import { Title } from "../enums/title.enum";
import { TitleType } from "../enums/title-type.enum";
import { TitleDefinition } from "../interfaces/player.interface";

export const titleDefinitions: Record<Title, TitleDefinition> = {
  // ─── Reincarnation ─────────────────────────────────────
  [Title.IMMORTAL_MASTER_REINCARNATION]: {
    weight: 1,
    name: "Immortal Master's Reincarnation",
    type: TitleType.REINCARNATION,
    description:
      "Scriptures elders spent forty years deciphering provoke only a yawn. Wild beasts within a li lower their heads when this soul passes, and never quite remember why.",
    multiplier: 1,
  },
  [Title.TRUE_LORD_REINCARNATION]: {
    weight: 2,
    name: "Golden Core True Lord's Reincarnation",
    type: TitleType.REINCARNATION,
    description:
      "Mortals who hold that stare too long forget their own names. Sealed arts and forbidden techniques are dull recollections from a body long since dust, and the wind itself bends aside in passing.",
    multiplier: 1,
  },
  [Title.DAO_LORD_REINCARNATION]: {
    weight: 3,
    name: "Nascent Soul Dao Lord's Reincarnation",
    type: TitleType.REINCARNATION,
    description:
      "Hermits a thousand li distant dream of that face and wake afraid. Storms quiet over any roof that shelters such a soul. The Heavenly Dao has not yet decided whether to permit this existence a second time — and the deciding hangs in the air.",
    multiplier: 1,
  },
};
