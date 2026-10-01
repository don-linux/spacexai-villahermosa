"use client";

import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";
import { HomeIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { EXPRESSIONS, type ExpressionId } from "@/lib/grok-bot/expressions";
import { COLORS, SHAPES, type ColorId, type ShapeId } from "@/lib/grok-bot/skins";
import type { StateId } from "@/lib/grok-bot/states";
import { useResolvedTheme, type ResolvedTheme } from "@/lib/theme";
import { GrokBot } from "./grok-bot";
import { GrokBotWordmark } from "./grok-bot-wordmark";
import styles from "./credits-wall.module.css";

const CITY = "Villahermosa";
const MORPH_MS = 5000;
/** How long the check-in "party" (`swirl`) lasts before the bot settles back to `idle`. */
const PARTY_MS = 1300;

/** Must match `--background` in globals.css: it fills the bot's eye holes. */
const PAPER: Record<ResolvedTheme, string> = { dark: "#0a0a0a", light: "#ffffff" };

const SHAPE_IDS = SHAPES.map((shape) => shape.id);
const EXPRESSION_IDS = EXPRESSIONS.map((expression) => expression.id);
// Black ink vanishes on the dark background and cream on the light one.
const PALETTE: Record<ResolvedTheme, ColorId[]> = {
  dark: COLORS.filter((c) => c.id !== "encre").map((c) => c.id),
  light: COLORS.filter((c) => c.id !== "creme").map((c) => c.id),
};
const FALLBACK_COLOR: Record<ResolvedTheme, ColorId> = { dark: "creme", light: "encre" };

type Look = { shape: ShapeId; color: ColorId; expression: ExpressionId };

function pickOther<T>(list: readonly T[], current: T): T {
  const choices = list.filter((item) => item !== current);
  return choices[Math.floor(Math.random() * choices.length)] ?? list[0];
}

function nextLook(current: Look, theme: ResolvedTheme): Look {
  return {
    shape: pickOther(SHAPE_IDS, current.shape),
    color: pickOther(PALETTE[theme], current.color),
    expression: pickOther(EXPRESSION_IDS, current.expression),
  };
}

const subscribeNothing = () => () => {};

/**
 * The credits wall, ported from grok-bot-meetup's `MeetupWall.vue`. The bot changes shape, colour
 * and eyes every few seconds; "Canjear créditos" slides the copy up and brings in the QR, or a
 * notice when no event is running.
 */
export function CreditsWall({ qrSvg, lumaUrl }: { qrSvg: string | null; lumaUrl: string | null }) {
  const theme = useResolvedTheme();
  // The bot is drawn on the client only: its colour depends on the theme, unknown to the server.
  const mounted = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const [claim, setClaim] = useState(false);
  const [botState, setBotState] = useState<StateId>("idle");
  const [look, setLook] = useState<Look>(() =>
    nextLook({ shape: "cercle", color: "encre", expression: "neutre" }, "dark"),
  );
  const themeRef = useRef(theme);
  const partyRef = useRef(false);
  const morphTimer = useRef(0);
  const partyTimer = useRef(0);
  const viewChanged = useRef(false);
  const backRef = useRef<HTMLButtonElement>(null);
  const claimRef = useRef<HTMLButtonElement>(null);

  const color = PALETTE[theme].includes(look.color) ? look.color : FALLBACK_COLOR[theme];

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Reads only refs, so the interval below never runs a stale copy.
  const reroll = () => setLook((current) => nextLook(current, themeRef.current));

  const restartMorph = () => {
    window.clearInterval(morphTimer.current);
    morphTimer.current = window.setInterval(() => {
      if (!partyRef.current) reroll();
    }, MORPH_MS);
  };

  const party = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.clearTimeout(partyTimer.current);
    partyRef.current = true;
    setBotState("swirl");
    partyTimer.current = window.setTimeout(() => {
      setBotState("idle");
      partyRef.current = false;
    }, PARTY_MS);
  };

  const openClaim = () => {
    if (claim) return;
    viewChanged.current = true;
    setClaim(true);
    party();
    restartMorph();
  };

  const closeClaim = () => {
    if (!claim) return;
    viewChanged.current = true;
    setClaim(false);
    restartMorph();
    if (!partyRef.current) setBotState("idle");
  };

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") closeClaim();
  });

  const handleBotClick = () => {
    if (partyRef.current) return;
    reroll();
    restartMorph();
  };

  // Focus follows the view, once `inert` has moved: the button that leads back is the one shown.
  useEffect(() => {
    if (!viewChanged.current) return;
    (claim ? backRef : claimRef).current?.focus({ preventScroll: true });
  }, [claim]);

  useEffect(() => {
    const timers = { morph: morphTimer, party: partyTimer };
    morphTimer.current = window.setInterval(() => {
      if (!partyRef.current) setLook((current) => nextLook(current, themeRef.current));
    }, MORPH_MS);
    const onKeyDown = (event: KeyboardEvent) => handleKeyDown(event);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearInterval(timers.morph.current);
      window.clearTimeout(timers.party.current);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className={`${styles.wall} ${claim ? styles.claimMode : ""}`}>
      <h1 className="sr-only">Grok Bot · Créditos del meetup {CITY}</h1>

      {/* Always mounted: a transition doesn't play on first style, and unmounting would cut the fade. */}
      <button
        ref={backRef}
        type="button"
        className={`${styles.textLink} ${styles.back}`}
        inert={!claim}
        onClick={closeClaim}
      >
        Volver
      </button>

      <nav aria-label="Enlaces" className={styles.corner}>
        {lumaUrl ? (
          <a
            href={lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Evento en Luma"
            title="Evento en Luma"
            className={styles.cornerLink}
          >
            <img
              src="/brand/luma/luma-logo-white.svg"
              alt=""
              width={724}
              height={264}
              className={`theme-dark-only ${styles.luma}`}
            />
            <img
              src="/brand/luma/luma-logo-black.svg"
              alt=""
              width={724}
              height={264}
              className={`theme-light-only ${styles.luma}`}
            />
          </a>
        ) : null}
        <a
          href="/"
          aria-label="Volver al inicio"
          title="Volver al inicio"
          className={styles.cornerLink}
        >
          <HomeIcon className={styles.home} />
        </a>
      </nav>

      <div className={styles.top}>
        <div className={styles.duo}>
          <div className={styles.anchor}>
            <section className={styles.copy}>
              <GrokBotWordmark className={styles.wordmark} />
              <p className={styles.place}>{claim ? "Créditos del meetup" : `Meetup ${CITY}`}</p>
              <button
                ref={claimRef}
                type="button"
                className={`${styles.textLink} ${styles.claim}`}
                aria-expanded={claim}
                inert={claim}
                onClick={openClaim}
              >
                Canjear créditos
              </button>
            </section>
          </div>

          <aside className={styles.reveal} inert={!claim}>
            {qrSvg ? (
              <div
                className={styles.qr}
                role="img"
                aria-label="Código QR para canjear créditos"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            ) : (
              <p className={styles.noEvent}>
                Actualmente no hay ningún evento en curso. Cuando lo haya, ¡podrás canjear créditos!
              </p>
            )}
          </aside>

          <div className={styles.scene}>
            <div className={styles.avatar} onClick={handleBotClick}>
              {mounted ? (
                <GrokBot
                  state={botState}
                  shape={look.shape}
                  color={color}
                  expression={look.expression}
                  paper={PAPER[theme]}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <footer className={styles.presented}>
        <p className={styles.presentedLabel}>Presentado por</p>
        <img
          src="/brand/spacexai/spacexai-wordmark-white-transparent.svg"
          alt="SpaceXAI"
          width={1294}
          height={158}
          className={`theme-dark-only ${styles.spacexai}`}
        />
        <img
          src="/brand/spacexai/spacexai-wordmark-black-transparent.svg"
          alt="SpaceXAI"
          width={1294}
          height={158}
          className={`theme-light-only ${styles.spacexai}`}
        />
      </footer>

      <div className={styles.themeToggle}>
        <ThemeToggle />
      </div>
    </div>
  );
}
