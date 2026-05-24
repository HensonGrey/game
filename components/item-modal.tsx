import { View, Text, Pressable, Modal } from "react-native";
import { Item } from "../enums/item.enum";
import { itemDefinitions } from "../data/item-data";

interface Props {
  item: Item | null;
  onClose: () => void;
}

const ItemModal = ({ item, onClose }: Props) => {
  const def = item ? itemDefinitions[item] : null;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={item !== null}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center bg-black/90 px-10">
        <View className="bg-[#1a1a1e] border border-white/10 rounded-[32px] p-8 items-center">
          <View className="w-20 h-20 rounded-3xl bg-gray-800/60 border border-white/10 items-center justify-center mb-5">
            <Text style={{ fontSize: 40 }}>{def?.emoji ?? ""}</Text>
          </View>

          <Text className="text-white text-xl font-light mb-6 text-center tracking-widest uppercase">
            {def?.name ?? ""}
          </Text>

          <Text className="text-gray-400 text-center text-xs leading-5 italic mb-10">
            {def?.description ?? ""}
          </Text>

          <Pressable
            onPress={onClose}
            className="bg-white py-4 rounded-xl items-center self-stretch"
          >
            <Text className="text-black font-bold uppercase tracking-widest text-xs">
              Close
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ItemModal;
