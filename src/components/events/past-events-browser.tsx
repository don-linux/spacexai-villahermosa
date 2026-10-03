"use client";

import { useState } from "react";
import { EventCard, type PastEventCardData } from "./event-card";

type View = "grid" | "list";

export function PastEventsBrowser({ events }: { events: PastEventCardData[] }) {
  const [view, setView] = useState<View>("grid");
  const presentation = view === "list" ? "list" : events.length === 1 ? "feature" : "grid";

  return (
    <section>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <header>
          <h1 className="page-title text-4xl md:text-5xl">Eventos pasados</h1>
          <p className="mt-3 max-w-xl text-foreground/60">Fotos y programa de los meetups.</p>
        </header>
        <div
          role="group"
          aria-label="Vista del listado"
          className="inline-flex w-fit rounded-full bg-foreground/[0.06] p-1"
        >
          <ViewButton pressed={view === "grid"} onSelect={() => setView("grid")}>
            Rejilla
          </ViewButton>
          <ViewButton pressed={view === "list"} onSelect={() => setView("list")}>
            Listado
          </ViewButton>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="mt-10 text-foreground/60">Aun no hay meetups en el archivo.</p>
      ) : (
        <ul
          className={
            view === "list"
              ? "mt-8 flex flex-col gap-3"
              : events.length === 1
                ? "mt-8"
                : "mt-8 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(16rem,1fr))]"
          }
        >
          {events.map((event, index) => (
            <li key={event.slug} className="min-w-0">
              <EventCard
                event={event}
                presentation={presentation}
                preload={presentation !== "list" && index === 0}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ViewButton({
  pressed,
  onSelect,
  children,
}: {
  pressed: boolean;
  onSelect: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onSelect}
      className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
        pressed ? "bg-foreground text-background" : "text-foreground/65 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
