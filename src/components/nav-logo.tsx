"use client";

import { useCallback, useEffect, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import { useLandingRevealed } from "@/app/intro-gate";
import {
  RIVE_ARTBOARD,
  RIVE_ARTBOARD_SIZE,
  RIVE_MARK_BOX,
  RIVE_SRC,
  RIVE_STATE_MACHINE,
  usePrefersReducedMotion,
  useRiveSettled,
} from "@/lib/spacexai-rive";
import { useResolvedTheme } from "@/lib/theme";

/** Rendered height of the X mark in the navbar, in px. */
const MARK_HEIGHT = 20;
/** `mark-white.svg` is 413x158. */
const MARK_WIDTH = (MARK_HEIGHT * 413) / 158;
/** Lets the navbar fade in before the letters start sweeping into the mark. */
const START_DELAY_MS = 250;
/** The runtime and .riv are usually cached by the intro; fall back to the static mark if not. */
const LOAD_TIMEOUT_MS = 2500;

/**
 * The artboard is much wider than the mark it settles on, so the canvas is scaled until that
 * mark is `MARK_HEIGHT` tall and offset so it lands exactly where the static mark would be.
 */
const scale = MARK_HEIGHT / RIVE_MARK_BOX.height;
const canvasStyle: CSSProperties = {
  position: "absolute",
  left: -RIVE_MARK_BOX.x * scale,
  top: -RIVE_MARK_BOX.y * scale,
  width: RIVE_ARTBOARD_SIZE.width * scale,
  height: RIVE_ARTBOARD_SIZE.height * scale,
  pointerEvents: "none",
};

type Mode = "waiting" | "playing" | "settled" | "static";

export function NavLogo() {
  const revealed = useLandingRevealed();
  const reduceMotion = usePrefersReducedMotion();
  const theme = useResolvedTheme();
  const [isArmed, setIsArmed] = useState(false);
  const [mode, setMode] = useState<Mode>("waiting");
  const [replays, setReplays] = useState(0);

  useEffect(() => {
    if (!revealed || reduceMotion) return;
    const timer = window.setTimeout(() => setIsArmed(true), START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [revealed, reduceMotion]);

  const handlePlay = useCallback(() => setMode("playing"), []);
  const handleSettled = useCallback(() => setMode("settled"), []);
  const handleFail = useCallback(() => setMode("static"), []);

  // The Rive mark is white-only, so light mode keeps the static black symbol.
  const effectiveMode: Mode = reduceMotion || theme === "light" ? "static" : mode;
  const showLabel = effectiveMode === "settled" || effectiveMode === "static";

  const replay = (event: PointerEvent) => {
    if (event.pointerType !== "mouse" || effectiveMode !== "settled") return;
    setMode("playing");
    setReplays((count) => count + 1);
  };

  return (
    <a
      href="/"
      className="flex items-center gap-3 rounded-md outline-offset-4"
      aria-label="SpaceXAI Villahermosa, inicio"
      onPointerEnter={replay}
    >
      <span className="relative block shrink-0" style={{ width: MARK_WIDTH, height: MARK_HEIGHT }}>
        {effectiveMode === "static" ? (
          <>
            <img
              src="/brand/spacexai/mark-white.svg"
              alt=""
              width={MARK_WIDTH}
              height={MARK_HEIGHT}
              className="theme-dark-only block h-full w-full"
            />
            <img
              src="/brand/spacexai/spacexai-symbol-black-transparent.svg"
              alt=""
              width={MARK_WIDTH}
              height={MARK_HEIGHT}
              className="theme-light-only block h-full w-full object-contain"
            />
          </>
        ) : isArmed ? (
          <NavRive
            replays={replays}
            onPlay={handlePlay}
            onSettled={handleSettled}
            onFail={handleFail}
          />
        ) : null}
      </span>
      <span
        className={`nav-logo-label flex items-center gap-3${showLabel ? " nav-logo-label-in" : ""}`}
        aria-hidden
      >
        <span className="h-4 w-px bg-foreground/25" />
        <span className="text-[15px] font-medium tracking-tight text-foreground/90">
          Villahermosa
        </span>
      </span>
    </a>
  );
}

function NavRive({
  replays,
  onPlay,
  onSettled,
  onFail,
}: {
  replays: number;
  onPlay: () => void;
  onSettled: () => void;
  onFail: () => void;
}) {
  const { rive, RiveComponent } = useRive({
    src: RIVE_SRC,
    artboard: RIVE_ARTBOARD,
    stateMachine: RIVE_STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoad: onPlay,
    onLoadError: onFail,
  });

  useEffect(() => {
    if (rive) return;
    const timer = window.setTimeout(onFail, LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [rive, onFail]);

  useEffect(() => {
    if (!rive || replays === 0) return;
    rive.reset({ artboard: RIVE_ARTBOARD, stateMachine: RIVE_STATE_MACHINE, autoplay: true });
  }, [rive, replays]);

  useRiveSettled(rive, onSettled, replays);

  return <RiveComponent aria-hidden style={canvasStyle} />;
}
