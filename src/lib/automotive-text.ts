/**
 * Typographic helper for /automotive paragraphs.
 *
 * A browser may break a line after any hyphen, which splits a name or a
 * compound across two lines ("Coca-" / "Cola Arena", "Rolls-" / "Royce",
 * "hands-" / "on"). `tightRuns` cuts a sentence into runs so a template can set
 * every hyphenated word in a run that never breaks. The words are untouched:
 * the characters, spacing and punctuation of the supplied copy stay exactly as
 * written; only the markup around a compound changes.
 *
 * Headlines do not use it: they are set large and balanced, and a long
 * compound ("PROJECT-DRIVEN.") must stay free to wrap on a narrow phone.
 */
export interface TextRun {
  text: string;
  /** True for a hyphenated word that must not break across lines. */
  tight: boolean;
}

const COMPOUND = /[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+/gu;

export function tightRuns(text: string): TextRun[] {
  const runs: TextRun[] = [];
  let last = 0;
  for (const match of text.matchAll(COMPOUND)) {
    const start = match.index ?? 0;
    if (start > last) runs.push({ text: text.slice(last, start), tight: false });
    runs.push({ text: match[0], tight: true });
    last = start + match[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last), tight: false });
  return runs;
}
