import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { usePlayerStore } from "../../store/player-store";
import UpgradeCard from "../../components/upgrade-card";
import UpgradeModal from "../../components/upgrade-modal";
import { Upgrade } from "../../interfaces/store-upgrade.interface";

const upgrades: Upgrade[] = [
  {
    label: "Spiritual Root",
    icon: "seedling",
    cost: 100,
    level: "Low Grade Spiritual Root",
    desc: "The foundation of your existence. Improves natural energy absorption.",
  },
  {
    label: "Vitality",
    icon: "bolt",
    cost: 250,
    level: 12,
    desc: "Directly amplifies the output of your skills.",
  },
];

export default function SystemStore() {
  const [info, setInfo] = useState<any>({
    //TODO, use types
    visible: false,
    title: "",
    desc: "",
    level: 0,
  });
  const originPoints = usePlayerStore((state) => state.originPoints);
  const purchaseUpgrade = usePlayerStore((state) => state.purchaseUpgrade);

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
            canAfford={originPoints >= upgrade.cost}
            onInfoPress={() =>
              setInfo({
                visible: true,
                title: upgrade.label,
                desc: upgrade.desc,
                level: upgrade.level,
              })
            }
            onPress={() => purchaseUpgrade(upgrade)}
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
