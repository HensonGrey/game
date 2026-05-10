import { View, Text } from "react-native";
import { usePlayerStore } from "../store/player-store";
import { useEffect } from "react";
import { useRouter } from "expo-router";

const Header = () => {
  const router = useRouter();
  const currentAge = usePlayerStore((state) => state.currentLife.currentAge);
  const maxAge = usePlayerStore((state) => state.currentLife.maxAge);

  useEffect(() => {
    const interval = setInterval(() => {
      const { currentLife } = usePlayerStore.getState();
      if (currentLife.currentAge >= currentLife.maxAge) {
        clearInterval(interval);
        router.replace("/dead");
        return;
      }
      usePlayerStore.setState((state) => ({
        currentLife: {
          ...state.currentLife,
          currentAge: state.currentLife.currentAge + 1,
        },
      }));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="bg-slate-700 px-6 py-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Text className="text-white text-2xl">Age:</Text>
        <Text className="text-white font-bold text-2xl">
          {currentAge} / {Math.ceil(maxAge)}
        </Text>
      </View>
    </View>
  );
};

export default Header;
