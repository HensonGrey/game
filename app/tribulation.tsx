import {
  View,
  Text,
  Pressable,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { Cloud } from "../components/cloud";
import { LightningBolt } from "../components/lightning-bolt";
import { Fireball } from "../components/fireball";
import { QiAura } from "../components/qi-aura";
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
  // Player sprite is centered in a 3:4 contain box. This is the HP HUD's
  // distance from the box top — set just below the character/cushion. Raise the
  // multiplier to push it further down, lower it to lift it back up.
  const PLAYER_BOX_HEIGHT = MAX_IMAGE_WIDTH * (4 / 3);
  const HP_HUD_TOP = PLAYER_BOX_HEIGHT * 0.26;

  const {
    currentHp,
    maxHp,
    charge,
    flashing,
    lightningX,
    boltProgress,
    fireballActive,
    fireballProgress,
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
        <View
          className="mt-4 flex-row items-center justify-center gap-x-2"
          style={{ transform: [{ translateY: -10 }] }}
        >
          <FontAwesome5 name="heart" size={18} color={cloudColor} solid />
          <Text className="text-white font-mono text-xl font-black">
            {Math.ceil(cloudHp)}{" "}
            <Text className="text-gray-400 text-sm font-sans font-normal">
              / {Math.ceil(cloudMaxHp)}
            </Text>
          </Text>
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

          {/* Strength-scaled Fireball — rises from the player up to the cloud */}
          {fireballActive && (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: "50%",
                marginLeft: -22,
                bottom: `${30 + fireballProgress * 70}%`,
                zIndex: 45,
              }}
            >
              <Fireball />
            </View>
          )}

          {/* COMBINED PLAYER + HP TARGET ZONE */}
          <View className="absolute bottom-4 left-0 right-0 items-center overflow-visible z-30">
            {/* VITALITY HUD: sibling of the player (not inside the scaled
                Pressable), anchored just above the character's head. */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: HP_HUD_TOP,
                left: 0,
                right: 0,
              }}
              className="flex-row items-center justify-center gap-x-2 z-50"
            >
              <FontAwesome5 name="heart" size={18} color="#ef4444" solid />
              <Text className="text-white text-xl font-black font-mono">
                {Math.ceil(currentHp)}{" "}
                <Text className="text-gray-400 text-sm font-normal font-sans">
                  / {Math.ceil(maxHp)}
                </Text>
              </Text>
            </View>

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
              {/* Layered glow + character. Gold defaults; white flare while a bolt strikes. */}
              <QiAura
                source={playerImage}
                intensity={auraIntensity}
                flashing={flashing}
                style={{ width: "100%", height: "100%" }}
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* Ascension Phase Success Dialogue Sequence */}
      <ContinuationModal
        visible={showCongrats}
        title="Tribulation Survived"
        body={
          <>
            Congratulations on surviving this heavenly tribulation and becoming
            a{" "}
            <Text className="text-purple-400 font-black not-italic uppercase tracking-widest">
              {newRealm?.name ?? ""}
            </Text>{" "}
            great cultivator. May your Dao stand eternal and your lifespan
            outlast the turning of the ages.
          </>
        }
        buttonLabel="Ascend"
        onDismiss={dismissCongrats}
      />
    </View>
  );
}
