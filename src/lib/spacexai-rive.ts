"use client";

import { useEffect, useSyncExternalStore } from "react";
import { EventType } from "@rive-app/react-canvas";
import type { Event as RiveEvent, Rive } from "@rive-app/react-canvas";

export const RIVE_SRC = "/brand/spacexai/spacexai-dark.riv";
export const RIVE_ARTBOARD = "SPACE X WEB";
export const RIVE_STATE_MACHINE = "SPACE X WEB";

/** Artboard size, and where the X mark rests once the letters have collapsed into it. */
export const RIVE_ARTBOARD_SIZE = { width: 1389, height: 257 };
export const RIVE_MARK_BOX = { x: 65, y: 56, width: 386, height: 154 };

/**
 * The state machine settles on the drawn mark after ~1.5s of animation time but never
 * fires Pause/Stop, so the hand-off is driven by the time it has actually advanced.
 */
const RIVE_PLAY_S = 1.5;
/** Backstop in case frames stop advancing (e.g. a background tab). */
const RIVE_MAX_MS = 5000;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/**
 * Calls `onSettled` once the animation has played through to the resting mark.
 * Bump `run` to watch a replay after `rive.reset()`.
 */
export function useRiveSettled(rive: Rive | null, onSettled: () => void, run = 0) {
  useEffect(() => {
    if (!rive) return;

    let played = 0;
    const maxTimer = window.setTimeout(onSettled, RIVE_MAX_MS);
    const handleAdvance = (event: RiveEvent) => {
      played += typeof event.data === "number" ? event.data : 0;
      if (played < RIVE_PLAY_S) return;
      rive.off(EventType.Advance, handleAdvance);
      window.clearTimeout(maxTimer);
      onSettled();
    };

    rive.on(EventType.Advance, handleAdvance);

    return () => {
      window.clearTimeout(maxTimer);
      rive.off(EventType.Advance, handleAdvance);
    };
  }, [rive, onSettled, run]);
}
