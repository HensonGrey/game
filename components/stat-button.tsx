import { Pressable, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ComponentProps } from "react";

interface Props {
  icon: ComponentProps<typeof FontAwesome5>["name"];
  label: string;
  color: string;
  onPress: () => void;
}

const StatButton = ({ icon, label, color, onPress }: Props) => (
  <Pressable
    onPress={onPress}
    style={{ width: 160 }}
    className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex-row items-center justify-center"
  >
    <FontAwesome5 name={icon} size={10} color={color} solid />
    <Text
      style={{ color }}
      className="font-bold text-xs uppercase tracking-widest ml-2"
    >
      {label}
    </Text>
  </Pressable>
);

export default StatButton;
