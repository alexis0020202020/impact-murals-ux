/**
 * Safe JSON-LD serialisation.
 *
 * JSON.stringify does not escape `<`, so a title containing
 * `</scr`+`ipt>` survives serialisation intact and, once written through
 * set:html, closes the script element and can open an executable one.
 * Astro set:html performs no escaping of its own.
 *
 * Editorial values come from Airtable, which is untrusted input for this
 * purpose. Sanitising the Markdown body does nothing for the metadata, which
 * is a separate injection path.
 *
 * These are ordinary JSON string escapes, so a parser reads the original
 * characters back while the HTML parser never sees a tag boundary.
 */

/**
 * U+2028 and U+2029 are legal inside a JSON string but terminate a line in
 * JavaScript, which breaks any parser treating the block as script.
 * Written as escapes so this source file carries no invisible separators.
 */
const LINE_SEPARATORS = /[\u2028\u2029]/g;

export function toJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    // Compared by code point: `c` is the character itself, not its escape.
    .replace(LINE_SEPARATORS, (c) =>
      c.charCodeAt(0) === 0x2028 ? "\\u2028" : "\\u2029"
    );
}
