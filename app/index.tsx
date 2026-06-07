import { View, ActivityIndicator, Text } from "react-native";
import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { Route } from "../enums/route.enum";
import { usePlayerStore } from "../store/player-store";
import { IS_DEV } from "../constants/env";

export default function Loading() {
  // The persisted save rehydrates from AsyncStorage asynchronously. Seed from
  // hasHydrated() in case it already finished (fast storage or a remount).
  // In dev, hydration is skipped entirely, so the store is ready immediately.
  const [hydrated, setHydrated] = useState(
    () => IS_DEV || usePlayerStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (hydrated) return;
    const unsub = usePlayerStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    return unsub;
  }, [hydrated]);

  // Redirect declaratively rather than calling router.replace in an effect, so
  // navigation waits for the root navigator to mount instead of racing it.
  if (hydrated) {
    return <Redirect href={Route.HOME} />;
  }

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <View
        style={{
          width: 120,
          height: 120,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator
          size="large"
          color="#C084FC"
          style={{ transform: [{ scale: 3 }] }}
        />
      </View>

      <Text className="text-white text-lg mt-8">Loading player data...</Text>
    </View>
  );
}
