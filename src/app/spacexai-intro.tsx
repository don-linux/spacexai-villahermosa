"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
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
/**
 * Long enough for the `.spacexai-stage` glide and for the hero headline underneath to finish
 * its reveal, so unmounting the overlay is invisible.
 */
const EXIT_MS = 1200;

type Phase = "intro" | "leaving" | "wordmark" | "exiting";

export function SpaceXAIIntro({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [isArmed, setIsArmed] = useState(false);
  const [morph, setMorph] = useState<CSSProperties | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hasFinished = useRef(false);

  const finish = useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    setPhase("leaving");
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      // The Rive file is drawn for a dark background only, so light mode goes straight to the wordmark.
      if (document.documentElement.classList.contains("light")) {
        hasFinished.current = true;
        setPhase("wordmark");
      } else {
        setIsArmed(true);
      }
    }, RIVE_HOLD_MS);
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
        setMorph(morphOnto(stageRef.current, document.querySelector("[data-intro-target]")));
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
  const isExiting = phase === "exiting";

  return (
    <div className={`intro-screen${isExiting ? " intro-screen-exit" : ""}`} aria-hidden>
      <div
        ref={stageRef}
        className={`spacexai-stage${isExiting && !morph ? " spacexai-stage-fade" : ""}`}
        style={morph ?? undefined}
      >
        {showWordmark ? (
          <>
            <img
              className="spacexai-wordmark theme-dark-only"
              src="/brand/spacexai/spacexai-wordmark-white-transparent.svg"
              alt=""
              width={1294}
              height={158}
            />
            <img
              className="spacexai-wordmark theme-light-only"
              src="/brand/spacexai/spacexai-wordmark-black-transparent.svg"
              alt=""
              width={1294}
              height={158}
            />
          </>
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

/** Glides the intro wordmark onto the hero's inline wordmark, which sits at the same aspect ratio. */
function morphOnto(from: Element | null, to: Element | null): CSSProperties | null {
  if (!from || !to) return null;
  const start = from.getBoundingClientRect();
  const end = to.getBoundingClientRect();
  if (!start.width || !end.width) return null;
  return {
    transformOrigin: "0 0",
    transform: `translate(${end.left - start.left}px, ${end.top - start.top}px) scale(${end.width / start.width})`,
  };
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
