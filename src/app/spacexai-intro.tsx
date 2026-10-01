"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import { RIVE_ARTBOARD, RIVE_SRC, RIVE_STATE_MACHINE, useRiveSettled } from "@/lib/spacexai-rive";

/** A short beat of dark before the Rive logo starts, so the write-on is not lost to the page load. */
const RIVE_HOLD_MS = 350;
/** How long the finished Rive mark holds still before the full wordmark fades in. */
const RIVE_LINGER_MS = 300;
/** The WASM runtime comes from a CDN; give slow networks a chance before skipping the intro. */
const RIVE_LOAD_TIMEOUT_MS = 4000;
/** Must match the `.intro-rive` opacity transition. */
const CROSSFADE_MS = 700;
/** How long the static wordmark stays on screen before the landing is revealed. */
const WORDMARK_HOLD_MS = 650;
/** Must match the `.intro-screen` opacity transition. */
const EXIT_MS = 700;

type Phase = "intro" | "leaving" | "wordmark" | "exiting";

export function SpaceXAIIntro({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
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
    if (phase === "intro") return;
    if (phase === "leaving") {
      const timer = window.setTimeout(() => setPhase("wordmark"), CROSSFADE_MS);
      return () => window.clearTimeout(timer);
    }
    if (phase === "wordmark") {
      const timer = window.setTimeout(() => {
        setPhase("exiting");
        onReveal();
      }, WORDMARK_HOLD_MS);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(onDone, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [phase, onReveal, onDone]);

  const showRive = isArmed && (phase === "intro" || phase === "leaving");
  const showWordmark = phase !== "intro";

  return (
    <div className={`intro-screen${phase === "exiting" ? " intro-screen-exit" : ""}`} aria-hidden>
      <div className="spacexai-stage">
        {showWordmark ? (
          <img
            className="spacexai-wordmark"
            src="/brand/spacexai/wordmark-white.svg"
            alt=""
            width={1294}
            height={158}
          />
        ) : null}
      </div>
      {showRive ? (
        <div className="intro-rive-layer">
          <IntroRive isLeaving={phase === "leaving"} onDone={finish} />
        </div>
      ) : null}
    </div>
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

  const lingerTimer = useRef(0);
  const settle = useCallback(() => {
    lingerTimer.current = window.setTimeout(onDone, RIVE_LINGER_MS);
  }, [onDone]);
  useEffect(() => () => window.clearTimeout(lingerTimer.current), []);

  useEffect(() => {
    if (rive) return;
    const timer = window.setTimeout(onDone, RIVE_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [rive, onDone]);

  useRiveSettled(rive, settle);

  return <RiveComponent className={`intro-rive${isLeaving ? " intro-rive-leaving" : ""}`} />;
}
