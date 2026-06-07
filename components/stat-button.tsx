// StatButton.tsx
import { Pressable, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ComponentProps } from "react";

interface Props {
  icon: ComponentProps<typeof FontAwesome5>["name"];
  label: string;
  color: string;
  onPress: () => void;
}

const StatButton = ({ icon, color, onPress }: Props) => (
  <Pressable
    onPress={onPress}
    // Updated: More defined shape and distinct, bright coloring
    className="w-12 h-12 rounded-full items-center justify-center bg-black/40 border-2 active:bg-black/60 shadow-lg"
    style={{ borderColor: color }} // Solid color border
  >
    {/* Inner circle accent */}
    <View className="absolute inset-0 rounded-full bg-white/5 opacity-80" />
    <FontAwesome5 name={icon} size={20} color={color} solid />
  </Pressable>
);

export default StatButton;
