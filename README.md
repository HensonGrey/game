# Project

Cultivation-progression game on Expo + React Native. Map of where things live.

Stack: Expo Router, React Native, NativeWind, Zustand, TypeScript.
Run with `npm start`. Test with `npm test`. Lint with `npm run lint`.

## Screens — [app/](app/)

Route enum in [enums/route.enum.ts](enums/route.enum.ts). Root layout in [app/\_layout.tsx](app/_layout.tsx).

- [app/index.tsx](app/index.tsx) — splash, redirects to /home
- [app/home.tsx](app/home.tsx) — main loop (qi, breakthrough, modals)
- [app/tribulation.tsx](app/tribulation.tsx) — trial mini-game
- [app/dead.tsx](app/dead.tsx) — end-of-life
- [app/store.tsx](app/store.tsx) — OP shop

## State — [store/player-store.ts](store/player-store.ts)

Single Zustand store, shape in [interfaces/player.interface.ts](interfaces/player.interface.ts).

Cross-life fields (persist through reincarnate): spiritualRootIndex, vitalityLevel, originPoints, lives, eternalInjuries, totalTaps, claimedAchievements, itemLevels.

Per-life (currentLife: Life): realmIndex, stageIndex, qi, currentAge, maxAge, currentHp, maxHp, titles, injuries.

Actions: addQi, breakthrough, recordDeath, reincarnate, inflictInjury, purchaseUpgrade, claimAchievement, upgradeItem.

## Hooks — [hooks/](hooks/)

Anything that reads the store lives here.

- [useCultivation](hooks/useCultivation.ts) — qiMultiplier + its named pieces, requiredQi, canBreakthrough
- [useTribulation](hooks/useTribulation.ts) — tribulation loop, tuning memo
- [useItem](hooks/useItem.ts) — single entry point for item state: levels, multipliers, upgradeItem, getUpgradeInfo

## Components — [components/](components/)

- [stat-button](components/stat-button.tsx) — pill button (home header)
- [continuation-modal](components/continuation-modal.tsx) — generic yellow prompt
- [item-modal](components/item-modal.tsx) — item detail + upgrade
- [upgrade-modal](components/upgrade-modal.tsx), [upgrade-card](components/upgrade-card.tsx) — store screen
- [cloud](components/cloud.tsx), [lightning-bolt](components/lightning-bolt.tsx) — tribulation visuals

## Helpers — [helpers/](helpers/)

Pure functions, no store reads.

- [cultivation-helper](helpers/cultivation-helper.ts) — getGlobalLevel, getRequiredQi, getLifespanIncrease, getOriginPointsReward, getStrength, getNextState, formatNumbers
- [item-helper](helpers/item-helper.ts) — getItemUpgradeCost, getPendantQiBoost, getSwordDmgReduction
- [title-helper](helpers/title-helper.ts) — getHighestWeightTitle

## Data — [data/](data/)

Typed arrays (`T[]`). Looked up by index or `.find()` at call sites.

- [cultivation-data](data/cultivation-data.ts) — `realms: Realm[]`
- [spiritual-root-data](data/spiritual-root-data.ts) — `roots: SpiritualRoot[]`
- [title-data](data/title-data.ts) — `titles: Title[]`
- [achievement-data](data/achievement-data.ts) — `achievements: Achievement[]`; threshold constants at top of file
- [item-data](data/item-data.ts) — `items: Item[]`

## Interfaces — [interfaces/](interfaces/)

Shape definitions per feature. Item constants ITEM_MAX_LEVEL = 10 and ITEM_COST_GROWTH = 1.8 live in [item.interface.ts](interfaces/item.interface.ts). UPGRADE_TYPES lives in [store-upgrade.interface.ts](interfaces/store-upgrade.interface.ts).

## Constants — [constants/](constants/)

Tuning knobs.

- [life-constants](constants/life-constants.ts) — MIN/MAX lifespan
- [injury-constants](constants/injury-constants.ts) — INJURY_EFFECTS map
- [tribulation-constants](constants/tribulation-constants.ts) — base values + per-realm factors used by the tribulation tuning memo

## Flows

Cultivate → breakthrough. Tap [home](app/home.tsx) calls addQi(qiMultiplier). qiMultiplier is built in [useCultivation](hooks/useCultivation.ts) as base × root × cultivation × injuries × pendant. requiredQi comes from getRequiredQi in [cultivation-helper](helpers/cultivation-helper.ts). Breakthrough either advances within the realm or routes to /tribulation.

Tribulation. [useTribulation](hooks/useTribulation.ts) owns the loop (strike timer, DoT, HP watcher). Sword level scales tuning.burstDamage. Injury thresholds: HP ≤ 0.5 inflicts NORMAL, ≤ 0.2 inflicts ETERNAL. Success calls breakthrough; failure routes to /dead.

Death + reincarnation. Age watcher in [home](app/home.tsx) routes to /dead when currentAge ≥ maxAge. recordDeath snapshots the life and awards the realm title. reincarnate rolls a fresh Life with vitality + injury adjustments; cross-life fields stay.

Achievements + items. Definitions in [achievement-data](data/achievement-data.ts); each entry's getProgress reads { totalTaps, currentRealmIndex }. To depend on new state, widen AchievementProgressSource in [achievement.interface.ts](interfaces/achievement.interface.ts) and thread it through claimAchievement. Claim grants OP and sets itemLevels[itemReward] = 1. Tapping an unlocked tile opens [item-modal](components/item-modal.tsx), where upgradeItem spends OP and bumps the level. Pendant boosts qi +10% / lvl; sword reduces tribulation damage 5% / lvl. Cap = 10.

## Tests — [**tests**/](__tests__/)

Jest 29 + jest-expo preset. Run with `npm test`. 108 tests across 10 suites.

- `helpers/` — pure function coverage (cultivation-helper, item-helper, title-helper)
- `store/player-store.test.ts` — all store actions (addQi, breakthrough, inflictInjury, recordDeath, reincarnate, purchaseUpgrade, claimAchievement, upgradeItem)
- `hooks/useCultivation.test.ts`, `hooks/useItem.test.ts` — hook output and multiplier composition against a real (non-persisted) store
- `app/` — screen-level render + interaction tests (index, dead, store); home covered by `home.test.tsx`

Mocks live in `__mocks__/`: AsyncStorage (`@react-native-async-storage/async-storage`) and image files (`fileMock.ts`). Store mocks in app tests create a real Zustand store inside `jest.mock()` factories and attach a `.persist` stub manually.

## Tooling

Pre-commit: `lint-staged` runs ESLint (--fix) + Prettier on staged `*.{ts,tsx}` files via Husky.
Pre-push: `npm test` — push is aborted if any test fails.

ESLint config: [eslint.config.js](eslint.config.js) (flat config, ESLint v10). Plugins: `@typescript-eslint`, `react-hooks`, `eslint-config-prettier`.
Prettier config: [.prettierrc](.prettierrc).

## Conventions

- Typed arrays (`T[]`) for static data tables. Looked up by index or `.find()` at call sites.
- Pure helpers vs stateful hooks. Anything reading the store goes in [hooks/](hooks/).
- Cross-life data on Player; per-life data on Life. reincarnate replaces currentLife only.
- Components prefer hook consumption over direct store reads where a hook already exposes the value.
