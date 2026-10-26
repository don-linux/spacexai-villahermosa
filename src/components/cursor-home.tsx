"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/spacexai-rive";
import { useResolvedTheme, type ResolvedTheme } from "@/lib/theme";

function pause(video: HTMLVideoElement | null) {
  video?.pause();
}

/**
 * Homepage section for Cursor meetups. The wordmark sits in the heading, like the Grok Bot
 * cradle. The official header clip loops on its own while the section is on screen.
 */
export function CursorHome() {
  const theme = useResolvedTheme();
  const reduceMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const darkVideoRef = useRef<HTMLVideoElement>(null);
  const lightVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = clipFor(theme, darkVideoRef.current, lightVideoRef.current);
    const other = clipFor(
      theme === "dark" ? "light" : "dark",
      darkVideoRef.current,
      lightVideoRef.current,
    );
    if (!section || !video) return;

    pause(other);

    if (reduceMotion) {
      pause(video);
      // The clip opens on the cube. Hold that frame instead of leaving an empty box.
      const hold = () => {
        try {
          video.currentTime = 0;
        } catch {
          // Metadata can arrive before a seek is legal.
        }
      };
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) hold();
      else {
        video.addEventListener("loadeddata", hold, { once: true });
        video.load();
      }
      return () => {
        video.removeEventListener("loadeddata", hold);
        pause(video);
      };
    }

    let visible = false;
    let generation = 0;

    const begin = () => {
      if (!visible) return;
      pause(other);
      const generationNow = ++generation;
      // A newer play aborts this promise. That rejection is not a failure of the clip now showing.
      void video.play().catch((error: unknown) => {
        if (generationNow !== generation) return;
        if (error instanceof DOMException && error.name === "AbortError") return;
      });
    };

    const stop = () => {
      generation += 1;
      pause(video);
      pause(other);
    };

    const onVisibility = () => {
      if (document.hidden) {
        pause(video);
        return;
      }
      if (visible) begin();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) begin();
        else stop();
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [reduceMotion, theme]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="cursor-home"
      className="px-5 pt-8 pb-28 md:px-6 md:pt-12"
    >
      <header className="mx-auto max-w-2xl text-center">
        <h2 id="cursor-home" className="page-title text-3xl text-foreground md:text-4xl">
          Le prestamos el teclado a{" "}
          <span className="cursor-home-wordmark">
            <img
              src="/brand/cursor/wordmark-dark.svg"
              alt="Cursor"
              width={1655}
              height={279}
              className="theme-dark-only"
            />
            <img
              src="/brand/cursor/wordmark-light.svg"
              alt="Cursor"
              width={1655}
              height={279}
              className="theme-light-only"
            />
          </span>
        </h2>
        <p className="mt-3 text-base text-pretty text-foreground/60 md:text-lg">
          En Villahermosa, los meetups son espacios abiertos para que tus agentes hagan realidad tus ideas junto con la comunidad.
        </p>
      </header>
      <div aria-hidden className="cursor-home-cube mx-auto mt-10 md:mt-14">
        <video
          ref={darkVideoRef}
          className="theme-dark-only"
          src="/brand/cursor/logo-dark-theme.webm"
          muted
          playsInline
          loop
          preload="none"
        />
        <video
          ref={lightVideoRef}
          className="theme-light-only"
          src="/brand/cursor/logo-light-theme.webm"
          muted
          playsInline
          loop
          preload="none"
        />
      </div>
    </section>
  );
}

function clipFor(
  theme: ResolvedTheme,
  dark: HTMLVideoElement | null,
  light: HTMLVideoElement | null,
) {
  return theme === "light" ? light : dark;
}
