import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  View,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from "react-native";

interface QiAuraProps {
  /** The player image rendered as the base + tinted glow layers. */
  source: ImageSourcePropType;
  /** 0–1 glow strength. Drives layer opacity & scale (qiProgress on home, auraIntensity in tribulation). */
  intensity: number;
  /** Optional tint applied to every glow layer. Omit to use the default gold shades (tribulation's look). */
  color?: string;
  /** Tribulation only: snap the glow to the white flare while a lightning bolt is striking. */
  flashing?: boolean;
  /** Home only: enable a slow pulsing "breathing" loop whose amplitude grows with intensity. */
  breathing?: boolean;
  /** Sizing/transform for the whole stack — each screen keeps its own scale. */
  style?: StyleProp<ViewStyle>;
}

// Default gold palette = tribulation's exact existing shades, so passing no `color` preserves its look.
const LAYERS = [
  { baseScale: 1.35, opacityFactor: 0.25, tint: "#eab308", flashTint: "#fde047" }, // outer halo
  { baseScale: 1.2, opacityFactor: 0.45, tint: "#fbbf24", flashTint: "#fde047" }, // mid ring
  { baseScale: 1.08, opacityFactor: 0.7, tint: "#fde047", flashTint: "#ffffff" }, // inner flare
];

export function QiAura({
  source,
  intensity,
  color,
  flashing = false,
  breathing = false,
  style,
}: QiAuraProps) {
  // 0→1→0 loop driving the breathing pulse. Only animates while `breathing` is on.
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!breathing) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1300,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathing, pulse]);

  return (
    <View style={style} pointerEvents="none">
      {LAYERS.map((layer, i) => {
        const isInner = i === LAYERS.length - 1;
        // Inner flare goes opaque-white during a strike; others keep their intensity-driven opacity.
        const baseOpacity =
          isInner && flashing ? 0.95 : intensity * layer.opacityFactor;
        const tint = flashing ? layer.flashTint : (color ?? layer.tint);

        // Breathing dims/brightens and gently swells the layer; amplitude scales with intensity.
        const animatedOpacity =
          breathing && !flashing
            ? pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [baseOpacity * (1 - 0.4 * intensity), baseOpacity],
              })
            : baseOpacity;
        const animatedScale =
          breathing && !flashing
            ? pulse.interpolate({
                inputRange: [0, 1],
                outputRange: [layer.baseScale, layer.baseScale + 0.05 * intensity],
              })
            : layer.baseScale;

        return (
          <Animated.Image
            key={i}
            source={source}
            resizeMode="contain"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              tintColor: tint,
              opacity: animatedOpacity,
              transform: [{ scale: animatedScale }],
            }}
          />
        );
      })}

      {/* Base character render with a soft glow shadow tinted to the aura color. */}
      <Image
        source={source}
        resizeMode="contain"
        style={{
          width: "100%",
          height: "100%",
          shadowColor: color ?? "#facc15",
          shadowOpacity: intensity * 0.8,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 0 },
        }}
      />
    </View>
  );
}
