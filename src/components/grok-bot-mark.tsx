const MARKS = {
  "01": "/brand/grok-bot/bw/01.svg",
  "06": "/brand/grok-bot/bw/06.svg",
  "07": "/brand/grok-bot/bw/07.svg",
  "08": "/brand/grok-bot/bw/08.svg",
  "09": "/brand/grok-bot/bw/09.svg",
  "10": "/brand/grok-bot/bw/10.svg",
  "11": "/brand/grok-bot/bw/11.svg",
  "12": "/brand/grok-bot/bw/12.svg",
} as const;

export type GrokBotMarkId = keyof typeof MARKS;

/** Silhouettes that are not the circle already used on the template QR. */
export const GROK_BOT_SILHOUETTE_MARKS = [
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
] as const satisfies readonly GrokBotMarkId[];

/** Static black-and-white Grok Bot face. Decorative: the surrounding copy names the section. */
export function GrokBotMark({ id, className }: { id: GrokBotMarkId; className?: string }) {
  return (
    <img
      src={MARKS[id]}
      alt=""
      width={126}
      height={126}
      draggable={false}
      className={className ? `shrink-0 object-contain ${className}` : "shrink-0 object-contain"}
    />
  );
}
