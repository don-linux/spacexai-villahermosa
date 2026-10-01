"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Alignment, EventType, Fit, Layout, useRive } from "@rive-app/react-canvas";
import type { Event as RiveEvent } from "@rive-app/react-canvas";

const RIVE_SRC = "/brand/spacexai/spacexai-dark.riv";
const RIVE_ARTBOARD = "SPACE X WEB";
const RIVE_STATE_MACHINE = "SPACE X WEB";

/** A short beat of dark before the Rive logo starts, so the write-on is not lost to the page load. */
const RIVE_HOLD_MS = 350;
/**
 * The state machine settles on the drawn mark after ~1.5s of animation time but never
 * fires Pause/Stop, so the hand-off is driven by the time it has actually advanced.
 */
const RIVE_PLAY_S = 1.5;
/** How long the finished Rive mark holds still before the full wordmark fades in. */
const RIVE_LINGER_MS = 300;
/** Backstop in case frames stop advancing (e.g. a background tab). */
const RIVE_MAX_MS = 5000;
/** The WASM runtime comes from a CDN; give slow networks a chance before skipping the intro. */
const RIVE_LOAD_TIMEOUT_MS = 4000;
/** Must match the `.intro-rive` opacity transition. */
const CROSSFADE_MS = 700;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

type Phase = "intro" | "leaving" | "done";

export function SpaceXAIIntro() {
  const reduceMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("intro");
  const [isArmed, setIsArmed] = useState(false);
  const hasFinished = useRef(false);

  const finish = useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setPhase("leaving");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsArmed(true), RIVE_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = window.setTimeout(() => setPhase("done"), CROSSFADE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const showRive = !reduceMotion && isArmed && phase !== "done";
  const showWordmark = reduceMotion || phase !== "intro";

  return (
    <>
      <div className="spacexai-stage">
        {showWordmark ? (
          <img
            className="spacexai-wordmark"
            src="/brand/spacexai/wordmark-white.svg"
            alt="SpaceXAI"
            width={1294}
            height={158}
          />
        ) : null}
      </div>
      {showRive ? (
        <div className="intro-overlay" role="presentation">
          <IntroRive isLeaving={phase === "leaving"} onDone={finish} />
        </div>
      ) : null}
    </>
  );
}

function IntroRive({ isLeaving, onDone }: { isLeaving: boolean; onDone: () => void }) {
  const { rive, RiveComponent } = useRive({
    src: RIVE_SRC,
    artboard: RIVE_ARTBOARD,
    stateMachine: RIVE_STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: onDone,
  });

  useEffect(() => {
    if (rive) return;
    const timer = window.setTimeout(onDone, RIVE_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [rive, onDone]);

  useEffect(() => {
    if (!rive) return;

    let played = 0;
    let lingerTimer = 0;
    const maxTimer = window.setTimeout(onDone, RIVE_MAX_MS);
    const handleAdvance = (event: RiveEvent) => {
      played += typeof event.data === "number" ? event.data : 0;
      if (played < RIVE_PLAY_S) return;
      rive.off(EventType.Advance, handleAdvance);
      lingerTimer = window.setTimeout(onDone, RIVE_LINGER_MS);
    };

    rive.on(EventType.Advance, handleAdvance);

    return () => {
      window.clearTimeout(maxTimer);
      window.clearTimeout(lingerTimer);
      rive.off(EventType.Advance, handleAdvance);
    };
  }, [rive, onDone]);

  return (
    <RiveComponent
      className={`intro-rive${isLeaving ? " intro-rive-leaving" : ""}`}
      aria-label="SpaceXAI"
      role="img"
    />
  );
}
