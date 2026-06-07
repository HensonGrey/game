import React from "react";
import { render, screen, act } from "@testing-library/react-native";

// ── Router ───────────────────────────────────────────────────────────────────
jest.mock("expo-router", () => {
  const { View } = require("react-native");
  return {
    Redirect: ({ href }: any) => <View testID="redirect" accessibilityLabel={href} />,
  };
});

// ── Env ──────────────────────────────────────────────────────────────────────
jest.mock("../../constants/env", () => ({ IS_DEV: false }));

// ── Store — only persist.hasHydrated / onFinishHydration are used here ────────
jest.mock("../../store/player-store", () => {
  const hasHydrated = jest.fn(() => false);
  const onFinishHydration = jest.fn((_cb: () => void) => () => {});
  return {
    usePlayerStore: {
      persist: { hasHydrated, onFinishHydration },
    },
    _mockHasHydrated: hasHydrated,
    _mockOnFinishHydration: onFinishHydration,
  };
});

// ── Subject under test ────────────────────────────────────────────────────────
import Loading from "../../app/index";

let mockHasHydrated: jest.Mock;
let mockOnFinishHydration: jest.Mock;
beforeAll(() => {
  const m = jest.requireMock("../../store/player-store");
  mockHasHydrated = m._mockHasHydrated;
  mockOnFinishHydration = m._mockOnFinishHydration;
});

beforeEach(() => {
  mockHasHydrated.mockReturnValue(false);
  mockOnFinishHydration.mockReturnValue(() => {});
  mockHasHydrated.mockClear();
  mockOnFinishHydration.mockClear();
});

// ─────────────────────────────────────────────────────────────────────────────

describe("Loading screen (app/index)", () => {
  it("shows the loading text when the store is not yet hydrated", async () => {
    mockHasHydrated.mockReturnValue(false);
    await act(async () => { render(<Loading />); });
    expect(screen.getByText("Loading player data...")).toBeTruthy();
  });

  it("renders Redirect to /home when the store is already hydrated", async () => {
    mockHasHydrated.mockReturnValue(true);
    await act(async () => { render(<Loading />); });
    const redirect = screen.getByTestId("redirect");
    expect(redirect.props.accessibilityLabel).toBe("/home");
  });

  it("renders Redirect after the onFinishHydration callback fires", async () => {
    mockHasHydrated.mockReturnValue(false);
    let hydrateCallback: (() => void) | undefined;
    mockOnFinishHydration.mockImplementation((cb: () => void) => {
      hydrateCallback = cb;
      return () => { hydrateCallback = undefined; };
    });

    await act(async () => { render(<Loading />); });
    expect(screen.queryByTestId("redirect")).toBeNull();

    await act(async () => { hydrateCallback?.(); });
    expect(screen.getByTestId("redirect")).toBeTruthy();
  });

  it("subscribes to onFinishHydration when not yet hydrated", async () => {
    mockHasHydrated.mockReturnValue(false);
    await act(async () => { render(<Loading />); });
    expect(mockOnFinishHydration).toHaveBeenCalledTimes(1);
  });

  it("does not subscribe to onFinishHydration when already hydrated", async () => {
    mockHasHydrated.mockReturnValue(true);
    await act(async () => { render(<Loading />); });
    expect(mockOnFinishHydration).not.toHaveBeenCalled();
  });
});
