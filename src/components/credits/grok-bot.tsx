"use client";

import { useEffect, useId, useRef, useState } from "react";
import { NOTIF_BLUE } from "@/lib/grok-bot/decor";
import { BotEngine, type BotFrame } from "@/lib/grok-bot/engine";
import { EXPRESSION_BY_ID, type ExpressionId } from "@/lib/grok-bot/expressions";
import { lookTarget, TURN_TIME } from "@/lib/grok-bot/gaze";
import { clamp, easings } from "@/lib/grok-bot/math";
import { DEMI_VIEWBOX as VB, RAYON as R } from "@/lib/grok-bot/repere";
import { COLOR_BY_ID, mixHex, SHAPE_BY_ID, type ColorId, type ShapeId } from "@/lib/grok-bot/skins";
import { STATE_BY_ID, type StateId } from "@/lib/grok-bot/states";

type GrokBotProps = {
  state: StateId;
  shape: ShapeId;
  color: ColorId;
  expression: ExpressionId;
  /** Page background as hex: it fills the eye holes and fades the particles' depth haze. */
  paper: string;
};

/** Hidden tabs suspend rAF; a bounded step keeps the scene from leaping forward on return. */
const MAX_STEP = 0.064;

/**
 * React port of grok-bot-meetup's `BloubBot.vue`, trimmed to what the credits wall uses: a live
 * loop whose gaze follows the pointer. The engine is a pure function of time; this component
 * only owns the clock and the DOM measurements.
 */
export function GrokBot({ state, shape, color, expression, paper }: GrokBotProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const maskId = `bot-mask-${uid}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const clockRef = useRef(0);
  const [engine] = useState(
    () =>
      new BotEngine(
        R,
        state,
        SHAPE_BY_ID.get(shape)?.radii ?? null,
        EXPRESSION_BY_ID.get(expression) ?? null,
      ),
  );
  const [frame, setFrame] = useState<BotFrame>(() => engine.sample(0));
  const ink = COLOR_BY_ID.get(color)?.hex ?? "#0a0a0c";

  useEffect(() => {
    engine.setState(state, clockRef.current);
  }, [engine, state]);

  useEffect(() => {
    engine.setShape(SHAPE_BY_ID.get(shape)?.radii ?? null, clockRef.current);
  }, [engine, shape]);

  useEffect(() => {
    engine.setExpression(EXPRESSION_BY_ID.get(expression) ?? null, clockRef.current);
  }, [engine, expression]);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    let pointer: { x: number; y: number } | null = null;
    let aiming = false;
    let turnSince = 0;

    const onPointerMove = (event: PointerEvent) => {
      // A lifted finger would leave the gaze stuck on the last touched point.
      if (event.pointerType === "touch") return;
      pointer = { x: event.clientX, y: event.clientY };
    };
    const onPointerLeave = () => {
      pointer = null;
    };

    const release = (clock: number) => {
      if (!aiming) return;
      engine.setLook(null, clock, TURN_TIME);
      aiming = false;
    };

    const aim = (clock: number) => {
      // Only rest-face states take a gaze; elsewhere the eye pose is the animation itself.
      if (!STATE_BY_ID.get(engine.state)?.baseFace) {
        release(clock);
        return;
      }
      const box = svgRef.current?.getBoundingClientRect();
      // An empty box would normalise to NaN, and the engine keeps the last target forever.
      if (!box || box.width === 0 || box.height === 0) return;
      if (!aiming) turnSince = clock;
      const halfWidth = Math.max(1, window.innerWidth / 2);
      const halfHeight = Math.max(1, window.innerHeight / 2);
      engine.setLook(
        lookTarget({
          nx: pointer ? clamp((pointer.x - (box.left + box.width / 2)) / halfWidth, -1, 1) : 0,
          ny: pointer ? clamp((pointer.y - (box.top + box.height / 2)) / halfHeight, -1, 1) : 0,
          tour: easings.easeOutQuint(clamp((clock - turnSince) / TURN_TIME)),
          pointer: pointer !== null,
        }),
        clock,
      );
      aiming = true;
    };

    const tick = (ms: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min((ms - last) / 1000, MAX_STEP) : 0;
      last = ms;
      clockRef.current += dt;
      aim(clockRef.current);
      setFrame(engine.sample(clockRef.current));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      release(clockRef.current);
    };
  }, [engine]);

  return (
    <svg
      ref={svgRef}
      viewBox={`${-VB} ${-VB} ${VB * 2} ${VB * 2}`}
      role="img"
      aria-label="Grok Bot animado"
    >
      <defs>
        {/* The eyes are holes cut into the body, so they clip against the outline on their own. */}
        <mask id={maskId} maskUnits="userSpaceOnUse" x={-VB} y={-VB} width={VB * 2} height={VB * 2}>
          <path d={frame.bodyPath} fill="#fff" />
          {frame.eyes.map((eye, i) => (
            <path key={i} d={eye.d} transform={eye.matrix} opacity={eye.alpha} fill="#000" />
          ))}
          {frame.notch ? (
            <circle cx={frame.notch.x} cy={frame.notch.y} r={frame.notch.r} fill="#000" />
          ) : null}
        </mask>

        {frame.arcs.map((arc) => (
          <linearGradient
            key={arc.id}
            id={`${uid}-${arc.id}`}
            gradientUnits="userSpaceOnUse"
            x1={arc.grad.x1}
            y1={arc.grad.y1}
            x2={arc.grad.x2}
            y2={arc.grad.y2}
          >
            {arc.grad.stops.map((stop, i) => (
              <stop key={i} offset={i / (arc.grad.stops.length - 1)} stopColor={stop} />
            ))}
          </linearGradient>
        ))}
      </defs>

      {/* Back half of the rings: drawn before the body, which hides it. */}
      <g fill="none" strokeLinecap="round">
        {frame.arcs.map((arc) => (
          <path
            key={`b${arc.id}`}
            d={arc.back}
            stroke={`url(#${uid}-${arc.id})`}
            strokeWidth={arc.width}
            opacity={arc.opacity}
          />
        ))}
      </g>

      {frame.dotsBehind ? <Dots dots={frame.dots} ink={ink} paper={paper} /> : null}

      <g opacity={frame.bodyAlpha}>
        {/* Paper under the body, or whatever is drawn behind it would show through the eyes. */}
        <path d={frame.bodyPath} fill={paper} />
        <g mask={`url(#${maskId})`}>
          <rect x={-VB} y={-VB} width={VB * 2} height={VB * 2} fill={ink} />
        </g>
      </g>

      {frame.dotsBehind ? null : <Dots dots={frame.dots} ink={ink} paper={paper} />}

      {frame.notif ? (
        <circle cx={frame.notif.x} cy={frame.notif.y} r={frame.notif.r} fill={NOTIF_BLUE} />
      ) : null}

      <g fill="none" strokeLinecap="round">
        {frame.arcs.map((arc) => (
          <path
            key={`f${arc.id}`}
            d={arc.front}
            stroke={`url(#${uid}-${arc.id})`}
            strokeWidth={arc.width}
            opacity={arc.opacity}
          />
        ))}
      </g>
    </svg>
  );
}

function Dots({ dots, ink, paper }: { dots: BotFrame["dots"]; ink: string; paper: string }) {
  return (
    <g>
      {dots.map((dot, i) => {
        const fill = dot.color ?? (dot.depth === undefined ? ink : mixHex(paper, ink, dot.depth));
        return dot.d ? (
          <path
            key={i}
            d={dot.d}
            fill={fill}
            opacity={dot.opacity}
            transform={`translate(${dot.x} ${dot.y}) rotate(${dot.rot ?? 0}) scale(${R})`}
          />
        ) : (
          <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill={fill} opacity={dot.opacity} />
        );
      })}
    </g>
  );
}
