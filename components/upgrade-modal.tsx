import { View, Text, Pressable, Modal } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  desc: string;
  level: number;
  levelLabel?: string;
  isMaxed: boolean;
  nextDesc?: string;
  nextLabel?: string;
  onClose: () => void;
}

const UpgradeModal = ({
  visible,
  desc,
  level,
  levelLabel,
  isMaxed,
  nextDesc,
  nextLabel,
  onClose,
}: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/95 justify-center items-center px-6"
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-slate-900 w-full rounded-[50px] border border-slate-800 p-8 pt-16 items-center"
        >
          <Pressable
            onPress={onClose}
            className="absolute top-8 right-8 w-12 h-12 border-2 border-red-500/40 rounded-full items-center justify-center bg-red-500/10"
            hitSlop={15}
          >
            <FontAwesome5 name="times" size={20} color="#EF4444" />
          </Pressable>
          <Text className="text-purple-400 text-[10px] font-black uppercase mb-10 tracking-[5px]">
            EVOLUTION PATH
          </Text>
          <View className="w-full flex-col items-center gap-y-4">
            <View className="w-full items-center bg-slate-800/80 p-6 rounded-[32px] border border-slate-700/50">
              <Text className="text-white font-black text-xl mb-3 tracking-tight">
                {levelLabel ?? `LVL ${level}`}
              </Text>
              <Text className="text-slate-400 text-center text-xs leading-5 italic">
                {desc}
              </Text>
            </View>
            <View className="bg-purple-600/20 p-3 rounded-full">
              <FontAwesome5 name="chevron-down" size={14} color="#A855F7" />
            </View>
            <View className="w-full items-center bg-purple-900/10 p-6 rounded-[32px] border border-purple-500/20">
              <Text className="text-purple-400 text-[9px] font-black uppercase mb-2">
                Next Tier
              </Text>
              {isMaxed ? (
                <Text className="text-slate-600 font-black text-xl tracking-tight">
                  MAX
                </Text>
              ) : (
                <>
                  <Text className="text-purple-300 font-black text-xl mb-3 tracking-tight">
                    {nextLabel ?? `LVL ${level + 1}`}
                  </Text>
                  <Text className="text-slate-400 text-center text-xs leading-5 italic">
                    {nextDesc}
                  </Text>
                </>
              )}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default UpgradeModal;
