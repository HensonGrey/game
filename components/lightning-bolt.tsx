import { View } from "react-native";
import { BOLT_SEGMENTS } from "../constants/tribulation-constants";

export function LightningBolt({ progress }: { progress: number }) {
  const visibleCount = Math.ceil(progress * BOLT_SEGMENTS.length);
  return (
    <View style={{ alignItems: "center" }}>
      {BOLT_SEGMENTS.slice(0, visibleCount).map((seg, i) => (
        <View
          key={i}
          style={{
            width: 9,
            height: 28,
            backgroundColor: "#fef9c3",
            marginLeft: seg.ml,
            transform: [{ skewX: seg.skew }],
            shadowColor: "#facc15",
            shadowOpacity: 1,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 0 },
          }}
        />
      ))}
    </View>
  );
}
