import { View } from "react-native";

export function Cloud({
  size = 60,
  opacity = 0.9,
}: {
  size?: number;
  opacity?: number;
}) {
  return (
    <View
      style={{
        width: size * 2,
        height: size,
        position: "relative",
        marginHorizontal: -size * 0.4,
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: "#334155",
          opacity,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: size * 0.5,
          bottom: size * 0.15,
          width: size * 1.1,
          height: size * 1.1,
          borderRadius: size,
          backgroundColor: "#475569",
          opacity,
        }}
      />
      <View
        style={{
          position: "absolute",
          left: size * 1.1,
          bottom: 0,
          width: size * 0.9,
          height: size * 0.9,
          borderRadius: size,
          backgroundColor: "#334155",
          opacity,
        }}
      />
    </View>
  );
}
