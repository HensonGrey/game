import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { usePlayerStore } from "../store/player-store";
import { getNextState, getStrength } from "../helpers/cultivation-helper";
import { TribulationPhase } from "../enums/tribulation-phase.enum";
import { Route } from "../enums/route.enum";
import { InjuryType } from "../enums/injury-type.enum";
import { INJURY_EFFECTS } from "../constants/injury-constants";
import * as T from "../constants/tribulation-constants";

export function useTribulation() {
  const router = useRouter();

  const realmIndex = usePlayerStore((s) => s.currentLife.realmIndex);
  const stageIndex = usePlayerStore((s) => s.currentLife.stageIndex);
  const currentHp = usePlayerStore((s) => s.currentLife.currentHp);
  const maxHp = usePlayerStore((s) => s.currentLife.maxHp);
  const breakthrough = usePlayerStore((s) => s.breakthrough);
  const inflictInjury = usePlayerStore((s) => s.inflictInjury);

  const targetRealmIndex = useMemo(() => {
    const next = getNextState(realmIndex, stageIndex);
    return next ? next.currentRealmIndex : realmIndex + 1;
  }, []);

  const newRealmIndex = useMemo(() => {
    const next = getNextState(realmIndex, stageIndex);
    return next ? next.currentRealmIndex : realmIndex;
  }, []);

  const [showCongrats, setShowCongrats] = useState(false);

  const tuning = useMemo(() => {
    const r = targetRealmIndex;
    return {
      strikeIntervalMs:
        T.BASE_STRIKE_INTERVAL_MS * Math.pow(T.STRIKE_INTERVAL_FACTOR, r),
      burstDamage: T.BASE_BURST_DAMAGE * Math.pow(T.BURST_DAMAGE_FACTOR, r),
      chargePerStrike: T.BASE_CHARGE_PER_STRIKE * Math.pow(T.CHARGE_FACTOR, r),
      tapRelief: T.BASE_TAP_RELIEF * Math.pow(T.TAP_RELIEF_FACTOR, r),
      dotRate: T.BASE_DOT_RATE * Math.pow(T.DOT_RATE_FACTOR, r),
      cloudMaxHp: getStrength(realmIndex, stageIndex),
      cloudTapDamage:
        T.BASE_CLOUD_TAP_DAMAGE * Math.pow(T.CLOUD_TAP_DAMAGE_FACTOR, r),
    };
  }, [targetRealmIndex]);

  const [charge, setCharge] = useState(0);
  const [cloudHp, setCloudHp] = useState(tuning.cloudMaxHp);
  const [phase, setPhase] = useState<TribulationPhase>(TribulationPhase.ACTIVE);
  const [flashing, setFlashing] = useState(false);
  const [lightningX, setLightningX] = useState(0.5);
  const [boltProgress, setBoltProgress] = useState(0);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const chargeRef = useRef(charge);
  chargeRef.current = charge;
  const injuredRef = useRef({ normal: false, eternal: false });

  // Apply pending HP reductions from injuries earned in prior tribulations.
  // Deferred to mount so the player's HP bar doesn't shrink mid-fight.
  useEffect(() => {
    usePlayerStore.setState((state) => {
      let newMaxHp = 100;
      for (const t of state.currentLife.injuries) {
        newMaxHp *= 1 - INJURY_EFFECTS[t].hpReduction;
      }
      for (const t of state.eternalInjuries) {
        newMaxHp *= 1 - INJURY_EFFECTS[t].hpReduction;
      }
      return {
        currentLife: {
          ...state.currentLife,
          maxHp: newMaxHp,
          currentHp: newMaxHp,
        },
      };
    });
  }, []);

  // Strike timer — drives the lightning cadence and damage bursts while ACTIVE.
  useEffect(() => {
    if (phase !== TribulationPhase.ACTIVE) return;

    const strikeTimer = setInterval(() => {
      usePlayerStore.setState((state) => ({
        currentLife: {
          ...state.currentLife,
          currentHp: Math.max(
            0,
            state.currentLife.currentHp - tuning.burstDamage,
          ),
        },
      }));

      setCharge((c) => c + tuning.chargePerStrike);
      setLightningX(0.25 + Math.random() * 0.5);
      setFlashing(true);
      setBoltProgress(0);

      const start = Date.now();
      const descentTimer = setInterval(() => {
        const elapsed = Date.now() - start;
        const p = Math.min(1, elapsed / T.LIGHTNING_FLASH_MS);
        setBoltProgress(p);
        if (p >= 1) clearInterval(descentTimer);
      }, T.BOLT_DESCENT_TICK_MS);

      setTimeout(() => {
        clearInterval(descentTimer);
        setFlashing(false);
        setBoltProgress(0);
      }, T.LIGHTNING_FLASH_MS);
    }, tuning.strikeIntervalMs);

    return () => clearInterval(strikeTimer);
  }, [phase, tuning]);

  // Damage-over-time — while aura charge > 0, drain HP proportionally.
  useEffect(() => {
    if (
      phase === TribulationPhase.SUCCEEDED ||
      phase === TribulationPhase.FAILED
    )
      return;

    const dotTimer = setInterval(() => {
      if (chargeRef.current <= 0) return;
      const hpLoss =
        chargeRef.current * tuning.dotRate * (T.DOT_TICK_MS / 1000);
      usePlayerStore.setState((state) => ({
        currentLife: {
          ...state.currentLife,
          currentHp: Math.max(0, state.currentLife.currentHp - hpLoss),
        },
      }));
    }, T.DOT_TICK_MS);

    return () => clearInterval(dotTimer);
  }, [phase, tuning]);

  // Death + injury threshold watcher.
  useEffect(() => {
    const unsub = usePlayerStore.subscribe((state) => {
      const { currentHp, maxHp } = state.currentLife;
      const hpFraction = currentHp / maxHp;

      if (hpFraction <= 0.5 && !injuredRef.current.normal) {
        injuredRef.current.normal = true;
        inflictInjury(InjuryType.NORMAL);
      }
      if (hpFraction <= 0.2 && !injuredRef.current.eternal) {
        injuredRef.current.eternal = true;
        inflictInjury(InjuryType.ETERNAL);
      }

      if (currentHp <= 0 && phaseRef.current !== TribulationPhase.FAILED) {
        setPhase(TribulationPhase.FAILED);
        setTimeout(() => router.replace(Route.DEAD), 400);
      }
    });
    return () => unsub();
  }, []);

  // Success resolution — once cooldown is entered, apply breakthrough and route home.
  useEffect(() => {
    if (phase !== TribulationPhase.COOLDOWN) return;

    const t = setTimeout(() => {
      setPhase(TribulationPhase.SUCCEEDED);
      usePlayerStore.setState((state) => ({
        currentLife: {
          ...state.currentLife,
          currentHp: state.currentLife.maxHp,
        },
      }));
      breakthrough();
      setShowCongrats(true);
    }, T.COOLDOWN_AFTER_LAST_STRIKE_MS);

    return () => clearTimeout(t);
  }, [phase]);

  const tapRelease = () => {
    if (
      phase === TribulationPhase.SUCCEEDED ||
      phase === TribulationPhase.FAILED
    )
      return;
    setCharge((c) => Math.max(0, c - tuning.tapRelief));
  };

  const tapCloud = () => {
    if (
      phase === TribulationPhase.SUCCEEDED ||
      phase === TribulationPhase.FAILED
    )
      return;
    setCloudHp((hp) => {
      const next = Math.max(0, hp - tuning.cloudTapDamage);
      if (next === 0 && phaseRef.current === TribulationPhase.ACTIVE) {
        setPhase(TribulationPhase.COOLDOWN);
      }
      return next;
    });
  };

  const dismissCongrats = () => {
    setShowCongrats(false);
    router.replace(Route.HOME);
  };

  const maxChargeForVisual = tuning.chargePerStrike * 2;
  const auraIntensity = Math.min(1, charge / maxChargeForVisual);

  const cloudHpFraction = cloudHp / tuning.cloudMaxHp;
  const circlesDestroyed =
    T.CLOUD_SHRINK_THRESHOLDS.filter((t) => cloudHpFraction < t).length * 2;

  return {
    currentHp,
    maxHp,
    charge,
    phase,
    flashing,
    lightningX,
    boltProgress,
    auraIntensity,
    tapRelease,
    tapCloud,
    cloudHp,
    cloudMaxHp: tuning.cloudMaxHp,
    circlesDestroyed,
    showCongrats,
    newRealmIndex,
    dismissCongrats,
  };
}
