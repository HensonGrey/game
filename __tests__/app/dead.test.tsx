import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react-native";

// ── Router ───────────────────────────────────────────────────────────────────
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

// ── Icons ────────────────────────────────────────────────────────────────────
jest.mock("@expo/vector-icons", () => ({ FontAwesome5: () => null }));

// ── Env ──────────────────────────────────────────────────────────────────────
jest.mock("../../constants/env", () => ({ IS_DEV: false }));

// ── Store ────────────────────────────────────────────────────────────────────
jest.mock("../../store/player-store", () => {
  const { create } = require("zustand");

  const INITIAL_LIFE = {
    realmIndex: 0,
    stageIndex: 0,
    qi: 0,
    currentAge: 42,
    maxAge: 80,
    currentHp: 100,
    maxHp: 100,
    titles: [] as string[],
    injuries: [] as string[],
  };

  const store = create()((set: any) => ({
    spiritualRootIndex: 0,
    vitalityLevel: 0,
    originPoints: 0,
    lives: [],
    eternalInjuries: [],
    totalTaps: 0,
    claimedAchievements: [],
    itemLevels: {},
    currentLife: { ...INITIAL_LIFE },
    recordDeath: jest.fn(),
    reincarnate: jest.fn(),
    addQi: jest.fn(),
    breakthrough: jest.fn(),
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
  store.__INITIAL_LIFE = INITIAL_LIFE;

  return { usePlayerStore: store };
});

// ── Subject under test ────────────────────────────────────────────────────────
import Dead from "../../app/dead";

let mockStore: any;
let INITIAL_LIFE: any;
beforeAll(() => {
  const m = jest.requireMock("../../store/player-store");
  mockStore = m.usePlayerStore;
  INITIAL_LIFE = mockStore.__INITIAL_LIFE;
});

beforeEach(() => {
  mockReplace.mockClear();
  mockStore.setState({ currentLife: { ...INITIAL_LIFE } });
  (mockStore.getState().recordDeath as jest.Mock).mockClear();
});

// ─────────────────────────────────────────────────────────────────────────────

describe("Dead screen", () => {
  it("renders without crashing", async () => {
    await act(async () => { render(<Dead />); });
  });

  it("calls recordDeath once on mount", async () => {
    await act(async () => { render(<Dead />); });
    expect(mockStore.getState().recordDeath).toHaveBeenCalledTimes(1);
  });

  it("displays the current age", async () => {
    await act(async () => { render(<Dead />); });
    // currentAge = 42
    expect(screen.getByText("42")).toBeTruthy();
  });

  it("displays the realm name", async () => {
    const { realms } = require("../../data/cultivation-data");
    await act(async () => { render(<Dead />); });
    expect(screen.getByText(realms[0].name)).toBeTruthy();
  });

  it("displays the stage name", async () => {
    const { realms } = require("../../data/cultivation-data");
    await act(async () => { render(<Dead />); });
    expect(screen.getByText(realms[0].stages[0].name)).toBeTruthy();
  });

  it("navigates to the store screen when reincarnate is pressed", async () => {
    await act(async () => { render(<Dead />); });
    const btn = screen.getByText("Prepare For Reincarnation");
    await act(async () => { fireEvent.press(btn); });
    expect(mockReplace).toHaveBeenCalledWith("/store");
  });
});
