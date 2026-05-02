import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const Header = () => {
  const currentAge = 5;
  const maxAge = 80;
  const storePoints = 100;

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
