import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react-native";
import { InjuryTypeEnum } from "../../enums/injury-type.enum";
import { UPGRADE_TYPES } from "../../interfaces/store-upgrade.interface";

// ── Router ───────────────────────────────────────────────────────────────────
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

// ── Icons ────────────────────────────────────────────────────────────────────
jest.mock("@expo/vector-icons", () => ({ FontAwesome5: () => null }));

// ── Env ──────────────────────────────────────────────────────────────────────
jest.mock("../../constants/env", () => ({ IS_DEV: false }));

// ── Child components ──────────────────────────────────────────────────────────
jest.mock("../../components/upgrade-card", () => {
  const { TouchableOpacity, Text } = require("react-native");
  return ({ upgrade, onPress }: any) => (
    <TouchableOpacity testID={`upgrade-${upgrade.type}`} onPress={onPress}>
      <Text>{upgrade.label}</Text>
    </TouchableOpacity>
  );
});
jest.mock("../../components/upgrade-modal", () => () => null);

// ── Store ─────────────────────────────────────────────────────────────────────
jest.mock("../../store/player-store", () => {
  const { create } = require("zustand");

  const store = create()((set: any) => ({
    spiritualRootIndex: 0,
    vitalityLevel: 0,
    originPoints: 150,
    eternalInjuries: [] as string[],
    lives: [],
    totalTaps: 0,
    claimedAchievements: [],
    itemLevels: {},
    currentLife: {
      realmIndex: 0, stageIndex: 0, qi: 0, currentAge: 0, maxAge: 80,
      currentHp: 100, maxHp: 100, titles: [], injuries: [],
    },
    reincarnate: jest.fn(),
    purchaseUpgrade: jest.fn(),
    addQi: jest.fn(),
    breakthrough: jest.fn(),
    recordDeath: jest.fn(),
    inflictInjury: jest.fn(),
    claimAchievement: jest.fn(),
    upgradeItem: jest.fn(),
  }));

  store.persist = {
    hasHydrated: () => true,
    onFinishHydration: jest.fn(() => () => {}),
    clearStorage: jest.fn(),
  };

  return { usePlayerStore: store };
});

// ── Subject under test ────────────────────────────────────────────────────────
import SystemStore from "../../app/store";

let mockStore: any;
beforeAll(() => {
  mockStore = jest.requireMock("../../store/player-store").usePlayerStore;
});

beforeEach(() => {
  mockReplace.mockClear();
  mockStore.setState({
    spiritualRootIndex: 0,
    vitalityLevel: 0,
    originPoints: 150,
    eternalInjuries: [],
  });
  (mockStore.getState().reincarnate as jest.Mock).mockClear();
  (mockStore.getState().purchaseUpgrade as jest.Mock).mockClear();
});

// ─────────────────────────────────────────────────────────────────────────────

describe("SystemStore screen", () => {
  it("renders without crashing", async () => {
    await act(async () => { render(<SystemStore />); });
  });

  it("displays the current origin points", async () => {
    await act(async () => { render(<SystemStore />); });
    expect(screen.getByText("150")).toBeTruthy();
  });

  it("renders the spiritual root upgrade card", async () => {
    await act(async () => { render(<SystemStore />); });
    // roots[0].rank = "Low Grade" → label = "Low Grade Root"
    expect(screen.getByText("Low Grade Root")).toBeTruthy();
  });

  it("renders the vitality upgrade card", async () => {
    await act(async () => { render(<SystemStore />); });
    expect(screen.getByText("Physical Qi")).toBeTruthy();
  });

  it("does not show the cleanse injuries card when there are no eternal injuries", async () => {
    await act(async () => { render(<SystemStore />); });
    expect(screen.queryByText("Wash Karma (Injuries)")).toBeNull();
  });

  it("shows the cleanse injuries card when eternal injuries are present", async () => {
    mockStore.setState({ eternalInjuries: [InjuryTypeEnum.ETERNAL] });
    await act(async () => { render(<SystemStore />); });
    expect(screen.getByText("Wash Karma (Injuries)")).toBeTruthy();
  });

  it("pressing REINCARNATE calls reincarnate and navigates to /home", async () => {
    await act(async () => { render(<SystemStore />); });
    const btn = screen.getByText("REINCARNATE");
    await act(async () => { fireEvent.press(btn); });
    expect(mockStore.getState().reincarnate).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith("/home");
  });

  it("pressing an upgrade card calls purchaseUpgrade with the card's type and cost", async () => {
    await act(async () => { render(<SystemStore />); });
    // spiritual root at index 0: cost = floor(25 * 1.8^0) = 25
    const card = screen.getByTestId(`upgrade-${UPGRADE_TYPES.SPIRITUAL_ROOT}`);
    await act(async () => { fireEvent.press(card); });
    expect(mockStore.getState().purchaseUpgrade).toHaveBeenCalledWith(
      UPGRADE_TYPES.SPIRITUAL_ROOT,
      25,
    );
  });
});
