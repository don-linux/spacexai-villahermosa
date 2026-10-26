"use client";

import { useEffect, useRef, useState } from "react";

const PLAYLIST_URL = "https://open.spotify.com/playlist/1H7LmDUU8sSoSsy8amnBNY";
const FRAME_ID = "cursor-playlist-frame";
const EMBED_ALLOW =
  "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";

type PlaybackUpdate = {
  data: {
    isPaused: boolean;
  };
};

type EmbedController = {
  play: () => void;
  pause: () => void;
  addListener: (event: "playback_update", callback: (event: PlaybackUpdate) => void) => void;
  removeListener: (event: "playback_update", callback: (event: PlaybackUpdate) => void) => void;
};

type SpotifyIframeApi = {
  createController: (
    element: HTMLElement,
    options: { url: string; width: number; height: number },
    callback: (controller: EmbedController) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
  }
}

let apiPromise: Promise<SpotifyIframeApi> | null = null;
let controllerPromise: Promise<EmbedController> | null = null;

function loadSpotifyApi() {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    window.onSpotifyIframeApiReady = resolve;
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("Spotify embed failed to load"));
    };
    document.body.appendChild(script);
  });

  return apiPromise;
}

/** One hidden player for the life of the page. A later host adopts the iframe if React remounts. */
function ensureController(host: HTMLElement) {
  if (!controllerPromise) {
    controllerPromise = loadSpotifyApi()
      .then(
        (api) =>
          new Promise<EmbedController>((resolve) => {
            api.createController(
              host,
              { url: PLAYLIST_URL, width: 80, height: 80 },
              (controller) => {
                const iframe =
                  host.tagName === "IFRAME" ? host : host.querySelector("iframe");
                const frame = iframe ?? document.querySelector(".cursor-playlist > iframe");
                if (frame instanceof HTMLIFrameElement) {
                  frame.id = FRAME_ID;
                  frame.allow = EMBED_ALLOW;
                  frame.tabIndex = -1;
                  frame.setAttribute("aria-hidden", "true");
                }
                resolve(controller);
              },
            );
          }),
      )
      .catch((error: unknown) => {
        controllerPromise = null;
        throw error;
      });
  }

  return controllerPromise.then((controller) => {
    const iframe = document.getElementById(FRAME_ID);
    if (iframe && host.isConnected && iframe.parentElement !== host) host.appendChild(iframe);
    return controller;
  });
}

export function CursorPlaylist() {
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  const playingRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const host = hostRef.current;
    if (!host) return;

    let alive = true;
    let detach = () => {};

    ensureController(host)
      .then((controller) => {
        if (!alive) return;
        controllerRef.current = controller;
        const onUpdate = (event: PlaybackUpdate) => {
          const next = event.data.isPaused === false;
          playingRef.current = next;
          setPlaying(next);
        };
        controller.addListener("playback_update", onUpdate);
        detach = () => controller.removeListener("playback_update", onUpdate);
        if (pendingPlayRef.current) {
          pendingPlayRef.current = false;
          controller.play();
        }
      })
      .catch(() => {
        pendingPlayRef.current = false;
      });

    return () => {
      alive = false;
      detach();
    };
  }, [armed]);

  const arm = () => setArmed(true);

  const toggle = () => {
    const controller = controllerRef.current;
    if (!controller) {
      pendingPlayRef.current = true;
      setArmed(true);
      return;
    }
    if (playingRef.current) controller.pause();
    else controller.play();
  };

  return (
    <div className={`cursor-playlist${playing ? " is-playing" : ""}`} onPointerEnter={arm} onFocus={arm}>
      <div ref={hostRef} className="cursor-playlist-embed" inert aria-hidden />
      <div className="cursor-playlist-pill">
        <button
          type="button"
          className="cursor-playlist-play"
          aria-pressed={playing}
          aria-label={playing ? "Pausar la playlist oficial de Cursor" : undefined}
          onClick={toggle}
        >
          <span className="cursor-playlist-spin" aria-hidden>
            <img
              src="/brand/cursor/cube-2d-dark.svg"
              alt=""
              width={18}
              height={21}
              className="theme-dark-only"
            />
            <img
              src="/brand/cursor/cube-2d-light.svg"
              alt=""
              width={18}
              height={21}
              className="theme-light-only"
            />
          </span>
          <span className="cursor-playlist-label">
            <span>Escucha la playlist oficial de</span>
            <span className="cursor-playlist-cursor-word">
              <img
                src="/brand/cursor/wordmark-dark.svg"
                alt="Cursor"
                width={89}
                height={15}
                className="theme-dark-only"
              />
              <img
                src="/brand/cursor/wordmark-light.svg"
                alt="Cursor"
                width={89}
                height={15}
                className="theme-light-only"
              />
            </span>
          </span>
        </button>
        <a
          className="cursor-playlist-spotify"
          href={PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir en Spotify"
        >
          <span>en</span>
          <img src="/brand/spotify/wordmark.svg" alt="" width={54} height={15} />
        </a>
      </div>
    </div>
  );
}
