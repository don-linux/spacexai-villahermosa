import type { CSSProperties } from "react";
import { ArrowUpRightIcon, ChevronRightIcon } from "./icons";
import { SpaceXAIWordmark } from "./spacexai-wordmark";

function revealDelay(ms: number) {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}

export function Hero() {
  return (
    <section className="relative flex flex-1 flex-col items-center justify-center px-5 pt-16 pb-28 text-center md:pt-20">
      <div className="hero-glow" aria-hidden />

      <a
        href="#"
        className="reveal group inline-flex items-center gap-2.5 rounded-full border border-foreground/10 bg-foreground/[0.04] py-1 pr-3 pl-1 text-[13px] transition-colors hover:border-foreground/20 hover:bg-foreground/[0.07]"
        style={revealDelay(120)}
      >
        <span className="rounded-full bg-foreground/[0.08] px-2 py-0.5 text-[12px] font-medium text-orange-600 dark:text-orange-400">
          Nuevo
        </span>
        <span className="font-medium text-foreground">Primer meetup</span>
        <span className="text-foreground/50">Próximamente</span>
        <ArrowUpRightIcon className="size-3.5 text-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>

      <h1
        className="reveal hero-title mt-8 max-w-5xl font-normal tracking-[-0.035em] text-balance text-foreground"
        style={revealDelay(220)}
      >
        La comunidad de <SpaceXAIWordmark className="hero-wordmark" data-intro-target /> en
        Villahermosa{" "}
        <span className="block">
          está <span className="hero-underline">aquí</span>.
        </span>
      </h1>

      <p
        className="reveal mt-6 max-w-xl text-base text-pretty text-foreground/60 md:text-lg"
        style={revealDelay(320)}
      >
        Meetups, talleres y proyectos para construir con Grok y la API de SpaceXAI, desde Tabasco.
      </p>

      <div
        className="reveal mt-9 flex flex-col items-center gap-3 sm:flex-row"
        style={revealDelay(420)}
      >
        <a href="#" className="pill pill-solid group h-11 gap-1 px-5">
          Únete a la comunidad
          <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </a>
        <a href="#" className="pill pill-soft h-11 px-5">
          Ver eventos
        </a>
      </div>
    </section>
  );
}
