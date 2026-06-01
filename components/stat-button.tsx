import { Pressable } from "react-native";
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
    className="w-12 h-12 rounded-full items-center justify-center bg-white/5 border active:bg-white/10"
    style={{ borderColor: `${color}66` }}
  >
    <FontAwesome5 name={icon} size={20} color={color} solid />
  </Pressable>
);

export default StatButton;
