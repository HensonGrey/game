import { View, Text, Pressable } from "react-native";
import { usePlayerStore } from "../../store/player-store";

export default function HomeScreen() {
  const getRealm = usePlayerStore((state) => state.getRealm);
  const getStage = usePlayerStore((state) => state.getStage);
  const addQi = usePlayerStore((state) => state.addQi);
  const breakthrough = usePlayerStore((state) => state.breakthrough);

  const realm = getRealm();
  const stage = getStage();

  const currentQi = usePlayerStore((state) => state.qi);
  const requiredQi = usePlayerStore((state) => state.getRequiredQi());
  const qiMultiplier = usePlayerStore((state) => state.qiMultiplier);

  const canBreakthrough = currentQi >= requiredQi;

  return (
    <Pressable
      className="flex-1 items-center justify-center"
      onPress={() => addQi(qiMultiplier)}
    >
      {/* Realm text */}
      <Text className="text-white text-2xl font-bold mb-4">
        {realm.realm} - {stage.name}
      </Text>

      {/* Player */}
      <View className="w-72 h-96 rounded-3xl bg-gray-700 items-center justify-center overflow-hidden">
        <View className="absolute bottom-0 w-full bg-black/60 px-4 py-3 items-center">
          <Text className="text-purple-300 font-bold text-base">
            {currentQi.toLocaleString()} / {requiredQi.toLocaleString()} Qi
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
