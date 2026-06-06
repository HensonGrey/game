import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { usePlayerStore } from "../store/player-store";
import homeBackground from "../assets/home-background.png";
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
    label: `${roots[spiritualRootIndex].rank} Root`,
    icon: "leaf",
    cost: getUpgradeCost(UPGRADE_TYPES.SPIRITUAL_ROOT),
    level: spiritualRootIndex + 1,
    maxLevel: roots.length - 1,
    isMaxed: spiritualRootIndex >= roots.length - 1,
    desc: roots[spiritualRootIndex].description,
    levelLabel: `${roots[spiritualRootIndex].rank} Grade`,
    nextDesc: roots[spiritualRootIndex + 1]?.description || "MAX",
    nextLabel: roots[spiritualRootIndex + 1]?.rank || "MAX",
  };

  const vitality: Upgrade = {
    type: UPGRADE_TYPES.VITALITY,
    label: "Physical Qi",
    icon: "heart",
    cost: getUpgradeCost(UPGRADE_TYPES.VITALITY),
    level: vitalityLevel + 1,
    isMaxed: false,
    desc: `Current Essence: +${vitalityLevel * 20}% Lifespan`,
    nextDesc: `Breakthrough to: +${(vitalityLevel + 1) * 20}% Lifespan`,
    nextLabel: undefined,
  };

  const upgrades: Upgrade[] = [spiritualRoot, vitality];

  if (eternalInjuries.length > 0) {
    const count = eternalInjuries.length;
    upgrades.push({
      type: UPGRADE_TYPES.CLEANSE_ETERNAL_INJURIES,
      label: "Wash Karma (Injuries)",
      icon: "yin-yang",
      cost: getUpgradeCost(UPGRADE_TYPES.CLEANSE_ETERNAL_INJURIES),
      level: count,
      levelLabel: `${count} Tribulation Scar${count === 1 ? "" : "s"}`,
      isMaxed: false,
      desc: `Purge every eternal injury carried. Stat reductions are restored on the next life.`,
      nextDesc: undefined,
      nextLabel: undefined,
    });
  }

  return (
    <View className="flex-1 bg-[#0d0d0f]">
      <ImageBackground
        source={homeBackground}
        resizeMode="cover"
        blurRadius={6}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/65" />

      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 24,
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cultivation Pavilion Header */}
        <View className="flex-row justify-between items-center mb-8 border-2 border-amber-500/40 pb-4 bg-black/70 p-4 rounded-2xl shadow-xl">
          <View>
            <Text className="text-amber-400 text-2xl font-black tracking-wide">
              TREASURY PAVILION
            </Text>
            <Text className="text-amber-200/70 text-xs font-mono tracking-tight mt-0.5">
              Exchange Karma & Destiny
            </Text>
          </View>

          {/* Cultivation Currency Interface */}
          <View className="items-end bg-amber-500/10 px-3 py-2 border border-amber-500/30 rounded-xl">
            <Text className="text-amber-400 text-[10px] font-bold tracking-wider uppercase">
              Store Points
            </Text>
            <View className="flex-row items-center gap-x-1.5">
              <FontAwesome5 name="gem" size={12} color="#fbbf24" />
              <Text className="text-white text-xl font-bold font-mono">
                {originPoints.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Dynamic Talisman/Upgrade Cards list */}
        <View className="w-full gap-y-4">
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

      {/* Reincarnation Wheel Trigger Button */}
      <View className="absolute bottom-6 left-0 right-0 items-center px-6">
        <TouchableOpacity
          className="bg-amber-600 w-full py-4 rounded-2xl border-2 border-amber-300/50 border-b-4 border-b-amber-800 active:border-b-2 active:mt-0.5 flex-row justify-center items-center shadow-xl"
          activeOpacity={0.9}
          onPress={() => {
            reincarnate();
            router.replace(Route.HOME);
          }}
        >
          <Text className="text-white font-black text-lg tracking-widest">
            REINCARNATE
          </Text>
        </TouchableOpacity>
      </View>

      <UpgradeModal
        {...info}
        onClose={() => setInfo({ ...info, visible: false })}
      />
    </View>
  );
}
