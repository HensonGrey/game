import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { usePlayerStore } from "../store/player-store";
import UpgradeCard from "../components/upgrade-card";
import UpgradeModal from "../components/upgrade-modal";
import { Upgrade, UPGRADE_TYPES } from "../interfaces/store-upgrade.interface";
import { roots } from "../data/spiritual-root-data";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { UpgradeModalInfo } from "../interfaces/upgrade-modal-info.interface";
import { Route } from "../enums/route.enum";

export default function SystemStore() {
  const [info, setInfo] = useState<UpgradeModalInfo>({
    visible: false,
    title: "",
    desc: "",
    level: 0,
    isMaxed: false,
  });

  const spiritualRootIndex = usePlayerStore(
    (state) => state.spiritualRootIndex,
  );
  const vitalityLevel = usePlayerStore((state) => state.vitalityLevel);
  const originPoints = usePlayerStore((state) => state.originPoints);
  const eternalInjuries = usePlayerStore((state) => state.eternalInjuries);

  const reincarnate = usePlayerStore((state) => state.reincarnate);
  const purchaseUpgrade = usePlayerStore((s) => s.purchaseUpgrade);

  const router = useRouter();

  const getUpgradeCost = (type: UPGRADE_TYPES): number => {
    switch (type) {
      case UPGRADE_TYPES.SPIRITUAL_ROOT:
        return Math.floor(20 * Math.pow(1.5, spiritualRootIndex));
      case UPGRADE_TYPES.VITALITY:
        return Math.floor(10 * Math.pow(1.5, vitalityLevel));
      case UPGRADE_TYPES.CLEANSE_ETERNAL_INJURIES:
        return Math.floor(40 * Math.pow(1.6, eternalInjuries.length - 1));
      default:
        throw Error("[Store.tsx] - Not implemented exception");
    }
  };

  const spiritualRoot: Upgrade = {
    type: UPGRADE_TYPES.SPIRITUAL_ROOT,
    label: `${roots[spiritualRootIndex].rank} Spiritual Root`,
    icon: "seedling",
    cost: getUpgradeCost(UPGRADE_TYPES.SPIRITUAL_ROOT),
    level: spiritualRootIndex + 1,
    maxLevel: roots.length - 1,
    isMaxed: spiritualRootIndex >= roots.length - 1,
    desc: roots[spiritualRootIndex].description,
    levelLabel: `${roots[spiritualRootIndex].rank} Spiritual Root`,
    nextDesc: roots[spiritualRootIndex + 1]?.description || "MAX",
    nextLabel: roots[spiritualRootIndex + 1]?.rank || "MAX",
  };

  const vitality: Upgrade = {
    type: UPGRADE_TYPES.VITALITY,
    label: "Vitality",
    icon: "tint",
    cost: getUpgradeCost(UPGRADE_TYPES.VITALITY),
    level: vitalityLevel + 1,
    isMaxed: false,
    // Using simple additive display logic for UI clarity
    desc: `Current Bonus: +${vitalityLevel * 20}% Lifespan`,
    nextDesc: `Upgrade to: +${(vitalityLevel + 1) * 20}% Lifespan`,
    nextLabel: undefined,
  };

  const upgrades: Upgrade[] = [spiritualRoot, vitality];

  if (eternalInjuries.length > 0) {
    const count = eternalInjuries.length;
    upgrades.push({
      type: UPGRADE_TYPES.CLEANSE_ETERNAL_INJURIES,
      label: "Cleanse Eternal Injuries",
      icon: "pray",
      cost: getUpgradeCost(UPGRADE_TYPES.CLEANSE_ETERNAL_INJURIES),
      level: count,
      levelLabel: `${count} INJUR${count === 1 ? "Y" : "IES"}`,
      isMaxed: false,
      desc: `Purge every eternal injury you carry. Stat reductions are restored on your next life.`,
      nextDesc: undefined,
      nextLabel: undefined,
    });
  }

  return (
    <View className="flex-1 bg-slate-950">
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 24,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Currency Display */}
        <View className="flex-row justify-between items-end mb-8">
          <View>
            <Text className="text-white text-3xl font-black tracking-tight italic">
              SYSTEM STORE
            </Text>
            <View className="h-1 w-12 bg-purple-500 rounded-full mt-1" />
          </View>

          <View className="items-end bg-purple-900/30 px-4 py-2 rounded-2xl border border-purple-500/20">
            <Text className="text-purple-300 text-xs font-bold uppercase tracking-widest">
              Origin Points
            </Text>
            <View className="flex-row items-center gap-x-2">
              <FontAwesome5 name="fist-raised" size={14} color="#a855f7" />
              <Text className="text-white text-2xl font-black">
                {originPoints.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Upgrades List */}
        <View className="w-full gap-y-5">
          {upgrades.map((upgrade) => (
            <UpgradeCard
              key={upgrade.label}
              upgrade={upgrade}
              canAfford={!upgrade.isMaxed && originPoints >= upgrade.cost}
              onInfoPress={() =>
                setInfo({
                  visible: true,
                  title: upgrade.label,
                  desc: upgrade.desc,
                  level: upgrade.level,
                  nextDesc: upgrade.nextDesc,
                  nextLabel: upgrade.nextLabel,
                  isMaxed: upgrade.isMaxed,
                  levelLabel: upgrade.levelLabel,
                })
              }
              onPress={() => purchaseUpgrade(upgrade.type, upgrade.cost)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Floating Action/Exit Button */}
      <View className="absolute bottom-10 left-0 right-0 items-center px-6">
        <TouchableOpacity
          className="bg-purple-600 w-full py-4 rounded-2xl shadow-lg shadow-purple-500/50 flex-row justify-center items-center gap-x-3"
          activeOpacity={0.8}
          onPress={() => {
            reincarnate();
            router.replace(Route.HOME);
          }}
        >
          <Text className="text-white font-bold text-lg">Reincarnate</Text>
        </TouchableOpacity>
      </View>

      <UpgradeModal
        {...info}
        onClose={() => setInfo({ ...info, visible: false })}
      />
    </View>
  );
}
