/**
 * The picture the Workshops page's illustrations share: one small abstract
 * artwork (a sun, two hills and a tower) painted as a grid of square tiles,
 * each tile its own hand. It is generated rather than drawn by hand so the
 * hero, the three end-result frames and the session flow always show the same
 * piece, and it is deterministic (a seeded sequence, no randomness) so every
 * build produces the same drawing.
 *
 * It is an illustration, labelled as one wherever it appears. It stands in for
 * a real shared artwork until the studio has one worth showing.
 */

/** The studio's own palette (src/styles/global.css), so the drawing belongs to the site. */
export const palette = {
  sand: "#ddd5c6",
  bright: "#faf8f2",
  signal: "#d94d2b",
  clay: "#b66d51",
  moss: "#66705d",
  ink: "#171613"
} as const;

type Tone = keyof typeof palette;

export interface Mark {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
}

export interface Tile {
  col: number;
  row: number;
  fill: string;
  /** Position in the order the tiles are painted, 0 first. */
  order: number;
  /** A short brush stroke across the tile: the visible sign of a different hand. */
  mark?: Mark;
}

function channel(hex: string, index: number): number {
  return parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16);
}

/** `amount` of `other` mixed into `hex`, as a hex colour. */
function mix(hex: string, other: string, amount: number): string {
  const part = (index: number) =>
    Math.round(channel(hex, index) * (1 - amount) + channel(other, index) * amount)
      .toString(16)
      .padStart(2, "0");
  return `#${part(0)}${part(1)}${part(2)}`;
}

/** A small seeded sequence: the same numbers on every build. */
function sequence(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/** The colour of the picture at (x, y), with x in 0..1.5 and y in 0..1: a warm sky, a sun, three hills, one tower. */
function colourAt(x: number, y: number): { hex: string; hue: Tone } {
  const near = 0.88 + 0.04 * Math.sin(x * 5.2 + 1);
  const mid = 0.74 + 0.07 * Math.sin(x * 4.1 + 2);
  const far = 0.6 + 0.07 * Math.sin(x * 3.1 + 0.4);
  if (y > near) return { hex: palette.ink, hue: "ink" };
  if (y > mid) return { hex: palette.moss, hue: "moss" };
  if (y > far) return { hex: mix(palette.moss, palette.sand, 0.38), hue: "moss" };

  // A tower at the right, with one lit window.
  if (x > 1.2 && x < 1.34 && y > 0.18) {
    return y > 0.27 && y < 0.37
      ? { hex: mix(palette.clay, palette.bright, 0.55), hue: "sand" }
      : { hex: palette.clay, hue: "clay" };
  }

  const sky = mix(mix(palette.bright, palette.sand, Math.min(1, y / 0.5)), palette.clay, Math.max(0, y - 0.4) * 0.8);
  const distance = Math.hypot(x - 0.62, y - 0.44);
  if (distance < 0.34) {
    return distance < 0.13
      ? { hex: mix(palette.signal, palette.bright, 0.22), hue: "signal" }
      : { hex: palette.signal, hue: "signal" };
  }
  if (distance < 0.47) return { hex: mix(sky, palette.signal, 0.24), hue: "sand" };
  return { hex: sky, hue: "sand" };
}

/**
 * The tiles of the piece on a `cols` by `rows` grid (the picture is 3:2, so
 * 12 by 8 and 6 by 4 are both whole).
 */
export function mosaic(cols: number, rows: number, seed = 7): Tile[] {
  const next = sequence(seed);
  const aspect = cols / rows;

  const tiles: Tile[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const { hex, hue } = colourAt(((col + 0.5) / cols) * aspect, (row + 0.5) / rows);
      // Each hand paints a little lighter or darker than the next.
      const shade = (next() - 0.5) * 0.22;
      const fill = shade < 0 ? mix(hex, palette.ink, -shade) : mix(hex, palette.bright, shade);

      let mark: Mark | undefined;
      if (next() < 0.36) {
        const lighter = hue === "ink" || hue === "moss" || hue === "signal" || hue === "clay";
        const slant = next() * 0.5 + 0.2;
        mark = {
          x1: 0.18 + next() * 0.16,
          y1: 0.62 + next() * 0.18,
          x2: 0.66 + next() * 0.16,
          y2: 0.62 + next() * 0.18 - slant * 0.5,
          stroke: lighter ? mix(fill, palette.bright, 0.34) : mix(fill, palette.ink, 0.2)
        };
      }
      tiles.push({ col, row, fill, order: 0, mark });
    }
  }

  // The order the tiles are painted in: a shuffle, so no two neighbours go together.
  const order = tiles.map((_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(next() * (index + 1));
    [order[index], order[swap]] = [order[swap], order[index]];
  }
  order.forEach((tile, position) => {
    tiles[tile].order = position;
  });
  return tiles;
}
