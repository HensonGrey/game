import { View } from "react-native";

// A glowing projectile that streaks from the player up to the tribulation cloud.
// Purely visual — the parent positions it and animates its ascent via `progress`.
export function Fireball() {
  return (
    <View style={{ alignItems: "center" }}>
      {/* Molten core with a hot white center and a wide orange glow. */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: "#fb923c",
          shadowColor: "#f97316",
          shadowOpacity: 1,
          shadowRadius: 28,
          shadowOffset: { width: 0, height: 0 },
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 12,
            top: 12,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "#fef08a",
          }}
        />
      </View>

      {/* Trailing embers fading out behind the core (below, since it rises). */}
      <View
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: "#f97316",
          opacity: 0.7,
          marginTop: -9,
        }}
      />
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: "#ea580c",
          opacity: 0.5,
          marginTop: -4,
        }}
      />
    </View>
  );
}
