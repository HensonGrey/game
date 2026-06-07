import React from "react";
import { render, screen, act } from "@testing-library/react-native";
import { InjuryTypeEnum } from "../enums/injury-type.enum";

// ── Router ──────────────────────────────────────────────────────────────────
const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
}));

// ── Safe area ────────────────────────────────────────────────────────────────
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// ── Icons ────────────────────────────────────────────────────────────────────
jest.mock("@expo/vector-icons", () => ({ FontAwesome5: () => null }));

// ── Child components — minimal stubs ─────────────────────────────────────────
jest.mock("../components/continuation-modal", () => () => null);
jest.mock("../components/item-modal", () => () => null);
jest.mock("../components/title-modal", () => () => null);
jest.mock("../components/qi-aura", () => ({ QiAura: () => null }));
jest.mock("../components/stat-button", () => {
  const { TouchableOpacity, Text } = require("react-native");
  return ({ label, onPress }: any) => (
    <TouchableOpacity testID={`stat-btn-${label}`} onPress={onPress}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
});
jest.mock("../components/animated-number", () => {
  const { Text } = require("react-native");
  return ({ value }: any) => <Text testID="animated-number">{value}</Text>;
});

// ── Env ──────────────────────────────────────────────────────────────────────
jest.mock("../constants/env", () => ({ IS_DEV: false }));

// ── Hooks ────────────────────────────────────────────────────────────────────
// Defined as a plain object so individual tests can mutate fields.
const mockCultivation = {
  qi: 0,
  realmIndex: 0,
  stageIndex: 0,
  requiredQi: 300,
  qiMultiplier: 5,
  canBreakthrough: false,
  BASE_MULTIPLIER: 5,
  SPIRITUAL_ROOT_MULTIPLIER: 1,
  CULTIVATION_MULTIPLIER: 1,
  INJURY_MULTIPLIER: 1,
  PENDANT_MULTIPLIER: 1,
  TITLE_MULTIPLIER: 1,
  pendantLevel: 0,
  injuries: [] as InjuryTypeEnum[],
  eternalInjuries: [] as InjuryTypeEnum[],
};
jest.mock("../hooks/useCultivation", () => ({
  useCultivation: () => mockCultivation,
}));
jest.mock("../hooks/useItem", () => ({
  useItem: () => ({ unlockedItems: [], pendantLevel: 0, PENDANT_MULTIPLIER: 1 }),
}));

// ── Store — created inside the factory so jest hoisting doesn't break it ─────
// Access it via jest.requireMock() after the fact.
jest.mock("../store/player-store", () => {
  const { create } = require("zustand");

  const INITIAL_LIFE = {
    realmIndex: 0,
    stageIndex: 0,
    qi: 0,
    currentAge: 10,
    maxAge: 80,
    currentHp: 100,
    maxHp: 100,
    titles: [] as string[],
    injuries: [] as string[],
  };

  const store = create()((set: any) => ({
    spiritualRootIndex: 0,
    vitalityLevel: 0,
    originPoints: 150,
    lives: [],
    eternalInjuries: [],
    totalTaps: 0,
    claimedAchievements: [],
    itemLevels: {},
    currentLife: { ...INITIAL_LIFE },
    addQi: (amount: number) =>
      set((s: any) => ({
        currentLife: { ...s.currentLife, qi: s.currentLife.qi + amount },
      })),
    breakthrough: jest.fn(),
    recordDeath: jest.fn(),
    reincarnate: jest.fn(),
    inflictInjury: jest.fn(),
    purchaseUpgrade: jest.fn(),
    claimAchievement: jest.fn(),
    upgradeItem: jest.fn(),
  }));

  store.persist = {
    hasHydrated: () => true,
    onFinishHydration: jest.fn(() => () => {}),
    clearStorage: jest.fn(),
  };

  // Stash INITIAL_LIFE so tests can reset to it.
  store.__INITIAL_LIFE = INITIAL_LIFE;

  return { usePlayerStore: store };
});

// ── Subject under test ────────────────────────────────────────────────────────
import HomeScreen from "../app/home";

// ── Grab the mock store after all jest.mock() calls are registered ────────────
let mockStore: any;
let INITIAL_LIFE: any;
beforeAll(() => {
  const m = jest.requireMock("../store/player-store");
  mockStore = m.usePlayerStore;
  INITIAL_LIFE = mockStore.__INITIAL_LIFE;
});

// ─────────────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.useFakeTimers();
  mockReplace.mockClear();
  mockPush.mockClear();
  mockStore.setState({
    originPoints: 150,
    eternalInjuries: [],
    currentLife: { ...INITIAL_LIFE },
  });
  mockCultivation.canBreakthrough = false;
  mockCultivation.injuries = [];
  mockCultivation.eternalInjuries = [];
});

afterEach(() => {
  jest.useRealTimers();
});

// ─────────────────────────────────────────────────────────────────────────────

describe("HomeScreen", () => {
  it("renders without crashing", async () => {
    await act(async () => { render(<HomeScreen />); });
  });

  it("displays the current origin points", async () => {
    await act(async () => { render(<HomeScreen />); });
    expect(screen.getByTestId("animated-number")).toHaveTextContent("150");
  });

  it("displays the current age and max age", async () => {
    await act(async () => { render(<HomeScreen />); });
    // currentAge is nested inside a parent Text that also holds the " / maxAge yrs" child,
    // so match both as substrings rather than exact strings.
    expect(screen.getByText(/10/)).toBeTruthy();
    expect(screen.getByText(/80 yrs/)).toBeTruthy();
  });

  it("hides the breakthrough button when qi is insufficient", async () => {
    await act(async () => { render(<HomeScreen />); });
    expect(screen.queryByText("Breakthrough Realm")).toBeNull();
  });

  it("shows the breakthrough button when qi is sufficient", async () => {
    mockCultivation.canBreakthrough = true;
    await act(async () => { render(<HomeScreen />); });
    expect(screen.getByText("Breakthrough Realm")).toBeTruthy();
  });

  it("does not show the injuries button when there are no injuries", async () => {
    await act(async () => { render(<HomeScreen />); });
    expect(screen.queryByTestId("stat-btn-injuries")).toBeNull();
  });

  it("shows the injuries button when there are active injuries", async () => {
    mockCultivation.injuries = [InjuryTypeEnum.NORMAL];
    await act(async () => { render(<HomeScreen />); });
    expect(screen.getByTestId("stat-btn-injuries")).toBeTruthy();
  });

  it("increments currentAge by 1 every 2 seconds", async () => {
    await act(async () => { render(<HomeScreen />); });
    expect(mockStore.getState().currentLife.currentAge).toBe(10);

    await act(async () => { jest.advanceTimersByTime(2000); });
    expect(mockStore.getState().currentLife.currentAge).toBe(11);

    await act(async () => { jest.advanceTimersByTime(2000); });
    expect(mockStore.getState().currentLife.currentAge).toBe(12);
  });

  it("navigates to the dead screen when currentAge reaches maxAge", async () => {
    global.requestAnimationFrame = (cb: FrameRequestCallback) => { cb(0); return 0; };

    await act(async () => { render(<HomeScreen />); });

    await act(async () => {
      mockStore.setState({
        currentLife: { ...INITIAL_LIFE, currentAge: 80, maxAge: 80 },
      });
    });

    expect(mockReplace).toHaveBeenCalledWith("/dead");
  });
});
