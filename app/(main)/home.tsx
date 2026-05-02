import { View, Text, Pressable, Alert } from "react-native";

export default function HomeScreen() {
  const getRealm = (): string => {
    return "Qi Condensation - 9th Heavenly Layer";
  };
  const currentQi = 1240;
  const requiredQi = 10000;
  const title = "True Monarch";

  return (
    <View className="flex-1 items-center justify-center bg-gray-900 px-6 py-4">
      <Pressable className="flex-1 w-full items-center justify-center active:opacity-75">
        {/* Title */}
        {title && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              Alert.alert("Title", `You hold the title: ${title}`);
            }}
          >
            <Text className="text-yellow-300 text-xl font-semibold mt-1 mb-4">
              {title}
            </Text>
          </Pressable>
        )}

        {/* Realm text */}
        <Text className="text-white text-2xl font-bold mb-6">{getRealm()}</Text>

        {/* Player */}
        <View className="w-72 h-96 rounded-3xl bg-gray-700 items-center justify-center overflow-hidden">
          <View className="absolute bottom-0 w-full bg-black/60 px-4 py-3 items-center">
            <Text className="text-purple-300 font-bold text-base">
              {currentQi.toLocaleString()} / {requiredQi.toLocaleString()} Qi
            </Text>
          </View>
        </View>

        {/* Breakthrough button */}
        <Pressable className="bg-yellow-500 px-8 py-6 rounded-md active:opacity-75 mt-16 w-72 items-center">
          <Text className="text-gray-900 font-bold text-lg">Breakthrough!</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}
