import { View, Text, Pressable } from "react-native";
import { usePlayerStore } from "../../store/player-store";
import { realms } from "../../data/cultivation-data";
import { useCultivation } from "../../hooks/useCultivation";

export default function HomeScreen() {
  const addQi = usePlayerStore((s) => s.addQi);
  const breakthrough = usePlayerStore((s) => s.breakthrough);
  const {
    qi,
    realmIndex,
    stageIndex,
    requiredQi,
    qiMultiplier,
    canBreakthrough,
  } = useCultivation();

  return (
    <Pressable
      className="flex-1 items-center justify-center"
      onPress={() => addQi(qiMultiplier)}
    >
      {/* Realm text */}
      <Text className="text-white text-2xl font-bold mb-4">
        {realms[realmIndex].name} - {realms[realmIndex].stages[stageIndex].name}
      </Text>

      {/* Player */}
      <View className="w-72 h-96 rounded-3xl bg-gray-700 items-center justify-center overflow-hidden">
        <View className="absolute bottom-0 w-full bg-black/60 px-4 py-3 items-center">
          <Text className="text-purple-300 font-bold text-base">
            {qi.toLocaleString()} / {requiredQi.toLocaleString()} Qi
          </Text>
        </View>
      </View>

      {/* Breakthrough button */}
      <Pressable
        className={`px-8 py-6 rounded-md w-72 items-center mt-6 ${
          canBreakthrough ? "bg-yellow-500 active:opacity-75" : "bg-gray-600"
        }`}
        onPress={(e) => {
          e.stopPropagation();
          breakthrough();
        }}
        disabled={!canBreakthrough}
      >
        <Text
          className={`font-bold text-lg ${canBreakthrough ? "text-gray-900" : "text-gray-400"}`}
        >
          Breakthrough!
        </Text>
      </Pressable>
    </Pressable>
  );
}
