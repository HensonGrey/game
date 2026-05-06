import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { usePlayerStore } from "../../store/player-store";
import UpgradeCard from "../../components/upgrade-card";
import UpgradeModal from "../../components/upgrade-modal";
import {
  Upgrade,
  UPGRADE_TYPES,
} from "../../interfaces/store-upgrade.interface";
import spiritualRootJson from "../../constants/spiritual-root.json";

export default function SystemStore() {
  const [info, setInfo] = useState<any>({
    //TODO, use types
    visible: false,
    title: "",
    desc: "",
    level: 0,
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
        if (spiritualRootIndex >= spiritualRootJson.length - 1) return;

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
    label: `${spiritualRootJson[spiritualRootIndex].rank}`,
    icon: "seedling",
    cost: getUpgradeCost(UPGRADE_TYPES.SPIRITUAL_ROOT),
    level: spiritualRootIndex + 1,
    maxLevel: spiritualRootJson.length - 1,
    isMaxed: spiritualRootIndex >= spiritualRootJson.length - 1,
    desc: spiritualRootJson[spiritualRootIndex].description,
  };

  const vitality: Upgrade = {
    type: UPGRADE_TYPES.VITALITY,
    label: "Vitality",
    icon: "tint",
    cost: getUpgradeCost(UPGRADE_TYPES.VITALITY),
    level: vitalityLevel + 1,
    isMaxed: false,
    desc: `Increases your lifespan by ${vitalityLevel * 20}%`,
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
        onClose={() => setInfo({ ...info, visible: false })}
      />
    </ScrollView>
  );
}
