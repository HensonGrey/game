import { View, Text, Pressable, Modal } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Item } from "../enums/item.enum";
import { itemDefinitions } from "../data/item-data";
import { ITEM_MAX_LEVEL } from "../interfaces/item.interface";
import {
  getPendantQiBoost,
  getSwordDmgReduction,
} from "../helpers/item-helper";
import { useItem } from "../hooks/useItem";

interface Props {
  item: Item | null;
  onClose: () => void;
}

const getEffectLabel = (item: Item, level: number): string => {
  switch (item) {
    case Item.PENDANT: {
      const pct = Math.round((getPendantQiBoost(level) - 1) * 100);
      return `+${pct}% Qi multiplier`;
    }
    case Item.SWORD: {
      const pct = Math.round((1 - getSwordDmgReduction(level)) * 100);
      return `-${pct}% tribulation damage`;
    }
  }
};

const ItemModal = ({ item, onClose }: Props) => {
  const { getUpgradeInfo, upgradeItem } = useItem();

  const def = item ? itemDefinitions[item] : null;
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
          <View className="w-20 h-20 rounded-3xl bg-gray-800/60 border border-white/10 items-center justify-center mb-5">
            <Text style={{ fontSize: 40 }}>{def?.emoji ?? ""}</Text>
          </View>

          <Text className="text-white text-xl font-light mb-1 text-center tracking-widest uppercase">
            {def?.name ?? ""}
          </Text>
          <Text className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-5">
            Level {level} / {ITEM_MAX_LEVEL}
          </Text>

          <Text className="text-gray-400 text-center text-xs leading-5 italic mb-6">
            {def?.description ?? ""}
          </Text>

          {/* Effect strip */}
          {item && (
            <View className="self-stretch bg-white/5 border border-white/10 rounded-xl py-3 px-4 mb-6 flex-row justify-between items-center">
              <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                Effect
              </Text>
              <Text className="text-purple-300 text-xs font-mono">
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
              <Text className="text-gray-500 font-black uppercase tracking-widest text-xs">
                Maxed
              </Text>
            ) : (
              <View className="flex-row items-center">
                <Text
                  className={`font-black uppercase tracking-widest text-xs ${
                    canAfford ? "text-black" : "text-gray-500"
                  }`}
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
                  className={`font-black uppercase tracking-widest text-xs ${
                    canAfford ? "text-black" : "text-gray-500"
                  }`}
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
