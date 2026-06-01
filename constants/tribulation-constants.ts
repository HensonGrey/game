// ─── Lightning ──────────────────────────────────────────────────────────────
export const BASE_STRIKE_INTERVAL_MS = 800; // Time between lightning strikes at realm 0. Scales down per realm.
export const BASE_BURST_DAMAGE = 2; // Instant HP damage dealt by a single lightning strike at realm 0.
export const BASE_CHARGE_PER_STRIKE = 5; // Aura charge added to the player on each strike at realm 0.
export const BASE_TAP_RELIEF = 5; // Charge removed from the aura per tap on the player at realm 0.
export const BASE_DOT_RATE = 0.1; // HP lost per tick per unit of charge (DoT severity) at realm 0.
export const DOT_TICK_MS = 100; // How often the aura-charge damage-over-time tick fires (ms). Not realm-scaled.

export const STRIKE_INTERVAL_FACTOR = 0.9; // Per-realm multiplier on strike interval. <1 = strikes get faster each realm.
export const CHARGE_FACTOR = 1.35; // Per-realm multiplier on charge added per strike. Charge grows fast per realm.
export const TAP_RELIEF_FACTOR = 1.15; // Per-realm multiplier on tap relief. Grows slower than CHARGE_FACTOR so each realm forces more taps.
export const BURST_DAMAGE_FACTOR = 1.25; // Per-realm multiplier on burst damage. Strikes hit harder each realm.
export const DOT_RATE_FACTOR = 1.2; // Per-realm multiplier on DoT rate. Residual aura burns hotter each realm.

export const COOLDOWN_AFTER_LAST_STRIKE_MS = 700; // Delay after the cloud dies before breakthrough resolves and the player is returned home (ms).

export const LIGHTNING_FLASH_MS = 340; // Duration of a single lightning strike from cloud to player (ms). Higher = slower descent.
export const BOLT_DESCENT_TICK_MS = 16; // Tick interval for the bolt's progressive descent animation (ms). ~16ms ≈ 60fps.
export const BOLT_SEGMENTS = [
  // Jagged segments of the lightning bolt. `ml` is horizontal stagger; `skew` is the segment angle.
  { ml: 0, skew: "-12deg" },
  { ml: 14, skew: "16deg" },
  { ml: -10, skew: "-18deg" },
  { ml: 16, skew: "12deg" },
  { ml: -6, skew: "-10deg" },
];

// ─── Cloud ──────────────────────────────────────────────────────────────────
export const BASE_CLOUD_TAP_DAMAGE = 1; // Damage dealt to the cloud per tap at realm 0.
export const CLOUD_TAP_DAMAGE_FACTOR = 1.15; // Per-realm multiplier on cloud tap damage.

// HP fraction thresholds at which the cloud loses circles. Each threshold removes 2 circles from the 9-circle cloud bank.
export const CLOUD_SHRINK_THRESHOLDS = [0.8, 0.5, 0.2] as const;

// Cloud color interpolation endpoints. High HP = aggressive deep indigo; low HP = pale wispy slate.
export const CLOUD_COLOR_FULL = { r: 76, g: 29, b: 149 };
export const CLOUD_COLOR_EMPTY = { r: 148, g: 163, b: 184 };
