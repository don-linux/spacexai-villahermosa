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
  const href = url.trim();
  if (!isHttpUrl(href)) return null;
  const { data, size, types } = encode(href, { border: 0 });
  const view = size + MARGIN * 2;
  const pieces = [
    finder(MARGIN, MARGIN),
    finder(MARGIN + size - 7, MARGIN),
    finder(MARGIN, MARGIN + size - 7),
  ];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!data[y][x] || types[y][x] === QrCodeDataType.Position) continue;
      pieces.push(
        `<rect x="${x + MARGIN}" y="${y + MARGIN}" width="1" height="1" rx="${MODULE_RADIUS}" ry="${MODULE_RADIUS}"/>`,
      );
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${view} ${view}" fill="${INK}" aria-hidden="true">${pieces.join("")}</svg>`;
}

function roundedSquare(x: number, y: number, side: number, r: number): string {
  const x1 = x + r;
  const x2 = x + side - r;
  const y2 = y + side - r;
  const xm = x + side;
  const ym = y + side;
  return `M ${x1} ${y} H ${x2} A ${r} ${r} 0 0 1 ${xm} ${y + r} V ${y2} A ${r} ${r} 0 0 1 ${x2} ${ym} H ${x1} A ${r} ${r} 0 0 1 ${x} ${y2} V ${y + r} A ${r} ${r} 0 0 1 ${x1} ${y} Z`;
}

function finder(x: number, y: number): string {
  const ring = roundedSquare(x, y, 7, RING_RADIUS);
  const hole = roundedSquare(x + 1, y + 1, 5, HOLE_RADIUS);
  return `<path fill-rule="evenodd" d="${ring} ${hole}"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="${EYE_RADIUS}" ry="${EYE_RADIUS}"/>`;
}
