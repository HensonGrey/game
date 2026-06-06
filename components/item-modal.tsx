import { View, Text, Pressable, Modal, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ItemEnum } from "../enums/item.enum";
import { items } from "../data/item-data";
import { ITEM_MAX_LEVEL } from "../interfaces/item.interface";
import {
  getPendantQiBoost,
  getSwordDmgReduction,
} from "../helpers/item-helper";
import { useItem } from "../hooks/useItem";

interface Props {
  item: ItemEnum | null;
  onClose: () => void;
}

const getEffectLabel = (item: ItemEnum, level: number): string => {
  switch (item) {
    case ItemEnum.PENDANT: {
      const pct = Math.round((getPendantQiBoost(level) - 1) * 100);
      return `+${pct}% Qi multiplier`;
    }
    case ItemEnum.SWORD: {
      const pct = Math.round((1 - getSwordDmgReduction(level)) * 100);
      return `-${pct}% tribulation damage`;
    }
  }
};

const ItemModal = ({ item, onClose }: Props) => {
  const { getUpgradeInfo, upgradeItem } = useItem();

  const def = item ? items.find((i) => i.id === item) : null;
  const { level, atMax, cost, canAfford } = item
    ? getUpgradeInfo(item)
    : { level: 0, atMax: false, cost: 0, canAfford: false };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={item !== null}
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

          {/* Item badge */}
          <View className="w-20 h-20 rounded-3xl bg-gray-800/60 border border-white/10 items-center justify-center mb-5 overflow-hidden">
            {def && (
              <Image
                source={def.image}
                resizeMode="contain"
                style={{ width: 64, height: 64 }}
              />
            )}
          </View>

          <Text className="modal-title mb-1">{def?.name ?? ""}</Text>
          <Text className="eyebrow text-amber-400 mb-5">
            Level {level} / {ITEM_MAX_LEVEL}
          </Text>

          <Text className="body-text text-center italic mb-6">
            {def?.description ?? ""}
          </Text>

          {/* Effect strip */}
          {item && (
            <View className="self-stretch bg-white/5 border border-white/10 rounded-xl py-3 px-4 mb-6 flex-row justify-between items-center">
              <Text className="eyebrow">Effect</Text>
              <Text className="text-purple-300 text-sm font-mono font-bold">
                {getEffectLabel(item, level)}
              </Text>
            </View>
          )}

          {/* Upgrade button */}
          <Pressable
            disabled={atMax || !canAfford}
            onPress={() => item && upgradeItem(item)}
            className={`self-stretch py-4 rounded-xl items-center ${
              atMax
                ? "bg-white/5 border border-white/10"
                : canAfford
                  ? "bg-amber-400"
                  : "bg-white/5 border border-white/10"
            }`}
          >
            {atMax ? (
              <Text className="btn-label text-gray-500">Maxed</Text>
            ) : (
              <View className="flex-row items-center">
                <Text
                  className={`btn-label ${canAfford ? "text-black" : "text-gray-500"}`}
                >
                  Upgrade —
                </Text>
                <FontAwesome5
                  name="gem"
                  size={10}
                  color={canAfford ? "#000" : "#6b7280"}
                  solid
                  style={{ marginLeft: 8, marginRight: 4 }}
                />
                <Text
                  className={`btn-label ${canAfford ? "text-black" : "text-gray-500"}`}
                >
                  {cost} OP
                </Text>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ItemModal;
