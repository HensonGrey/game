import { View, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Upgrade } from "../interfaces/store-upgrade.interface";

interface Props {
  upgrade: Upgrade;
  canAfford: boolean;
  onPress: () => void;
  onInfoPress: () => void;
}

const UpgradeCard = ({ upgrade, canAfford, onPress, onInfoPress }: Props) => {
  return (
    <View
      className={`w-full border-2 rounded-2xl ${
        canAfford
          ? "bg-black/70 border-amber-500/40 shadow-xl"
          : "bg-black/50 border-white/10 opacity-70"
      }`}
    >
      <View className="px-4 py-4">
        <View className="flex-row items-center justify-between">
          {/* Left Side: Glowing Talisman Badge and Details */}
          <Pressable
            onPress={onInfoPress}
            className="flex-row items-center flex-1 pr-3"
          >
            {/* Square 1:1 Icon Badge */}
            <View
              className={`w-12 h-12 items-center justify-center border rounded-xl ${
                canAfford
                  ? "bg-amber-500/15 border-amber-500/40"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <FontAwesome5
                name={upgrade.icon}
                size={18}
                color={canAfford ? "#fbbf24" : "#6b7280"}
                solid
              />
            </View>

            {/* Upgrade Titles */}
            <View className="ml-3 flex-shrink">
              <Text
                className={`text-md font-bold tracking-wide ${
                  canAfford ? "text-amber-300" : "text-gray-500"
                }`}
              >
                {upgrade.label}
              </Text>
              <Text className="text-amber-200/50 text-[10px] font-mono font-bold mt-0.5">
                [{upgrade.levelLabel ?? `STAGE ${upgrade.level}`}]
              </Text>
            </View>
          </Pressable>

          {/* Right Side: Buy Button */}
          <Pressable
            onPress={onPress}
            disabled={!canAfford || upgrade.isMaxed}
            className={`px-4 py-2 border rounded-xl ${
              canAfford && !upgrade.isMaxed
                ? "bg-amber-600 border-amber-300/50 active:bg-amber-700"
                : "bg-white/5 border-white/10"
            }`}
            style={
              canAfford && !upgrade.isMaxed ? { borderBottomWidth: 4 } : {}
            }
          >
            {upgrade.isMaxed ? (
              <Text className="text-gray-500 text-xs font-bold tracking-widest">
                MAXED
              </Text>
            ) : (
              <View className="flex-row items-center gap-x-1">
                <Text
                  className={`text-sm font-bold font-mono ${canAfford ? "text-white" : "text-gray-500"}`}
                >
                  {upgrade.cost}
                </Text>
                <Text
                  className={`text-[9px] font-bold ${canAfford ? "text-amber-200" : "text-gray-500"}`}
                >
                  QI
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default UpgradeCard;
