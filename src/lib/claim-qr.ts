import { encode, QrCodeDataType } from "uqr";

/** Quiet zone around the code, in modules; part of the drawing, not a background. */
const MARGIN = 3;
const INK = "#111111";
const MODULE_RADIUS = 0.34;
const RING_RADIUS = 1.15;
const HOLE_RADIUS = 0.55;
const EYE_RADIUS = 0.72;

/** Only a real http(s) URL counts; anything else is treated as missing. */
export function isHttpUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** The credits QR as an SVG string, with grok-bot-meetup's rounded modules and finders. */
export function qrSvg(url: string): string | null {
  const drawn = drawQr(url, { ecc: "L", margin: MARGIN, sharp: false });
  return drawn?.svg ?? null;
}

/**
 * Diameter of the center mark, as a fraction of the module grid.
 * Error correction H recovers about 30% of the codewords; this hole is far smaller.
 */
const MARK_DIAMETER = 0.22;
/** Extra modules cleared past the mark so a rounded module cannot peek past the white disc. */
const MARK_PAD = 0.75;

export type TemplateQr = {
  svg: string;
  /** Center mark width, as a fraction of the SVG viewport. Matches the cleared disc. */
  markSize: number;
};

/**
 * The share-card QR: square modules and square finders, like the Grok Bot team's cards,
 * with a blank center for the mark. Quiet zone is the standard four modules.
 */
const TEMPLATE_MARGIN = 4;

/** A template QR with a blank center for the Grok Bot mark. */
export function templateQrSvg(url: string): TemplateQr | null {
  const drawn = drawQr(url, {
    ecc: "H",
    margin: TEMPLATE_MARGIN,
    sharp: true,
    clearCenter: true,
  });
  if (!drawn) return null;
  return { svg: drawn.svg, markSize: drawn.markSize };
}

function drawQr(
  url: string,
  options: { ecc: "L" | "H"; margin: number; sharp: boolean; clearCenter?: boolean },
): { svg: string; markSize: number } | null {
  const href = url.trim();
  if (!isHttpUrl(href)) return null;
  const { data, size, types } = encode(href, { border: 0, ecc: options.ecc });
  const margin = options.margin;
  const view = size + margin * 2;
  const center = margin + size / 2;
  const clearRadius = options.clearCenter ? (size * MARK_DIAMETER) / 2 + MARK_PAD : 0;
  const pieces = [
    finder(margin, margin, options.sharp),
    finder(margin + size - 7, margin, options.sharp),
    finder(margin, margin + size - 7, options.sharp),
  ];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!data[y][x] || types[y][x] === QrCodeDataType.Position) continue;
      if (clearRadius > 0 && Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) <= clearRadius) {
        continue;
      }
      pieces.push(module(x + margin, y + margin, options.sharp));
    }
  }
  if (clearRadius > 0) {
    pieces.push(`<circle cx="${center}" cy="${center}" r="${clearRadius}" fill="#ffffff"/>`);
  }
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${view} ${view}" fill="${INK}" aria-hidden="true">${pieces.join("")}</svg>`,
    markSize: clearRadius > 0 ? (clearRadius * 2) / view : 0,
  };
}

function module(x: number, y: number, sharp: boolean): string {
  if (sharp) return `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  return `<rect x="${x}" y="${y}" width="1" height="1" rx="${MODULE_RADIUS}" ry="${MODULE_RADIUS}"/>`;
}

function roundedSquare(x: number, y: number, side: number, r: number): string {
  const x1 = x + r;
  const x2 = x + side - r;
  const y2 = y + side - r;
  const xm = x + side;
  const ym = y + side;
  return `M ${x1} ${y} H ${x2} A ${r} ${r} 0 0 1 ${xm} ${y + r} V ${y2} A ${r} ${r} 0 0 1 ${x2} ${ym} H ${x1} A ${r} ${r} 0 0 1 ${x} ${y2} V ${y + r} A ${r} ${r} 0 0 1 ${x1} ${y} Z`;
}

function finder(x: number, y: number, sharp: boolean): string {
  if (sharp) {
    return `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#ffffff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
  }
  const ring = roundedSquare(x, y, 7, RING_RADIUS);
  const hole = roundedSquare(x + 1, y + 1, 5, HOLE_RADIUS);
  return `<path fill-rule="evenodd" d="${ring} ${hole}"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="${EYE_RADIUS}" ry="${EYE_RADIUS}"/>`;
}
