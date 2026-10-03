import type { StaticImageData } from "next/image";

export type EventImage = {
  src: StaticImageData;
  alt: string;
};

export type EventFlyer = EventImage & {
  title: string;
  speaker: string;
};

export type PastEvent = {
  slug: string;
  title: string;
  /** Visible date line, as it should read on the page. */
  date: string;
  city: string;
  venue: string;
  summary: string;
  lumaUrl?: string;
  cover: EventImage;
  flyers: EventFlyer[];
  /**
   * First photo is the wide tile at the top of the mosaic.
   * An empty list means the gallery has not arrived yet.
   */
  photos: EventImage[];
};

/** A planned meetup. Same card as a past event, without the photo gallery. */
export type UpcomingMeetup = Omit<PastEvent, "photos" | "lumaUrl"> & {
  lumaUrl: string;
};
