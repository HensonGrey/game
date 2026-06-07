// EXPO_PUBLIC_ vars are inlined into the bundle at build time, so restart the
// dev server (not just reload) after changing them.

/**
 * Dev-mode toggle, driven by EXPO_PUBLIC_DEV in .env. Gates dev-only
 * conveniences such as wiping the persisted save on boot and starting with a
 * boosted spiritual root. Ships as `false` for any real build.
 */
export const IS_DEV = process.env.EXPO_PUBLIC_DEV === "true";
