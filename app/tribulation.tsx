import {
  View,
  Text,
  Pressable,
  Image,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
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
import homeBackground from "../assets/home-background.png";
import playerImage from "../assets/player.png";

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
  const { width: screenWidth } = useWindowDimensions();
  const MAX_IMAGE_WIDTH = screenWidth - 32;

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
    <View className="flex-1 bg-[#0d0d0f]">
      {/* Background and Atmospheric Storm Overlays */}
      <ImageBackground
        source={homeBackground}
        resizeMode="cover"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/60" />
      <View
        className="absolute inset-0"
        style={{
          backgroundColor: "#1e113a",
          opacity: 0.3 + auraIntensity * 0.35,
        }}
      />

      <SafeAreaView className="flex-1 px-4">
        {/* TOP STATUS HUD: Tribulation Cloud Status */}
        <View className="mt-4 items-center">
          <View className="bg-black/60 border border-white/10 rounded-2xl px-5 py-3 flex-row items-center gap-x-3 shadow-2xl">
            <FontAwesome5 name="bolt" size={14} color={cloudColor} />
            <View>
              <Text className="text-gray-400 uppercase tracking-[2px] text-[9px] font-black">
                Heavenly Core HP
              </Text>
              <Text className="text-white font-mono text-base font-bold mt-0.5">
                {Math.ceil(cloudHp)}{" "}
                <Text className="text-gray-600 text-xs font-sans font-normal">
                  / {Math.ceil(cloudMaxHp)}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Interactive Sky Cloud Bank Layer */}
        <Pressable
          onPress={tapCloud}
          className="flex-row justify-center items-end h-24 my-2 active:scale-95"
          style={{ zIndex: 50, elevation: 50 }}
        >
          <Cloud
            size={52}
            opacity={0.8}
            visibleCircles={leftCircles}
            color={cloudColor}
          />
          <Cloud
            size={74}
            opacity={0.95}
            visibleCircles={centerCircles}
            color={cloudColor}
          />
          <Cloud
            size={56}
            opacity={0.8}
            visibleCircles={rightCircles}
            color={cloudColor}
          />
        </Pressable>

        {/* Central Strike Zone & Player Arena */}
        <View className="flex-1 relative overflow-visible w-full">
          {/* Real-time Dynamic Lightning Bolt Pathing */}
          {flashing && (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: 0,
                bottom: "35%",
                left: `${lightningX * 100}%`,
                marginLeft: -10,
                justifyContent: "flex-start",
                zIndex: 40,
              }}
            >
              <LightningBolt progress={boltProgress} />
            </View>
          )}

          {/* COMBINED PLAYER + HP TARGET ZONE */}
          <View className="absolute bottom-4 left-0 right-0 items-center overflow-visible z-30">
            {/* Interactive Player Avatar Component Stack - Main Layout Base */}
            <Pressable
              onPress={tapRelease}
              style={{
                width: MAX_IMAGE_WIDTH,
                aspectRatio: 3 / 4,
                overflow: "visible",
                transform: [{ scale: 1.25 }],
              }}
              className="items-center justify-end overflow-visible relative"
            >
              {/* VITALITY HUD: Deeply absolute positioned down inside the canvas frame to clear blank space asset gaps */}
              {/* <View
                style={{ position: "absolute", top: 24 }}
                className="bg-black/95 border border-red-500/50 rounded-xl px-4 py-2 flex-row items-center shadow-2xl z-50 pointer-events-none"
              >
                <View className="mr-2 bg-red-500/10 p-1.5 rounded-lg border border-red-500/20">
                  <FontAwesome5 name="heartbeat" size={12} color="#ef4444" />
                </View>
                <View>
                  <Text className="text-red-400 uppercase tracking-[1.5px] text-[9px] font-black">
                    Immortal Vessel HP
                  </Text>
                  <Text className="text-white text-base font-black font-mono mt-0.5">
                    {Math.ceil(currentHp)}{" "}
                    <Text className="text-gray-500 text-xs font-normal font-sans">
                      / {Math.ceil(maxHp)}
                    </Text>
                  </Text>
                </View>
              </View> */}

              {/* Extended Outer Atmospheric Halo */}
              <Image
                source={playerImage}
                resizeMode="contain"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  tintColor: flashing ? "#fde047" : "#eab308",
                  opacity: auraIntensity * 0.25,
                  transform: [{ scale: 1.35 }],
                }}
              />
              {/* Mid-tier Radiant Light Ring */}
              <Image
                source={playerImage}
                resizeMode="contain"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  tintColor: flashing ? "#fde047" : "#fbbf24",
                  opacity: auraIntensity * 0.45,
                  transform: [{ scale: 1.2 }],
                }}
              />
              {/* Inner Core Flare Ring */}
              <Image
                source={playerImage}
                resizeMode="contain"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  tintColor: flashing ? "#ffffff" : "#fde047",
                  opacity: flashing ? 0.95 : auraIntensity * 0.7,
                  transform: [{ scale: 1.08 }],
                }}
              />
              {/* Base Character Canvas Render */}
              <Image
                source={playerImage}
                resizeMode="contain"
                style={{
                  width: "100%",
                  height: "100%",
                  shadowColor: "#facc15",
                  shadowOpacity: auraIntensity * 0.8,
                  shadowRadius: 24,
                  shadowOffset: { width: 0, height: 0 },
                }}
              />
            </Pressable>
          </View>
        </View>

        {/* METRICS HUD: Bottom Aura Charge Monitor */}
        <View className="mb-6 mt-6 bg-black/50 border border-white/5 rounded-2xl p-4 shadow-xl">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center gap-x-2">
              <FontAwesome5 name="fire" size={11} color="#facc15" />
              <Text className="text-yellow-200 text-xs font-black uppercase tracking-widest">
                Aura Deflection
              </Text>
            </View>
            <Text className="text-white font-mono text-xs font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              {Math.ceil(charge)}%
            </Text>
          </View>
          <View className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-[1px]">
            <View
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
              style={{ width: `${auraIntensity * 100}%` }}
            />
          </View>
        </View>
      </SafeAreaView>

      {/* Ascension Phase Success Dialogue Sequence */}
      <ContinuationModal
        visible={showCongrats}
        title="Tribulation Survived"
        body={
          <>
            <Text className="text-purple-400 font-black not-italic uppercase tracking-widest">
              {newRealm?.name ?? ""}
            </Text>
            {newRealm?.description ? ` — ${newRealm.description}` : ""}
          </>
        }
        buttonLabel="Ascend"
        onDismiss={dismissCongrats}
      />
    </View>
  );
}
