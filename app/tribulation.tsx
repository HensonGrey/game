import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { Cloud } from "../components/cloud";
import { LightningBolt } from "../components/lightning-bolt";
import ContinuationModal from "../components/continuation-modal";
import { useTribulation } from "../hooks/useTribulation";
import { realms } from "../data/cultivation-data";
import {
  CLOUD_COLOR_FULL,
  CLOUD_COLOR_EMPTY,
} from "../constants/tribulation-constants";

const PLAYER_WIDTH = 160;

const CLOUD_VISIBILITY = [
  [3, 3, 3],
  [2, 3, 2],
  [1, 3, 1],
  [0, 3, 0],
  [0, 0, 0],
];

const lerp = (a: number, b: number, t: number) =>
  Math.round(a * t + b * (1 - t));

export default function Tribulation() {
  const {
    currentHp,
    maxHp,
    charge,
    flashing,
    lightningX,
    boltProgress,
    auraIntensity,
    tapRelease,
    tapCloud,
    cloudHp,
    cloudMaxHp,
    circlesDestroyed,
    showCongrats,
    newRealmIndex,
    dismissCongrats,
  } = useTribulation();

  const newRealm = realms[newRealmIndex];

  const cloudHpFraction = cloudHp / cloudMaxHp;
  const cloudColor = `rgb(${lerp(CLOUD_COLOR_FULL.r, CLOUD_COLOR_EMPTY.r, cloudHpFraction)}, ${lerp(CLOUD_COLOR_FULL.g, CLOUD_COLOR_EMPTY.g, cloudHpFraction)}, ${lerp(CLOUD_COLOR_FULL.b, CLOUD_COLOR_EMPTY.b, cloudHpFraction)})`;
  const visibilityIndex = cloudHp <= 0 ? 4 : circlesDestroyed / 2;
  const [leftCircles, centerCircles, rightCircles] =
    CLOUD_VISIBILITY[visibilityIndex];

  return (
    <View className="flex-1 bg-[#05050a]">
      <View
        className="absolute inset-0"
        style={{
          backgroundColor: "#1a0f2e",
          opacity: 0.35 + auraIntensity * 0.25,
        }}
      />

      <SafeAreaView className="flex-1 px-8">
        {/* Sky / player area */}
        <View className="flex-1">
          {/* Cloud HP HUD — absolutely positioned so it can move independently of the cloud bank */}
          <View
            className="flex-row items-center justify-center gap-x-2 absolute left-0 right-0"
            style={{ top: -24 }}
          >
            <FontAwesome5 name="cloud" size={16} color={cloudColor} solid />
            <Text className="text-white font-mono text-base">
              {Math.ceil(cloudHp)}{" "}
              <Text className="text-gray-600">/ {Math.ceil(cloudMaxHp)}</Text>
            </Text>
          </View>

          {/* Cloud bank — tap to damage */}
          <Pressable
            onPress={tapCloud}
            className="flex-row justify-center items-end h-20 mt-6"
          >
            <Cloud
              size={48}
              opacity={0.85}
              visibleCircles={leftCircles}
              color={cloudColor}
            />
            <Cloud
              size={68}
              opacity={0.95}
              visibleCircles={centerCircles}
              color={cloudColor}
            />
            <Cloud
              size={52}
              opacity={0.85}
              visibleCircles={rightCircles}
              color={cloudColor}
            />
          </Pressable>

          {/* Strike zone */}
          <View className="flex-1 items-center justify-center relative">
            {flashing && (
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: "45%",
                  left: `${lightningX * 100}%`,
                  marginLeft: -10,
                  justifyContent: "flex-start",
                }}
              >
                <LightningBolt progress={boltProgress} />
              </View>
            )}

            {flashing && (
              <View
                pointerEvents="none"
                className="absolute inset-0"
                style={{ backgroundColor: "rgba(254, 240, 138, 0.08)" }}
              />
            )}

            {/* HP HUD — sits just above the aura, close to the player */}
            <View className="flex-row items-center gap-x-2 mb-10">
              <FontAwesome5 name="heart" size={16} color="#ef4444" solid />
              <Text className="text-white font-mono text-base">
                {Math.ceil(currentHp)}{" "}
                <Text className="text-gray-600">/ {Math.ceil(maxHp)}</Text>
              </Text>
            </View>

            {/* Player + aura wrapper — aura is scoped to this view only */}
            <View className="items-center justify-center">
              {/* Aura halo behind player */}
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  width: PLAYER_WIDTH + 40,
                  aspectRatio: 3 / 4,
                  borderRadius: 40,
                  backgroundColor: "#facc15",
                  opacity: auraIntensity * 0.55,
                  shadowColor: "#facc15",
                  shadowOpacity: auraIntensity,
                  shadowRadius: 30 + auraIntensity * 30,
                  shadowOffset: { width: 0, height: 0 },
                }}
              />

              {/* Small player card */}
              <Pressable
                onPress={tapRelease}
                className="rounded-[28px] bg-gray-800/40 border overflow-hidden shadow-2xl"
                style={{
                  width: PLAYER_WIDTH,
                  aspectRatio: 3 / 4,
                  borderColor: flashing
                    ? "rgba(253, 224, 71, 0.95)"
                    : "rgba(255,255,255,0.1)",
                  borderWidth: flashing ? 2 : 1,
                }}
              >
                <View className="flex-1 items-center justify-center">
                  <Text className="text-white/10 text-4xl font-black italic">
                    IMG
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Aura charge bar */}
        <View className="mb-4">
          <View className="flex-row justify-between items-end mb-2">
            <Text className="text-yellow-200 text-xs font-bold uppercase tracking-widest">
              Aura Charge
            </Text>
            <Text className="text-white font-mono text-xs">
              {Math.ceil(charge)}
            </Text>
          </View>
          <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <View
              className="h-full bg-yellow-400 shadow-lg shadow-yellow-400/60"
              style={{ width: `${auraIntensity * 100}%` }}
            />
          </View>
        </View>
      </SafeAreaView>

      <ContinuationModal
        visible={showCongrats}
        title="Tribulation Survived"
        body={newRealm?.description ?? ""}
        buttonLabel="Ascend"
        onDismiss={dismissCongrats}
      />
    </View>
  );
}
