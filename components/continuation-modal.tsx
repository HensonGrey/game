import { View, Text, Pressable, Modal, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { FontAwesome5 } from "@expo/vector-icons";
import { ReactNode } from "react";

interface Props {
  visible: boolean;
  showIcon?: boolean;
  title: string;
  body: ReactNode;
  buttonLabel: string;
  onDismiss: () => void;
}

const ContinuationModal = ({
  visible,
  showIcon = true,
  title,
  body,
  buttonLabel,
  onDismiss,
}: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-center items-center px-6">
        {/* Slightly blurred, lightly dimmed backdrop (was a near-opaque black). */}
        <BlurView
          intensity={35}
          tint="dark"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
        <View className="absolute inset-0 bg-black/20" />

        <View className="bg-slate-900 w-full rounded-[50px] border border-yellow-500/30 p-8 pt-16 items-center">
          {showIcon && (
            <View className="absolute -top-8 w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-400 items-center justify-center">
              <FontAwesome5 name="bolt" size={24} color="#facc15" solid />
            </View>
          )}

          <Text className="text-yellow-300 text-lg font-black uppercase mb-4 tracking-[5px]">
            {title}
          </Text>
          <Text className="text-slate-400 text-center text-sm leading-6 italic mb-8 px-2">
            {body}
          </Text>

          <Pressable
            onPress={onDismiss}
            className="w-full bg-yellow-500 rounded-full py-4 items-center"
          >
            <Text className="text-slate-900 font-black text-sm uppercase tracking-widest">
              {buttonLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ContinuationModal;
