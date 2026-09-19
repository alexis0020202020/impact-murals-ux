import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * Markdown to safe HTML, at build time only.
 *
 * Imported content is untrusted: it may have been pasted from anywhere. Every
 * body passes through sanitisation, so a batch cannot inject a script, an
 * iframe, an event handler or a javascript: URL into the site.
 */

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface RenderedBody {
  html: string;
  toc: TocEntry[];
  /** Rough reading signal used to decide whether a contents list is worth it. */
  wordCount: number;
}

/** Stable, collision-free heading ids so the contents list can link to them. */
function slugifyHeading(text: string, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) || "section";

  let candidate = base;
  let n = 2;
  while (used.has(candidate)) candidate = `${base}-${n++}`;
  used.add(candidate);
  return candidate;
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2", "h3", "h4", "p", "a", "ul", "ol", "li", "strong", "em", "del",
    "blockquote", "code", "pre", "hr", "br",
    "table", "thead", "tbody", "tr", "th", "td",
    "figure", "figcaption", "img"
  ],
  allowedAttributes: {
    a: ["href", "title"],
    img: ["src", "alt", "title", "loading", "decoding"],
    h2: ["id"],
    h3: ["id"],
    h4: ["id"],
    th: ["scope"]
  },
  // http is deliberately absent: mixed content is not acceptable on an https site.
  allowedSchemes: ["https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["https"] },
  // Relative links and images stay allowed, absolute non-https ones do not.
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href ?? "";
      const isExternal = /^https?:\/\//i.test(href);
      return {
        tagName,
        attribs: isExternal
          ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
          : attribs
      };
    },
    img: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, loading: "lazy", decoding: "async" }
    })
  }
};

export function renderMarkdown(markdown: string): RenderedBody {
  const toc: TocEntry[] = [];
  const usedIds = new Set<string>();

  const renderer = new marked.Renderer();

  // Headings collect the contents list and receive linkable ids.
  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map((t) => ("raw" in t ? t.raw : "")).join("");
    const plain = text.replace(/[*_`[\]]/g, "").trim();

    // The page supplies its own h1. Imported content starts at h2, so a body
    // that begins with "# Title" is demoted rather than producing a second h1.
    const level = Math.max(2, Math.min(4, depth === 1 ? 2 : depth));
    const id = slugifyHeading(plain, usedIds);

    if (level === 2 || level === 3) toc.push({ id, text: plain, level });
    return `<h${level} id="${id}">${plain}</h${level}>\n`;
  };

  const rawHtml = marked.parse(markdown ?? "", { renderer, async: false, gfm: true }) as string;
  const html = sanitizeHtml(rawHtml, SANITIZE_OPTIONS);
  const wordCount = (markdown ?? "").split(/\s+/).filter(Boolean).length;

  return { html, toc, wordCount };
}

/**
 * A contents list only earns its place on a long piece with real structure.
 * Two headings on a short note is noise, not navigation.
 */
export function shouldShowToc(body: RenderedBody): boolean {
  const topLevelSections = body.toc.filter((entry) => entry.level === 2).length;
  return topLevelSections >= 3 && body.wordCount >= 400;
}
