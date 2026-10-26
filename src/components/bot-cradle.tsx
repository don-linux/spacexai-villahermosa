"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { GrokBot } from "@/components/credits/grok-bot";
import type { ExpressionId } from "@/lib/grok-bot/expressions";
import type { ColorId, ShapeId } from "@/lib/grok-bot/skins";
import { usePrefersReducedMotion } from "@/lib/spacexai-rive";
import { useResolvedTheme, type ResolvedTheme } from "@/lib/theme";

const COLORS = ["rose", "orange", "vert", "bleu", "violet"] as const satisfies readonly ColorId[];

/** Shapes the flying end wears, in the order the reference clip cycles them. `cercle` is rest. */
const FLYING_SHAPES = [
  "nuage",
  "squircle",
  "hexagone",
  "triangle",
  "goutte",
  "galet",
  "capsule",
] as const satisfies readonly ShapeId[];

/** The face that crosses the row. A new one takes over on the way back, then transfers. */
const FACES = [
  "heureux",
  "surpris",
  "hilare",
  "blase",
  "colere",
  "excite",
  "curieux",
] as const satisfies readonly ExpressionId[];

const LEFT = 0;
const RIGHT = COLORS.length - 1;

/** Contact to contact. Half of that is the apex. */
const PERIOD = 0.85;
const AMPLITUDE = 34;
/** How long each middle bot holds the face while it walks the row. */
const WAVE_STEP = 0.06;
/**
 * Hand the flyer back to a circle just before the apex. The engine morphs in 0.45s,
 * so the body is round again as it arrives, and the next face has finished arriving too.
 */
const CIRCLE_AT = PERIOD * 0.42;
const MAX_STEP = 0.064;

/** Must match `--background` in globals.css: it fills the bot's eye holes. */
const PAPER: Record<ResolvedTheme, string> = { dark: "#0a0a0a", light: "#ffffff" };

type Look = { shape: ShapeId; expression: ExpressionId };
type End = typeof LEFT | typeof RIGHT;

const REST: Look = { shape: "cercle", expression: "neutre" };

type Wave = {
  middles: number[];
  expression: ExpressionId;
  startedAt: number;
  step: number;
};

function restingLooks(): Look[] {
  return COLORS.map(() => ({ ...REST }));
}

function openingLooks(): Look[] {
  const looks = restingLooks();
  looks[RIGHT] = { shape: FLYING_SHAPES[0], expression: FACES[0] };
  return looks;
}

function copyLooks(looks: Look[]): Look[] {
  return looks.map((look) => ({ ...look }));
}

const subscribeNothing = () => () => {};

/** Side room so a 34° swing stays inside the stage. Pitch is one eighth of the stage. */
const PITCH = "calc(100cqi / 8)";

const stageStyle = { containerType: "inline-size" } as CSSProperties;
const rowStyle = { height: `calc(${PITCH} * 3.7)` } as CSSProperties;
const pendulumStyle = { width: PITCH } as CSSProperties;
const stringStyle = { height: `calc(${PITCH} * 1.8)` } as CSSProperties;
const botStyle = {
  width: `calc(${PITCH} * 1.58)`,
  marginTop: `calc(${PITCH} * -0.29)`,
} as CSSProperties;

/**
 * Newton's cradle for the homepage. One end swings; on impact its face walks the row
 * and stays on the end that flies off. The angle is written on the DOM from one clock
 * so the five bots do not re-render every frame.
 */
export function BotCradle() {
  const theme = useResolvedTheme();
  const reduceMotion = usePrefersReducedMotion();
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const sectionRef = useRef<HTMLElement>(null);
  const pendulums = useRef<Array<HTMLDivElement | null>>([]);
  const [looks, setLooks] = useState<Look[]>(openingLooks);

  useEffect(() => {
    if (!reduceMotion) return;
    setLooks(restingLooks());
    for (const node of pendulums.current) {
      if (node) node.style.transform = "";
    }
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;
    let visible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
      },
      { threshold: 0.2 },
    );
    if (section) observer.observe(section);

    let looksNow = openingLooks();
    setLooks(copyLooks(looksNow));

    let raf = 0;
    let last = 0;
    let clock = 0;
    let flyer: End = RIGHT;
    let launchedAt = 0;
    let shapeBack = false;
    let shapeIndex = 0;
    let faceIndex = 0;
    let wave: Wave | null = null;

    const paint = (angle: number) => {
      // Positive CSS rotation is clockwise, so it carries a hanging bot to the left.
      const sign = flyer === LEFT ? 1 : -1;
      for (let i = 0; i < COLORS.length; i++) {
        const node = pendulums.current[i];
        if (!node) continue;
        const swinging = i === flyer;
        node.style.transform = swinging ? `rotate(${sign * angle}deg)` : "rotate(0deg)";
        node.style.zIndex = swinging ? "1" : "0";
      }
    };

    const tick = (ms: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) {
        last = 0;
        return;
      }
      const dt = last ? Math.min((ms - last) / 1000, MAX_STEP) : 0;
      last = ms;
      if (dt === 0) return;
      clock += dt;

      let dirty = false;
      let t = clock - launchedAt;

      if (t >= PERIOD) {
        const arriver = flyer;
        const leaver: End = arriver === LEFT ? RIGHT : LEFT;
        const carried = looksNow[arriver]?.expression ?? FACES[0];
        const dir = leaver > arriver ? 1 : -1;
        const middles: number[] = [];
        for (let i = arriver + dir; i !== leaver; i += dir) middles.push(i);

        flyer = leaver;
        launchedAt = clock;
        shapeBack = false;
        shapeIndex = (shapeIndex + 1) % FLYING_SHAPES.length;
        looksNow = restingLooks();
        looksNow[leaver] = {
          shape: FLYING_SHAPES[shapeIndex] ?? "cercle",
          expression: carried,
        };
        wave = { middles, expression: carried, startedAt: clock, step: -1 };
        dirty = true;
        t = 0;
      }

      if (wave) {
        const step = Math.floor((clock - wave.startedAt) / WAVE_STEP);
        if (step !== wave.step) {
          const previous = wave.step;
          if (previous >= 0 && previous < wave.middles.length) {
            const index = wave.middles[previous];
            if (index !== undefined) {
              looksNow[index] = { shape: "cercle", expression: "neutre" };
            }
          }
          wave.step = step;
          if (step >= 0 && step < wave.middles.length) {
            const index = wave.middles[step];
            if (index !== undefined) {
              looksNow[index] = { shape: "cercle", expression: wave.expression };
            }
          } else if (step >= wave.middles.length) {
            wave = null;
          }
          dirty = true;
        }
      }

      if (!shapeBack && t >= CIRCLE_AT) {
        shapeBack = true;
        faceIndex = (faceIndex + 1) % FACES.length;
        looksNow[flyer] = {
          shape: "cercle",
          expression: FACES[faceIndex] ?? "neutre",
        };
        dirty = true;
      }

      paint(AMPLITUDE * Math.sin((Math.PI * t) / PERIOD));
      if (dirty) setLooks(copyLooks(looksNow));
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      for (const node of pendulums.current) {
        if (!node) continue;
        node.style.transform = "";
        node.style.zIndex = "";
      }
    };
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="grok-bot-home"
      className="px-5 pt-8 pb-28 md:px-6 md:pt-12"
    >
      <header className="mx-auto max-w-2xl text-center">
        <h2 id="grok-bot-home" className="page-title text-3xl text-foreground md:text-4xl">
          El hogar de los meetups de Grok Bot
        </h2>
        <p className="mt-3 text-base text-pretty text-foreground/60 md:text-lg">
          Aprende las novedades de Grok Bot, en la comunidad de Villahermosa.
        </p>
      </header>
      <div aria-hidden className="mx-auto mt-10 w-full max-w-[44rem] md:mt-14" style={stageStyle}>
        <div className="flex items-start justify-center" style={rowStyle}>
          {COLORS.map((color, index) => {
            const look = looks[index] ?? REST;
            return (
              <div
                key={color}
                ref={(node) => {
                  pendulums.current[index] = node;
                }}
                className="flex origin-top flex-col items-center"
                style={pendulumStyle}
              >
                <div
                  className="w-px bg-[color-mix(in_oklab,var(--foreground)_32%,transparent)]"
                  style={stringStyle}
                />
                <div className="aspect-square [&_svg]:block [&_svg]:h-full [&_svg]:w-full" style={botStyle}>
                  {mounted ? (
                    <GrokBot
                      state="idle"
                      shape={look.shape}
                      color={color}
                      expression={look.expression}
                      paper={PAPER[theme]}
                      trackPointer={false}
                      decorative
                    />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
