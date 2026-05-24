import { View, Text, Pressable, Modal } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { realms } from "../data/cultivation-data";
import { useCultivation } from "../hooks/useCultivation";
import { usePlayerStore } from "../store/player-store";
import { formatNumbers, getNextState } from "../helpers/cultivation-helper";
import { getHighestWeightTitle } from "../helpers/title-helper";
import { Route } from "../enums/route.enum";
import { INJURY_EFFECTS } from "../constants/injury-constants";
import ContinuationModal from "../components/continuation-modal";
import StatButton from "../components/stat-button";
import { ComponentProps } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [isInjuriesVisible, setIsInjuriesVisible] = useState(false);
  const [isTribulationConfirmVisible, setIsTribulationConfirmVisible] =
    useState(false);

  const titles = usePlayerStore((state) => state.currentLife.titles);
  const highestTitle = getHighestWeightTitle(titles);
  const addQi = usePlayerStore((state) => state.addQi);
  const breakthrough = usePlayerStore((state) => state.breakthrough);
  const currentAge = usePlayerStore((state) => state.currentLife.currentAge);
  const maxAge = usePlayerStore((state) => state.currentLife.maxAge);

  const {
    qi,
    realmIndex,
    stageIndex,
    requiredQi,
    qiMultiplier,
    canBreakthrough,
    BASE_MULTIPLIER,
    SPIRITUAL_ROOT_MULTIPLIER,
    CULTIVATION_MULTIPLIER,
    INJURY_MULTIPLIER,
    injuries,
    eternalInjuries,
  } = useCultivation();
  const qiProgress = Math.min(qi / requiredQi, 1);

  const statButtons: ComponentProps<typeof StatButton>[] = [
    {
      icon: "bolt",
      label: "stats",
      color: "#c084fc",
      onPress: () => setIsStatsVisible(true),
    },
  ];
  if (injuries.length > 0 || eternalInjuries.length > 0) {
    statButtons.push({
      icon: "tint",
      label: "injuries",
      color: "#ef4444",
      onPress: () => setIsInjuriesVisible(true),
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      usePlayerStore.setState((state) => ({
        currentLife: {
          ...state.currentLife,
          currentAge: state.currentLife.currentAge + 1,
        },
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsub = usePlayerStore.subscribe((state) => {
      if (state.currentLife.currentAge >= state.currentLife.maxAge) {
        setTimeout(() => router.replace(Route.DEAD), 200);
      }
    });
    return () => unsub();
  }, []);

  return (
    <Pressable
      className="flex-1 bg-[#0d0d0f]"
      onPress={() => addQi(qiMultiplier)}
    >
      {/* Background Ambient Glow */}
      <View className="absolute top-0 w-full h-64 bg-purple-900/10 blur-3xl" />

      <SafeAreaView className="flex-1 px-8">
        {/* Header: Vitality & Prowess */}
        <View className="flex-row justify-between items-center mt-4">
          <View>
            <Text className="text-gray-500 uppercase tracking-[2px] text-[10px] font-bold">
              Life Span
            </Text>
            <Text className="text-white text-xl font-light">
              {currentAge}{" "}
              <Text className="text-gray-600 text-sm">
                / {Math.ceil(maxAge)}
              </Text>
            </Text>
          </View>

          <View className="items-end gap-y-2">
            {statButtons.map((b) => (
              <StatButton key={b.label} {...b} />
            ))}
          </View>
        </View>

        {/* Realm Information */}
        <View className="items-center mt-10 mb-8">
          {highestTitle && (
            <View className="mb-3 px-3 py-1 border border-cyan-500/30 rounded-sm bg-cyan-500/5">
              <Text className="text-cyan-400 text-[10px] tracking-[5px] font-black uppercase text-center">
                {highestTitle}
              </Text>
            </View>
          )}
          <Text className="text-white text-3xl font-light tracking-tight">
            {realms[realmIndex].name}
          </Text>
          <Text className="text-gray-500 text-base italic">
            {realms[realmIndex].stages[stageIndex].name}
          </Text>
        </View>

        {/* Player Card Placeholder */}
        <View className="flex-1 items-center justify-center">
          <View className="w-4/5 aspect-[3/4] rounded-[40px] bg-gray-800/40 border border-white/10 overflow-hidden shadow-2xl">
            {/* This represents where your image will eventually go */}
            <View className="flex-1 items-center justify-center">
              <Text className="text-white/5 text-8xl font-black italic">
                IMAGE
              </Text>
            </View>

            {/* Bottom Overlay Info */}
            <View className="absolute bottom-0 w-full bg-black/60 pt-6 pb-8 px-6 border-t border-white/5">
              <View className="flex-row justify-between items-end mb-3">
                <Text className="text-purple-200 text-xs font-bold uppercase tracking-widest">
                  Qi Essence
                </Text>
                <Text className="text-white font-mono text-xs">
                  {formatNumbers(qi)} <Text className="text-gray-500">/</Text>{" "}
                  {formatNumbers(requiredQi)}
                </Text>
              </View>

              {/* Progress Bar */}
              <View className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <View
                  className="h-full bg-purple-500 shadow-lg shadow-purple-500/50"
                  style={{ width: `${qiProgress * 100}%` }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Breakthrough Action */}
        <View
          style={{
            position: "absolute",
            bottom: 40,
            left: 32,
            right: 32,
          }}
        >
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              if (!canBreakthrough) return;
              const next = getNextState(realmIndex, stageIndex);
              if (!next) return;
              if (next.currentRealmIndex !== realmIndex) {
                setIsTribulationConfirmVisible(true);
              } else {
                breakthrough();
              }
            }}
            style={{
              display: canBreakthrough ? "flex" : "none",
              paddingVertical: 20,
              borderRadius: 16,
              alignItems: "center",
              borderWidth: 1,
              backgroundColor: canBreakthrough
                ? "#eab308"
                : "rgba(255,255,255,0.05)",
              borderColor: canBreakthrough
                ? "#fde047"
                : "rgba(255,255,255,0.1)",
            }}
          >
            <Text
              style={{
                fontWeight: "900",
                fontSize: 12,
                letterSpacing: 3,
                color: canBreakthrough ? "#000" : "#374151",
              }}
            >
              {canBreakthrough ? "Breakthrough" : "Cultivate"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Modal - Kept minimal and consistent */}
      <Modal
        animationType="fade"
        transparent
        visible={isStatsVisible}
        onRequestClose={() => setIsStatsVisible(false)}
      >
        <View className="flex-1 justify-center bg-black/90 px-10">
          <View className="bg-[#1a1a1e] border border-white/10 rounded-[32px] p-8">
            <Text className="text-white text-xl font-light mb-8 text-center tracking-widest uppercase">
              Qi Multiplier
            </Text>

            <View className="gap-y-4 mb-10">
              <View className="flex-row justify-between border-b border-white/5 pb-2">
                <Text className="text-gray-500">Base</Text>
                <Text className="text-green-400 font-mono">
                  + {BASE_MULTIPLIER}
                </Text>
              </View>

              <View className="flex-row justify-between border-b border-white/5 pb-2">
                <Text className="text-gray-500">Cultivation</Text>
                <Text className="text-green-400 font-mono">
                  * {CULTIVATION_MULTIPLIER.toFixed(0)}
                </Text>
              </View>

              <View className="flex-row justify-between border-b border-white/5 pb-2">
                <Text className="text-gray-500">Spiritual Root</Text>
                <Text className="text-green-400 font-mono">
                  * {SPIRITUAL_ROOT_MULTIPLIER}
                </Text>
              </View>

              {INJURY_MULTIPLIER < 1 && (
                <View className="flex-row justify-between border-b border-white/5 pb-2">
                  <Text className="text-gray-500">Injuries</Text>
                  <Text className="text-red-400 font-mono">
                    * {INJURY_MULTIPLIER.toFixed(2)}
                  </Text>
                </View>
              )}

              {/* TODO: cultivation titles */}
              {/* {titles.map((t, i) => (
                <View
                  key={i}
                  className="flex-row justify-between border-b border-white/5 pb-2"
                >
                  <Text className="text-gray-500">{t.name}</Text>
                  <Text className="text-cyan-400 font-mono">
                    x{t.multiplier}
                  </Text>
                </View>
              ))} */}

              <View className="flex-row justify-between pt-2">
                <Text className="text-white font-bold">Multiplier</Text>
                <Text className="text-purple-400 text-xl font-bold">
                  {qiMultiplier.toFixed(0)}x
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setIsStatsVisible(false)}
              className="bg-white py-4 rounded-xl items-center"
            >
              <Text className="text-black font-bold uppercase tracking-widest text-xs">
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Injuries Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={isInjuriesVisible}
        onRequestClose={() => setIsInjuriesVisible(false)}
      >
        <View className="flex-1 justify-center bg-black/90 px-10">
          <View className="bg-[#1a1a1e] border border-white/10 rounded-[32px] p-8">
            <Text className="text-white text-xl font-light mb-8 text-center tracking-widest uppercase">
              Injuries
            </Text>

            <View className="gap-y-4 mb-10">
              {injuries.map((type, i) => (
                <View
                  key={`n-${i}`}
                  className="flex-row justify-between items-center border-b border-white/5 pb-2"
                >
                  <View className="flex-row items-center">
                    <FontAwesome5 name="tint" size={12} color="#ef4444" solid />
                    <Text className="text-red-400 ml-3">Normal Injury</Text>
                  </View>
                  <Text className="text-indigo-400 font-mono">
                    HP & Qi Multiplier ×{" "}
                    {INJURY_EFFECTS[type].qiMultiplier.toFixed(2)}
                  </Text>
                </View>
              ))}

              {eternalInjuries.map((type, i) => (
                <View
                  key={`e-${i}`}
                  className="flex-row justify-between items-center border-b border-white/5 pb-2"
                >
                  <View className="flex-row items-center">
                    <FontAwesome5 name="tint" size={12} color="#b91c1c" solid />
                    <Text className="text-red-500 ml-3">Eternal Injury</Text>
                  </View>
                  <Text className="text-red-500 font-mono">
                    × {INJURY_EFFECTS[type].qiMultiplier.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={() => setIsInjuriesVisible(false)}
              className="bg-white py-4 rounded-xl items-center"
            >
              <Text className="text-black font-bold uppercase tracking-widest text-xs">
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ContinuationModal
        visible={isTribulationConfirmVisible}
        showIcon={false}
        title="Heavenly Tribulation"
        body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Are you prepared to face the trial?"
        buttonLabel="Begin"
        onDismiss={() => {
          setIsTribulationConfirmVisible(false);
          router.push(Route.TRIBULATION);
        }}
      />
    </Pressable>
  );
}
