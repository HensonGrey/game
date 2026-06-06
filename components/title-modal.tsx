import { View, Text, Pressable, Modal } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { TitleEnum } from "../enums/title.enum";
import { titles } from "../data/title-data";

interface Props {
  title: TitleEnum | null;
  onClose: () => void;
}

const TitleModal = ({ title, onClose }: Props) => {
  const def = title ? titles.find((t) => t.name === title) : null;
  const qiPct = def ? Math.round((def.multiplier - 1) * 100) : 0;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={title !== null}
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 justify-center bg-black/90 px-10"
      >
        <Pressable
          onPress={() => {
            /* swallow taps on the card */
          }}
          className="bg-[#1a1a1e] border border-white/10 rounded-[32px] p-8 items-center"
        >
          {/* Close (X) */}
          <Pressable
            onPress={onClose}
            hitSlop={12}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-red-500/10 border border-red-500/40 items-center justify-center"
          >
            <FontAwesome5 name="times" size={14} color="#f87171" solid />
          </Pressable>

          {/* Title crest */}
          <View className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-400/40 items-center justify-center mb-5">
            <FontAwesome5 name="crown" size={30} color="#22d3ee" solid />
          </View>

          <Text className="modal-title text-cyan-300 mb-1">
            {def?.name ?? ""}
          </Text>
          <Text className="eyebrow text-cyan-400/70 mb-5">
            Reincarnation Legacy
          </Text>

          <Text className="body-text text-center italic mb-6">
            {def?.description ?? ""}
          </Text>

          {/* Effect strip */}
          {def && (
            <View className="self-stretch bg-white/5 border border-white/10 rounded-xl py-3 px-4 flex-row justify-between items-center">
              <Text className="eyebrow">Effect</Text>
              <Text className="text-cyan-300 text-sm font-mono font-bold">
                {qiPct > 0 ? `+${qiPct}% Qi multiplier` : "Carried across lives"}
              </Text>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default TitleModal;
