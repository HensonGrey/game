import { Slot } from "expo-router";
import "../global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { setupGlobalErrorHandler } from "../helpers/global-error-handler";
import { usePlayerStore } from "../store/player-store";
import { IS_DEV } from "../constants/env";

setupGlobalErrorHandler();

// Dev only: purge the persisted save on boot so testing always starts clean.
if (IS_DEV) {
  usePlayerStore.persist.clearStorage();
}

export default function Layout() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <Slot />
    </SafeAreaView>
  );
}
