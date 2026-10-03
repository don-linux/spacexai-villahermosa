import type { UpcomingMeetup } from "./types";

/** The single planned meetup. Null until the next one is scheduled. */
export const upcomingMeetup: UpcomingMeetup | null = null;

export function getUpcomingMeetup(slug: string): UpcomingMeetup | undefined {
  if (upcomingMeetup?.slug !== slug) return undefined;
  return upcomingMeetup;
}
