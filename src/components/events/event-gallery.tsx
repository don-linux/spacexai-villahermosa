"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import type { EventFlyer, EventImage } from "@/content/events/types";

export function EventGallery({ flyers, photos }: { flyers: EventFlyer[]; photos: EventImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const total = flyers.length + photos.length;
  const isOpen = active !== null;
  const frame = active === null ? null : frameAt(flyers, photos, active);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setActive(null);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen || dialog.open) return;
    dialog.showModal();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActive((current) => shift(current, 1, total));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActive((current) => shift(current, -1, total));
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, total]);

  const open = (index: number) => setActive(index);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <section className="mt-14">
        <h2 className="text-sm font-medium tracking-wide text-foreground/45 uppercase">Programa</h2>
        <ul className="mt-5 grid gap-8 sm:grid-cols-2">
          {flyers.map((flyer, index) => (
            <li key={flyer.speaker}>
              <figure>
                <button
                  type="button"
                  onClick={() => open(index)}
                  className="block w-full cursor-zoom-in overflow-hidden rounded-2xl border-0 bg-black p-0"
                >
                  <Image
                    src={flyer.src}
                    alt={flyer.alt}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full"
                    style={{ width: "100%", height: "auto" }}
                  />
                </button>
                <figcaption className="mt-3 text-sm">
                  <span className="block text-foreground">{flyer.title}</span>
                  <span className="mt-0.5 block text-foreground/55">{flyer.speaker}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {photos.length > 0 ? (
        <section className="mt-14">
          <h2 className="text-sm font-medium tracking-wide text-foreground/45 uppercase">Fotos</h2>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => open(flyers.length)}
              className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl border-0 bg-black p-0"
            >
              <Image
                src={photos[0].src}
                alt={photos[0].alt}
                fill
                sizes="(min-width: 1152px) 72rem, 100vw"
                className="object-cover"
              />
            </button>
            {photos.length > 1 ? (
              <ul className="mt-2 grid grid-cols-2 gap-2 min-[720px]:[grid-template-columns:repeat(auto-fill,minmax(11rem,1fr))]">
                {photos.slice(1).map((photo, index) => (
                  <li key={photo.src.src} className="min-w-0">
                    <button
                      type="button"
                      onClick={() => open(flyers.length + index + 1)}
                      className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl border-0 bg-black p-0"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 720px) 18rem, 50vw"
                        className="object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ) : null}

      <dialog
        ref={dialogRef}
        className="media-dialog"
        aria-label="Galeria del meetup"
        onClick={onBackdropClick}
      >
        {frame && active !== null ? (
          <div className="rounded-2xl bg-[#0a0a0a] p-3 text-white sm:p-4">
            <div className="relative h-[min(72dvh,860px)]">
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2">
                <GalleryControl onClick={() => setActive((current) => shift(current, -1, total))}>
                  Anterior
                </GalleryControl>
                <GalleryControl onClick={() => setActive((current) => shift(current, 1, total))}>
                  Siguiente
                </GalleryControl>
              </div>
              <p className="text-sm text-white/70">
                {active + 1} de {total}
              </p>
              <GalleryControl onClick={close}>Cerrar</GalleryControl>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

function GalleryControl({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 rounded-full bg-white/10 px-4 text-sm text-white transition-colors hover:bg-white/20"
    >
      {children}
    </button>
  );
}

function frameAt(flyers: EventFlyer[], photos: EventImage[], index: number): EventImage | null {
  if (index < flyers.length) return flyers[index] ?? null;
  return photos[index - flyers.length] ?? null;
}

function shift(current: number | null, delta: number, total: number) {
  if (current === null || total === 0) return current;
  return (current + delta + total) % total;
}

function onBackdropClick(event: MouseEvent<HTMLDialogElement>) {
  if (event.target === event.currentTarget) event.currentTarget.close();
}
