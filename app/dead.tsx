import { View, Text, Pressable } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { usePlayerStore } from "../store/player-store";
import { FontAwesome5 } from "@expo/vector-icons";
import { realms } from "../data/cultivation-data";
import { Route } from "../enums/route.enum";

export default function Dead() {
  const router = useRouter();

  const { currentAge, realmIndex, stageIndex } = usePlayerStore(
    (state) => state.currentLife,
  );

  useEffect(() => {
    usePlayerStore.getState().recordDeath();
  }, []);

  const reincarnate = () => {
    router.replace(Route.STORE);
  };

  return (
    <View className="flex-1 px-8 justify-center">
      {/* BACKGROUND LAYER - Perfectly Centered Texture */}
      <View className="absolute inset-0 items-center justify-center opacity-5">
        <FontAwesome5 name="yin-yang" size={380} color="white" />
      </View>

      {/* CONTENT LAYER */}
      <View className="items-center">
        {/* Header Section */}
        <View className="items-center mb-10">
          <Text className="text-red-600 text-6xl font-black italic tracking-tighter">
            DEAD
          </Text>
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-[5px] mt-2 ml-1">
            Dao Extinguished
          </Text>
        </View>

        {/* The Heavenly Record Card */}
        <View className="w-full bg-slate-900/60 border border-slate-800 p-8 rounded-[40px] items-center shadow-2xl">
          <View className="flex-row items-center gap-x-3 mb-6 w-full">
            <View className="h-[1px] flex-1 bg-slate-800" />
            <FontAwesome5 name="scroll" size={12} color="#475569" />
            <View className="h-[1px] flex-1 bg-slate-800" />
          </View>

          <Text className="text-slate-400 text-xs font-black uppercase tracking-[3px] mb-2">
            Final Age
          </Text>
          <Text className="text-white text-5xl font-black mb-8">
            {currentAge}
          </Text>

          <Text className="text-slate-400 text-xs font-black uppercase tracking-[3px] mb-4">
            Highest Attainment
          </Text>

          <View className="items-center bg-purple-500/10 border border-purple-500/20 py-4 px-6 rounded-2xl w-full">
            <Text className="text-purple-300 font-black tracking-widest text-xl uppercase text-center">
              {realms[realmIndex].name}
            </Text>
            <Text className="text-slate-300 text-sm mt-1.5 font-semibold italic uppercase tracking-wide text-center">
              {realms[realmIndex].stages[stageIndex].name}
            </Text>
          </View>
        </View>

        {/* The Quote - Constrained to prevent scuffed layout */}
        <View className="mt-12 mb-16 px-4">
          <Text className="text-slate-300 text-center italic text-sm leading-6">
            The cycle of Karma never ends. The flesh returns to the earth; the
            soul carries the spark of the Dao onward.
          </Text>
        </View>

        {/* Reincarnation Action */}
        <Pressable
          onPress={reincarnate}
          className="w-full bg-red-600/10 border border-red-600/50 py-5 rounded-2xl active:bg-red-600"
        >
          {({ pressed }) => (
            <Text
              className={`text-center font-black tracking-[3px] text-sm uppercase ${
                pressed ? "text-white" : "text-red-400"
              }`}
            >
              Prepare For Reincarnation
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
