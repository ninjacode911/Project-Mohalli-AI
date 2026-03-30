import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMapSync } from "@/hooks/useMapSync";
import { useAppStore } from "@/store/useAppStore";

describe("useMapSync", () => {
  beforeEach(() => {
    useAppStore.setState({ activeMarkerId: null });
  });

  it("handleCardClick sets active marker immediately", () => {
    const { result } = renderHook(() => useMapSync());

    act(() => {
      result.current.handleCardClick("place-123");
    });

    expect(useAppStore.getState().activeMarkerId).toBe("place-123");
  });

  it("handleCardHover sets active marker after debounce", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useMapSync());

    act(() => {
      result.current.handleCardHover("place-456");
    });

    // Not yet set (debounce)
    expect(useAppStore.getState().activeMarkerId).toBeNull();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(useAppStore.getState().activeMarkerId).toBe("place-456");
    vi.useRealTimers();
  });

  it("handleCardHover(null) clears active marker", async () => {
    vi.useFakeTimers();
    useAppStore.setState({ activeMarkerId: "place-789" });

    const { result } = renderHook(() => useMapSync());

    act(() => {
      result.current.handleCardHover(null);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(useAppStore.getState().activeMarkerId).toBeNull();
    vi.useRealTimers();
  });
});
