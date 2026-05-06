import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { usePlayerStore } from "../../store/player-store";
import UpgradeCard from "../../components/upgrade-card";
import UpgradeModal from "../../components/upgrade-modal";
import {
  Upgrade,
  UPGRADE_TYPES,
} from "../../interfaces/store-upgrade.interface";
import { roots } from "../../data/spiritual-root-data";

export default function SystemStore() {
  const [info, setInfo] = useState<any>({
    //TODO, use types
    visible: false,
    title: "",
    desc: "",
    level: 0,
    nextDesc: "",
    nextLabel: "",
    levelLabel: "",
  });

  const spiritualRootIndex = usePlayerStore(
    (state) => state.spiritualRootIndex,
  );
  const vitalityLevel = usePlayerStore((state) => state.vitalityLevel);
  const originPoints = usePlayerStore((state) => state.originPoints);

  const getUpgradeCost = (type: UPGRADE_TYPES): number => {
    switch (type) {
      case UPGRADE_TYPES.SPIRITUAL_ROOT:
        return Math.floor(20 * Math.pow(1.5, spiritualRootIndex));
      case UPGRADE_TYPES.VITALITY:
        return Math.floor(10 * Math.pow(1.5, vitalityLevel));
      default:
        throw Error("[Store.tsx] - Not implemented exception");
    }
  };

  const purchaseUpgrade = (type: UPGRADE_TYPES, cost: number) => {
    switch (type) {
      case UPGRADE_TYPES.SPIRITUAL_ROOT: {
        if (spiritualRootIndex >= roots.length - 1) return;

        usePlayerStore.setState({
          spiritualRootIndex: spiritualRootIndex + 1,
          originPoints: originPoints - cost,
        });
        break;
      }
      case UPGRADE_TYPES.VITALITY: {
        usePlayerStore.setState({
          vitalityLevel: vitalityLevel + 1,
          originPoints: originPoints - cost,
        });
      }
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
    desc: `Increases your lifespan by ${vitalityLevel * 20}%`,

    nextDesc: `Increases your lifespan by ${(vitalityLevel + 1) * 20}%`,
    nextLabel: undefined,
  };

  const upgrades: Upgrade[] = [spiritualRoot, vitality];

  return (
    <ScrollView
      className="flex-1 w-full"
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-8">
        <Text className="text-white text-3xl font-black tracking-tight italic">
          SYSTEM STORE
        </Text>
        <View className="h-1 w-12 bg-purple-500 rounded-full mt-1" />
      </View>

      <View className="w-full gap-y-5 pb-10">
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

      <UpgradeModal
        visible={info.visible}
        desc={info.desc}
        level={info.level}
        isMaxed={info.isMaxed}
        nextDesc={info.nextDesc}
        nextLabel={info.nextLabel}
        levelLabel={info.levelLabel}
        onClose={() => setInfo({ ...info, visible: false })}
      />
    </ScrollView>
  );
}
