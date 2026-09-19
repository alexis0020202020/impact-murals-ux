import type { ContentRecord } from "./types";

/**
 * TEST FIXTURES ONLY.
 *
 * These exercise the templates, the Markdown renderer, the table and list
 * handling, the table of contents and the relations resolver without needing an
 * Airtable connection. They are excluded from production by the shared
 * publishing gate in `src/lib/publishing.ts`.
 *
 * They contain no client names, no statistics, no prices and no factual claims.
 */

const richBody = `
Intro paragraph explaining what this fixture is for. It exists to prove the
renderer handles ordinary prose without any manual layout.

## A second level heading

Some prose under a section, with a [link to an offer](/what-we-do/public-art)
and a [link to the enquiry](/discuss-a-project).

- A bullet list item
- Another item, with **bold** and *italic*
- A third item

### A third level heading

1. An ordered item
2. A second ordered item

| Column A | Column B |
| --- | --- |
| Value one | Value two |
| Value three | Value four |

> A block quote, to confirm quotes are styled rather than left bare.

## A third section

This section exists so the fixture crosses the threshold at which a contents
list becomes worth rendering, which is three top level sections and roughly
four hundred words. Without it the contents branch would never be exercised in
a test, and an untested branch is a branch that breaks quietly in production.
Padding this section with ordinary prose is enough, because the rule counts
words rather than judging meaning. The words themselves carry no claim about
the studio, no client name and no measurement of any kind, which is the whole
point of a fixture. It only has to be long enough and structured enough to
prove that the renderer, the heading identifiers and the anchor links all
behave. Everything that follows in this paragraph is simply more of the same
neutral filler so the count is comfortably past the threshold rather than
sitting exactly on it, because a test that only just passes tends to start
failing the moment anything nearby changes by a word or two.

## Sanitisation check

The next line contains markup that must never survive into the page. If a
script tag, an iframe or an inline event handler appears in the rendered
output, sanitisation has failed and imported content can attack a visitor.

<script>window.__fixtureXssMarker = true;</script>
<iframe src="https://example.invalid"></iframe>
<img src="x" onerror="window.__fixtureXssMarker = true">
<a href="javascript:window.__fixtureXssMarker = true">a dangerous link</a>

## Closing section

A final paragraph so the table of contents has enough sections to be worth
rendering. The remaining sentences exist only to carry the word count past the
threshold that the contents rule applies, so that this fixture exercises the
branch where a contents list is shown rather than the branch where it is
suppressed. Both branches matter, and the suppressed branch is already covered
by the shorter guide fixture, which has two sections and a few dozen words.
Keeping one fixture on each side of the threshold means a change to the rule
shows up immediately in a test rather than months later on a real article. None
of this prose describes the studio, quotes a price, names a client or claims a
result, because a fixture that contained any of those things could be mistaken
for real content if it ever escaped into a production build. It is deliberately
dull, deliberately neutral and deliberately long enough to do its one job.
`.trim();

export const fixtureRecords: ContentRecord[] = [
  {
    id: "fixture-insight-001",
    type: "insight",
    slug: "template-test-article",
    title: "TEST FIXTURE: article template",
    description:
      "Test fixture validating the article template, Markdown rendering, table of contents, metadata and relations. Not commercial content.",
    offer: "public-art",
    topics: ["murals", "production"],
    status: "draft",
    publishAt: "2099-01-01",
    author: "Studio (test fixture)",
    body: richBody,
    image: {
      src: "/assets/projects/production-onsite.svg",
      alt: "Placeholder image used by the article template test fixture",
      caption: "Placeholder caption, supplied rather than invented."
    },
    isTestFixture: true
  },
  {
    id: "fixture-guide-001",
    type: "guide",
    slug: "template-test-specialised-page",
    title: "TEST FIXTURE: specialised page template",
    description:
      "Test fixture validating the specialised page template, its metadata, breadcrumbs and its link into an offer. Not commercial content.",
    offer: "public-art",
    topics: ["murals", "production"],
    status: "draft",
    publishAt: "2099-01-01",
    author: "Studio (test fixture)",
    intent: "Verify that the specialised page template renders and links correctly.",
    body: [
      "## What this fixture proves",
      "",
      "That a specialised page carries its own intent, sections and metadata while still routing the visitor into one of the three offers.",
      "",
      "## Why it must not ship",
      "",
      "It contains no real information. If this page is reachable in production, the shared publishing gate has been broken."
    ].join("\n"),
    image: {
      src: "/assets/projects/environment-panorama.svg",
      alt: "Placeholder image used by the specialised page template test fixture"
    },
    isTestFixture: true
  },
  /**
   * Local stand-in for real Airtable record IM-445, used to visually verify
   * the Airtable-driven article integration (SEO Title fallback, commercial
   * hub linking, shared commercial intro block, explicit graph relations)
   * without live Airtable credentials. Field values mirror IM-445's known
   * state: Hub B01, Global Rank 6, Launch Queue Index 1, not yet approved to
   * publish. `relatedIds` points at the other two fixtures below (IM-445's
   * real primary parent, IM-043, has no local counterpart) purely so the
   * explicit-graph branch in relations.ts has something real to resolve.
   */
  {
    id: "IM-445",
    type: "guide",
    slug: "art-activations-beauty-cosmetics-launch-events-dubai",
    title: "Art Activations for Beauty & Cosmetics Launch Events Dubai",
    seoTitle: "Beauty & Cosmetics Launch Event Art Activations, Dubai",
    description:
      "Test fixture standing in for Airtable record IM-445, validating the SEO title fallback, commercial hub linking and shared commercial intro block. Not commercial content.",
    offer: "art-for-brands",
    topics: ["activations", "events"],
    status: "draft",
    publishAt: "2099-01-01",
    author: "Studio (test fixture)",
    commercialHubCode: "B01",
    globalRank: 6,
    launchQueueIndex: 1,
    relatedIds: ["fixture-insight-001", "fixture-guide-001"],
    finalUrl: "https://impactmurals.ae/guides/art-activations-beauty-cosmetics-launch-events-dubai",
    body: [
      "## What this fixture proves",
      "",
      "That a record carrying a commercial hub code, a global rank and a launch queue index renders through the specialised page template with its own SEO title, the shared commercial intro block above the article body, and explicit graph relations instead of the topic-overlap fallback.",
      "",
      "A [link to the related offer](/what-we-do/art-for-brands) and a [link to the enquiry](/discuss-a-project) confirm internal linking still resolves correctly.",
      "",
      "## Why it must not ship",
      "",
      "It stands in for the real Airtable record IM-445, which is not yet approved to publish. If this page is reachable in a production build, the shared publishing gate has been broken."
    ].join("\n"),
    image: {
      src: "/assets/projects/portrait-detail.svg",
      alt: "Placeholder image used by the IM-445 test fixture"
    },
    isTestFixture: true
  },
  /**
   * Exercises the scheduling path: approved, dated in the future. Must never
   * appear anywhere until that date passes AND a build runs after it.
   */
  {
    id: "fixture-scheduled-001",
    type: "insight",
    slug: "template-test-scheduled",
    title: "TEST FIXTURE: scheduled article",
    description: "Test fixture with a future publish date. Must not appear until its date passes.",
    offer: "art-for-places",
    topics: ["commissioning"],
    status: "published",
    publishAt: "2099-06-01",
    author: "Studio (test fixture)",
    body: "This fixture is dated in the future. Seeing it rendered anywhere is a bug.",
    isTestFixture: true
  }
];
