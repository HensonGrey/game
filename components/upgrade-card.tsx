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
      className={`w-full rounded-[40px] border-2 ${
        canAfford
          ? "bg-slate-800 border-purple-500/20"
          : "bg-slate-900 border-slate-800 opacity-95"
      }`}
    >
      <View className="px-6 py-5">
        <View className="flex-row items-center justify-between">
          {/* Left: tappable info area */}
          <Pressable
            onPress={onInfoPress}
            className="flex-row items-center flex-1 pr-4"
          >
            <View
              className={`w-14 h-14 items-center justify-center rounded-2xl ${
                canAfford ? "bg-purple-500/10" : "bg-slate-950"
              }`}
            >
              <FontAwesome5
                name={upgrade.icon}
                size={22}
                color={canAfford ? "#C084FC" : "#475569"}
                solid
              />
            </View>
            <View className="ml-4 flex-shrink">
              <Text
                className={`text-lg font-black tracking-tight leading-5 ${
                  canAfford ? "text-white" : "text-slate-600"
                }`}
              >
                {upgrade.label}
              </Text>
              <Text className="text-purple-500/60 text-[9px] font-black uppercase tracking-[2px] mt-1">
                {upgrade.levelLabel ?? `LVL ${upgrade.level}`}
              </Text>
            </View>
          </Pressable>

          {/* Buy button */}
          <Pressable
            onPress={onPress}
            disabled={!canAfford || upgrade.isMaxed}
            className={`px-5 py-3 rounded-2xl items-center justify-center ${
              canAfford && !upgrade.isMaxed
                ? "bg-purple-600"
                : "bg-slate-950 border border-slate-800"
            }`}
          >
            {upgrade.isMaxed ? (
              <Text className="text-slate-500 text-sm font-black tracking-widest">
                MAX
              </Text>
            ) : (
              <View className="flex-row items-baseline gap-1">
                <Text
                  className={`text-lg font-black ${canAfford ? "text-white" : "text-slate-700"}`}
                >
                  {upgrade.cost}
                </Text>
                <Text
                  className={`text-[10px] font-bold ${canAfford ? "text-purple-200" : "text-slate-800"}`}
                >
                  PTS
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
