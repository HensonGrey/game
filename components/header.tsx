import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { usePlayerStore } from "../store/player-store";
import { useEffect } from "react";
import { useRouter } from "expo-router";

const Header = () => {
  const router = useRouter();
  const maxAge = usePlayerStore(
    (state) => state.lifespan + state.vitalityLevel * 20,
  );
  const storePoints = usePlayerStore((state) => state.originPoints);
  const currentAge = usePlayerStore((state) => state.currentAge);

  useEffect(() => {
    if (currentAge >= maxAge) {
      router.replace("/dead");
    }
  }, [currentAge, maxAge]);

  useEffect(() => {
    const interval = setInterval(() => {
      usePlayerStore.setState((state) => ({
        currentAge: state.currentAge + 1,
      }));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="bg-slate-700 px-6 py-4 flex-row items-center justify-between">
      {/* Age */}
      <View className="flex-row items-center gap-3">
        <Text className="text-white text-2xl">Age:</Text>
        <Text className="text-white font-bold text-2xl">
          {currentAge} / {maxAge}
        </Text>
      </View>
      {/* Currency */}
      <View className="flex-row items-center gap-3">
        <FontAwesome5 name="circle" size={30} color="#C084FC" solid />
        <Text className="text-yellow-400 font-bold text-2xl">
          {storePoints}
        </Text>
      </View>
    </View>
  );
};

export default Header;
