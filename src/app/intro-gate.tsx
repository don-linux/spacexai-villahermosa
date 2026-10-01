"use client";

import { createContext, use, useCallback, useState } from "react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/spacexai-rive";
import { SpaceXAIIntro } from "./spacexai-intro";

type Stage = "intro" | "revealing" | "done";

const RevealedContext = createContext(true);

/** True once the intro has handed off and the landing is on screen. */
export function useLandingRevealed() {
  return use(RevealedContext);
}

export function IntroGate({ children }: { children: ReactNode }) {
  const reduceMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState<Stage>("intro");

  const reveal = useCallback(() => setStage("revealing"), []);
  const finish = useCallback(() => setStage("done"), []);

  const revealed = reduceMotion || stage !== "intro";
  const showIntro = !reduceMotion && stage !== "done";
  const dataIntro =
    reduceMotion || stage === "done" ? "done" : stage === "intro" ? "pending" : "revealing";

  return (
    <RevealedContext value={revealed}>
      <div className="flex min-h-dvh flex-1 flex-col" data-intro={dataIntro}>
        {children}
      </div>
      {showIntro ? <SpaceXAIIntro onReveal={reveal} onDone={finish} /> : null}
    </RevealedContext>
  );
}
