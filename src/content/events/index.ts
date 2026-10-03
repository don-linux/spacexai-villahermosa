import { grokBotMeetupVillahermosa } from "./2026-10-grok-bot-meetup-villahermosa/event";
import type { PastEvent } from "./types";

/** Newest first. A new meetup is a folder plus one line here. */
export const pastEvents: readonly PastEvent[] = [grokBotMeetupVillahermosa];

const pastEventsBySlug = new Map(pastEvents.map((event) => [event.slug, event]));

export function getPastEvent(slug: string): PastEvent | undefined {
  return pastEventsBySlug.get(slug);
}
