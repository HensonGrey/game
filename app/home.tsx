import {
  View,
  Text,
  Pressable,
  Modal,
  Image,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { realms } from "../data/cultivation-data";
import { useCultivation } from "../hooks/useCultivation";
import { useItem } from "../hooks/useItem";
import { usePlayerStore } from "../store/player-store";
import { formatNumbers, getNextState } from "../helpers/cultivation-helper";
import { getHighestWeightTitle } from "../helpers/title-helper";
import { Route } from "../enums/route.enum";
import { ItemEnum } from "../enums/item.enum";
import { injuryTypes } from "../constants/injury-constants";
import { achievements } from "../data/achievement-data";
import { items } from "../data/item-data";
import ContinuationModal from "../components/continuation-modal";
import ItemModal from "../components/item-modal";
import StatButton from "../components/stat-button";
import { ComponentProps } from "react";
import homeBackground from "../assets/home-background.png";
import playerImage from "../assets/player.png";

export default function HomeScreen() {
  const router = useRouter();
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [isInjuriesVisible, setIsInjuriesVisible] = useState(false);
  const [isAchievementsVisible, setIsAchievementsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemEnum | null>(null);
  const [isTribulationConfirmVisible, setIsTribulationConfirmVisible] =
    useState(false);

  const titles = usePlayerStore((state) => state.currentLife.titles);
  const highestTitle = getHighestWeightTitle(titles);
  const addQi = usePlayerStore((state) => state.addQi);
  const breakthrough = usePlayerStore((state) => state.breakthrough);
  const currentAge = usePlayerStore((state) => state.currentLife.currentAge);
  const maxAge = usePlayerStore((state) => state.currentLife.maxAge);
  const totalTaps = usePlayerStore((state) => state.totalTaps);
  const claimedAchievements = usePlayerStore(
    (state) => state.claimedAchievements,
  );
  const { unlockedItems, pendantLevel, PENDANT_MULTIPLIER } = useItem();
  const claimAchievement = usePlayerStore((state) => state.claimAchievement);

  const {
    qi,
    realmIndex,
    stageIndex,
    requiredQi,
    qiMultiplier,
    canBreakthrough,
    BASE_MULTIPLIER,
    SPIRITUAL_ROOT_MULTIPLIER,
    CULTIVATION_MULTIPLIER,
    INJURY_MULTIPLIER,
    injuries,
    eternalInjuries,
  } = useCultivation();
  const qiProgress = Math.min(qi / requiredQi, 1);

  const statButtons: ComponentProps<typeof StatButton>[] = [
    {
      icon: "bolt",
      label: "stats",
      color: "#c084fc",
      onPress: () => setIsStatsVisible(true),
    },
    {
      icon: "trophy",
      label: "achievements",
      color: "#fbbf24",
      onPress: () => setIsAchievementsVisible(true),
    },
  ];
  if (injuries.length > 0 || eternalInjuries.length > 0) {
    statButtons.push({
      icon: "tint",
      label: "injuries",
      color: "#f87171",
      onPress: () => setIsInjuriesVisible(true),
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      usePlayerStore.setState((state) => ({
        currentLife: {
          ...state.currentLife,
          currentAge: state.currentLife.currentAge + 1,
        },
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsub = usePlayerStore.subscribe((state) => {
      if (state.currentLife.currentAge >= state.currentLife.maxAge) {
        requestAnimationFrame(() => {
          try {
            router.replace(Route.DEAD);
          } catch (e) {
            console.warn("Navigation context deferred safely:", e);
          }
        });
      }
    });
    return () => unsub();
  }, [router]);

  return (
    <Pressable
      className="flex-1 bg-[#0d0d0f]"
      onPress={() => addQi(qiMultiplier)}
    >
      <ImageBackground
        source={homeBackground}
        resizeMode="cover"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/55" />

      <SafeAreaView className="flex-1 px-6">
        {/* Header: Vitality & Prowess */}
        <View className="flex-row justify-between items-center mt-4">
          {/* POPPING LIFE SPAN PANEL */}
          <View className="bg-black/75 border-2 border-amber-500/40 rounded-2xl px-4 py-2.5 flex-row items-center shadow-xl">
            <View className="mr-3 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
              <FontAwesome5 name="hourglass-half" size={16} color="#fbbf24" />
            </View>
            <View>
              <Text className="text-amber-400 uppercase tracking-[2px] text-[10px] font-black">
                Life Span
              </Text>
              <Text className="text-white text-2xl font-black mt-0.5 font-mono tracking-tight">
                {currentAge}
                <Text className="text-gray-400 text-sm font-bold font-sans">
                  {" "}
                  / {Math.ceil(maxAge)} yrs
                </Text>
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-x-3">
            {statButtons.map((b) => (
              <StatButton key={b.label} {...b} />
            ))}
          </View>
        </View>

        {/* Realm Information Header Panel */}
        <View className="items-center mt-6 mb-4 bg-black/40 border border-white/10 rounded-2xl p-4 shadow-2xl">
          {highestTitle && (
            <View className="mb-2 px-3 py-1 border border-cyan-500/40 rounded-md bg-cyan-950/50">
              <Text className="text-cyan-400 text-[10px] tracking-[4px] font-black uppercase text-center">
                {highestTitle}
              </Text>
            </View>
          )}
          <Text
            className="text-white text-3xl font-extrabold tracking-wide text-center"
            style={{
              textShadowColor: "rgba(0, 0, 0, 0.75)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
            }}
          >
            {realms[realmIndex].name}
          </Text>
          <Text className="text-purple-300 text-sm font-semibold tracking-widest uppercase mt-1">
            {realms[realmIndex].stages[stageIndex].name}
          </Text>
        </View>

        {/* Unlocked Items Inventory Bar — layout footprint stays small,
            images overflow visually so they can be much larger without
            pushing the player down */}
        {unlockedItems.length > 0 && (
          <View
            className="flex-row gap-x-4 justify-center items-center mb-2 bg-white/[0.03] border border-white/5 rounded-xl py-2 px-4"
            style={{ height: 56, overflow: "visible" }}
          >
            {unlockedItems.map((item: ItemEnum) => {
              const def = items.find((i) => i.id === item);
              if (!def) return null;
              const HIT = 56;
              const IMG = 240;
              const OFFSET = (HIT - IMG) / 2;
              return (
                <Pressable
                  key={item}
                  onPress={() => setSelectedItem(item)}
                  style={{ width: HIT, height: HIT, overflow: "visible" }}
                >
                  <Image
                    source={def.image}
                    resizeMode="contain"
                    style={{
                      width: IMG,
                      height: IMG,
                      position: "absolute",
                      top: OFFSET,
                      left: OFFSET,
                    }}
                  />
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Player Character Container */}
        <View className="flex-1 items-center justify-center overflow-visible my-2">
          <Image
            source={playerImage}
            resizeMode="contain"
            style={{
              width: "85%",
              height: "85%",
              transform: [{ scale: 1.8 }],
            }}
          />
        </View>

        {/* Qi Essence + Unified Progress Card */}
        <View className="mb-28 bg-black/60 border border-white/10 rounded-2xl p-4 shadow-2xl">
          <View className="flex-row justify-between items-center mb-2.5">
            <View className="flex-row items-center gap-x-1.5">
              <View className="w-2 h-2 rounded-full bg-purple-400" />
              <Text className="text-purple-200 text-xs font-black uppercase tracking-widest">
                Qi Essence
              </Text>
            </View>
            <Text className="text-white font-mono text-xs font-bold">
              {formatNumbers(qi)}{" "}
              <Text className="text-gray-500 font-normal">/</Text>{" "}
              {formatNumbers(requiredQi)}
            </Text>
          </View>
          <View className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
            <View
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${qiProgress * 100}%` }}
            />
          </View>
        </View>

        {/* Breakthrough Action Bottom Bar */}
        <View
          style={{
            position: "absolute",
            bottom: 34,
            left: 24,
            right: 24,
          }}
        >
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              if (!canBreakthrough) return;
              const next = getNextState(realmIndex, stageIndex);
              if (!next) return;
              if (next.currentRealmIndex !== realmIndex) {
                setIsTribulationConfirmVisible(true);
              } else {
                breakthrough();
              }
            }}
            style={{
              display: canBreakthrough ? "flex" : "none",
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              backgroundColor: canBreakthrough
                ? "#fbbf24"
                : "rgba(255,255,255,0.03)",
              borderColor: canBreakthrough
                ? "#fde047"
                : "rgba(255,255,255,0.08)",
              shadowColor: "#fbbf24",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: canBreakthrough ? 0.3 : 0,
              shadowRadius: 12,
              elevation: canBreakthrough ? 8 : 0,
            }}
          >
            <Text
              style={{
                fontWeight: "900",
                fontSize: 14,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: canBreakthrough ? "#0d0d0f" : "#4b5563",
              }}
            >
              {canBreakthrough ? "Breakthrough Realm" : "Accumulate Qi"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Stats / Multipliers Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={isStatsVisible}
        onRequestClose={() => setIsStatsVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/80 px-6">
          <View className="w-full bg-[#131316] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <Text className="text-white text-lg font-bold mb-6 text-center tracking-widest uppercase">
              🔮 Qi Multiplier
            </Text>

            <View className="gap-y-3.5 mb-8">
              <View className="flex-row justify-between items-center border-b border-white/5 pb-2.5">
                <Text className="text-gray-400 text-sm">Base</Text>
                <Text className="text-green-400 font-mono font-bold">
                  + {BASE_MULTIPLIER}
                </Text>
              </View>

              <View className="flex-row justify-between items-center border-b border-white/5 pb-2.5">
                <Text className="text-gray-400 text-sm">Cultivation Realm</Text>
                <Text className="text-green-400 font-mono font-bold">
                  × {CULTIVATION_MULTIPLIER.toFixed(0)}
                </Text>
              </View>

              <View className="flex-row justify-between items-center border-b border-white/5 pb-2.5">
                <Text className="text-gray-400 text-sm">Spiritual Root</Text>
                <Text className="text-green-400 font-mono font-bold">
                  × {SPIRITUAL_ROOT_MULTIPLIER}
                </Text>
              </View>

              {INJURY_MULTIPLIER < 1 && (
                <View className="flex-row justify-between items-center border-b border-white/5 pb-2.5">
                  <Text className="text-red-400 text-sm">Active Injuries</Text>
                  <Text className="text-red-400 font-mono font-bold">
                    × {INJURY_MULTIPLIER.toFixed(2)}
                  </Text>
                </View>
              )}

              {pendantLevel > 0 && (
                <View className="flex-row justify-between items-center border-b border-white/5 pb-2.5">
                  <Text className="text-amber-300 text-sm">
                    Pendant (Lv {pendantLevel})
                  </Text>
                  <Text className="text-amber-400 font-mono font-bold">
                    × {PENDANT_MULTIPLIER.toFixed(2)}
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between items-center pt-3">
                <Text className="text-white font-black text-base">
                  Total Multiplier
                </Text>
                <Text className="text-purple-400 text-2xl font-black font-mono">
                  {qiMultiplier.toFixed(0)}x
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setIsStatsVisible(false)}
              className="bg-white/10 border border-white/10 py-3.5 rounded-xl items-center"
            >
              <Text className="text-white font-bold uppercase tracking-widest text-xs">
                Dismiss
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Injuries Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={isInjuriesVisible}
        onRequestClose={() => setIsInjuriesVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/80 px-6">
          <View className="w-full bg-[#131316] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <Text className="text-red-400 text-lg font-bold mb-6 text-center tracking-widest uppercase">
              🩸 Dao Injuries
            </Text>

            <View className="gap-y-3.5 mb-8">
              {injuries.map((type, i) => (
                <View
                  key={`n-${i}`}
                  className="flex-row justify-between items-center border-b border-white/5 pb-2.5"
                >
                  <View className="flex-row items-center">
                    <FontAwesome5 name="tint" size={12} color="#f87171" solid />
                    <Text className="text-red-400 font-medium ml-2.5 text-sm">
                      Normal Injury
                    </Text>
                  </View>
                  <Text className="text-gray-400 font-mono text-xs">
                    Qi Production ×{" "}
                    {(
                      injuryTypes.find((i) => i.id === type)?.qiMultiplier ?? 1
                    ).toFixed(2)}
                  </Text>
                </View>
              ))}

              {eternalInjuries.map((type, i) => (
                <View
                  key={`e-${i}`}
                  className="flex-row justify-between items-center border-b border-white/5 pb-2.5"
                >
                  <View className="flex-row items-center">
                    <FontAwesome5 name="tint" size={12} color="#b91c1c" solid />
                    <Text className="text-red-600 font-black ml-2.5 text-sm">
                      Eternal Fracture
                    </Text>
                  </View>
                  <Text className="text-red-500 font-mono text-xs font-bold">
                    ×{" "}
                    {(
                      injuryTypes.find((i) => i.id === type)?.qiMultiplier ?? 1
                    ).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={() => setIsInjuriesVisible(false)}
              className="bg-red-950/40 border border-red-500/20 py-3.5 rounded-xl items-center"
            >
              <Text className="text-red-400 font-bold uppercase tracking-widest text-xs">
                Close Logs
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Achievements Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={isAchievementsVisible}
        onRequestClose={() => setIsAchievementsVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/80 px-6">
          <View className="w-full bg-[#131316] border border-white/10 rounded-3xl p-5 shadow-2xl">
            <Text className="text-white text-lg font-bold mb-5 text-center tracking-widest uppercase">
              🏆 Karma Records
            </Text>

            <View className="gap-y-3 mb-6">
              {achievements.map((def) => {
                const id = def.id;
                const progress = def.getProgress({
                  totalTaps,
                  currentRealmIndex: realmIndex,
                });
                const isNumeric = !("completed" in progress);
                const done = isNumeric
                  ? progress.current >= progress.target
                  : progress.completed;
                const progressFraction = isNumeric
                  ? Math.min(progress.current / progress.target, 1)
                  : done
                    ? 1
                    : 0;
                const claimed = claimedAchievements.includes(id);
                const rewardItem = def.itemReward
                  ? items.find((i) => i.id === def.itemReward)
                  : null;

                return (
                  <View
                    key={id}
                    className="rounded-xl bg-white/[0.02] border border-white/5 p-3 flex-row items-center"
                  >
                    <View
                      className={`w-12 h-12 rounded-xl items-center justify-center mr-3 border ${
                        done
                          ? "bg-amber-400/10 border-amber-400/30"
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <FontAwesome5
                        name={def.icon}
                        size={18}
                        color={done ? "#fbbf24" : "#4b5563"}
                        solid
                      />
                    </View>

                    <View className="flex-1 mr-2">
                      <Text className="text-white text-xs font-bold uppercase tracking-wider">
                        {def.name}
                      </Text>
                      <Text className="text-gray-400 text-[11px] italic mt-0.5">
                        {def.description}
                      </Text>

                      {isNumeric && (
                        <View className="mt-2">
                          <View className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <View
                              className={`h-full rounded-full ${
                                done ? "bg-amber-400" : "bg-purple-500"
                              }`}
                              style={{ width: `${progressFraction * 100}%` }}
                            />
                          </View>
                          <Text className="text-gray-500 font-mono text-[9px] mt-1">
                            {progress.current} / {progress.target}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View
                      className="items-end justify-center"
                      style={{ minWidth: 74 }}
                    >
                      <View className="flex-row items-center mb-1.5">
                        <FontAwesome5
                          name="gem"
                          size={8}
                          color="#fbbf24"
                          solid
                        />
                        <Text className="text-amber-400 font-mono text-[10px] font-bold ml-1">
                          +{def.originPointsReward}
                        </Text>
                        {rewardItem && (
                          <Image
                            source={rewardItem.image}
                            resizeMode="contain"
                            style={{ width: 16, height: 16, marginLeft: 6 }}
                          />
                        )}
                      </View>

                      {done && claimed && (
                        <View className="bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                          <Text className="text-gray-500 text-[8px] font-bold uppercase tracking-wider">
                            Claimed
                          </Text>
                        </View>
                      )}
                      {done && !claimed && (
                        <Pressable
                          onPress={() => claimAchievement(id)}
                          className="bg-amber-400 px-3 py-1 rounded-md"
                        >
                          <Text className="text-black text-[9px] font-black uppercase tracking-wider">
                            Claim
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            <Pressable
              onPress={() => setIsAchievementsVisible(false)}
              className="bg-white/10 border border-white/5 py-3.5 rounded-xl items-center"
            >
              <Text className="text-white font-bold uppercase tracking-widest text-xs">
                Back to Temple
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      <ContinuationModal
        visible={isTribulationConfirmVisible}
        showIcon={false}
        title="Heavenly Tribulation"
        body={
          <>
            To reach for the{" "}
            <Text className="text-purple-400 font-black not-italic uppercase tracking-widest">
              {realms[realmIndex + 1]?.name ?? "next"}
            </Text>{" "}
            realm is an unforgivable offense against the high heavens. The skies
            have already gathered to grind such ambition back to dust. Ascend
            regardless?
          </>
        }
        buttonLabel="Begin"
        onDismiss={() => {
          setIsTribulationConfirmVisible(false);
          router.push(Route.TRIBULATION);
        }}
      />
    </Pressable>
  );
}
