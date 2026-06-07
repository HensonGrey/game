import { useEffect, useRef, useState } from "react";
import { Animated, Text, TextProps } from "react-native";

interface Props extends TextProps {
  value: number;
  /** Tween duration in ms. */
  duration?: number;
  /** How the numeric value is rendered. Defaults to a localized integer. */
  formatter?: (n: number) => string;
}

/**
 * @description Renders a number that smoothly tweens to its target whenever
 * `value` changes (e.g. an origin-points reward from a breakthrough), instead
 * of snapping. Mounts already at `value`, so no animation plays on first paint.
 */
export default function AnimatedNumber({
  value,
  duration = 1000,
  formatter = (n) => Math.round(n).toLocaleString(),
  ...textProps
}: Props) {
  const animated = useRef(new Animated.Value(value)).current;
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const id = animated.addListener(({ value: v }) => setDisplay(v));
    return () => animated.removeListener(id);
  }, [animated]);

  useEffect(() => {
    const animation = Animated.timing(animated, {
      toValue: value,
      duration,
      // useNativeDriver can't animate text content, only transforms/opacity.
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [value, duration, animated]);

  return <Text {...textProps}>{formatter(display)}</Text>;
}
