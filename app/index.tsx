import { View, ActivityIndicator, Text } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";

export default function Loading() {
  useEffect(() => {
    // Simulate fetching user data
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // replace with real fetch
      router.replace("/home");
    };

    fetchData();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-gray-900 gap-4">
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
