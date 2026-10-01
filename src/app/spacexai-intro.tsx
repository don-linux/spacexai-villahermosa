"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Alignment, EventType, Fit, Layout, useRive } from "@rive-app/react-canvas";

const RIVE_SRC = "/brand/spacexai/spacexai-dark.riv";
const RIVE_ARTBOARD = "SPACE X WEB";
const RIVE_STATE_MACHINE = "SPACE X WEB";

/** A short beat of dark before the Rive logo starts, so the write-on is not lost to the page load. */
const RIVE_HOLD_MS = 350;
/** How long the finished Rive mark holds still before handing over to the static wordmark. */
const RIVE_LINGER_MS = 400;
/** Backstop in case the state machine loops instead of settling. */
const RIVE_MAX_MS = 2800;
const RIVE_LOAD_TIMEOUT_MS = 1500;
/** Must match the `.intro-overlay` opacity transition. */
const FADE_MS = 280;

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
  const hasFinished = useRef(false);

  const finish = useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setPhase("leaving");
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const timer = window.setTimeout(() => setPhase("done"), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const showIntro = !reduceMotion && phase !== "done";
  const showWordmark = reduceMotion || phase !== "intro";

  return (
    <>
      {showWordmark ? (
        <img
          className="spacexai-wordmark"
          src="/brand/spacexai/wordmark-white.svg"
          alt="SpaceXAI"
          width={1294}
          height={158}
        />
      ) : null}
      {showIntro ? <IntroOverlay isLeaving={phase === "leaving"} onDone={finish} /> : null}
    </>
  );
}

function IntroOverlay({ isLeaving, onDone }: { isLeaving: boolean; onDone: () => void }) {
  const [isArmed, setIsArmed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsArmed(true), RIVE_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className={`intro-overlay${isLeaving ? " intro-overlay-leaving" : ""}`}
      role="presentation"
    >
      <div className="intro-logo-wrap">{isArmed ? <IntroRive onDone={onDone} /> : null}</div>
    </div>
  );
}

function IntroRive({ onDone }: { onDone: () => void }) {
  const { rive, RiveComponent } = useRive({
    src: RIVE_SRC,
    artboard: RIVE_ARTBOARD,
    stateMachine: RIVE_STATE_MACHINE,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: onDone,
  });

  useEffect(() => {
    const timer = window.setTimeout(onDone, RIVE_MAX_MS);
    return () => window.clearTimeout(timer);
  }, [onDone]);

  useEffect(() => {
    if (rive) return;
    const timer = window.setTimeout(onDone, RIVE_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [rive, onDone]);

  useEffect(() => {
    if (!rive) return;

    let lingerTimer = 0;
    const handleSettled = () => {
      window.clearTimeout(lingerTimer);
      lingerTimer = window.setTimeout(onDone, RIVE_LINGER_MS);
    };

    rive.on(EventType.Pause, handleSettled);
    rive.on(EventType.Stop, handleSettled);

    return () => {
      window.clearTimeout(lingerTimer);
      rive.off(EventType.Pause, handleSettled);
      rive.off(EventType.Stop, handleSettled);
    };
  }, [rive, onDone]);

  return <RiveComponent className="intro-rive" aria-label="SpaceXAI" role="img" />;
}
