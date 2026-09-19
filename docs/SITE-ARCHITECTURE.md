# Impact Murals: Site Architecture

This document defines the complete structure of the website: what exists, what
each page is responsible for, where content lives, and how a visitor reaches a
conversation about a project.

It assumes the approved Strike Line visual direction. See `docs/VISUAL-SIGNATURE.md`
for the motion and composition language, and `DESIGN.md` for the visual system.

---

## 1. Governing principle

The site is offer-led, not portfolio-led.

A visitor arriving from a cold email has one question: *can this studio understand
my project, decide what the art should be, and actually deliver it?*

Projects are evidence supporting that answer. They are not the answer itself.
This is why the homepage explains the offer and uses work as proof inside that
explanation, rather than presenting a sequence of case studies and leaving the
visitor to infer the offer.

---

## 2. Page map

| Route | Template | Purpose | Status |
| --- | --- | --- | --- |
| `/` | Homepage | Explain the offer, prove it, convert | Built |
| `/work` | Work index | Editorial index of all projects | Built |
| `/work/[slug]` | Project detail | Depth on a single project | Built |
| `/what-we-do` | Overview | Route into the five contexts | Built |
| `/what-we-do/public-art` | Context | Public art and large-scale murals | Built |
| `/what-we-do/brand-retail-environments` | Context | Brand and retail environments | Built |
| `/what-we-do/hospitality-property-destinations` | Context | Hospitality, property, destinations | Built |
| `/what-we-do/art-activations` | Context | Live and temporary art | Built |
| `/what-we-do/workshops-community` | Context | Participatory programmes | Built |
| `/studio` | Studio | Who the studio is and how it works | Built |
| `/discuss-a-project` | Conversion | Enquiry form and contact routes | Built |

All five context pages share one template driven by `src/content/contexts.ts`.
Adding a sixth context means adding one entry to that array. No new page file.

---

## 3. Navigation

### Primary navigation

| Label | Destination |
| --- | --- |
| Work | `/work` |
| What We Do | `/what-we-do` |
| Studio | `/studio` |
| Discuss a Project | `/discuss-a-project` (primary CTA treatment) |

Every primary navigation href resolves to a real route. There are no placeholder
links and no dead anchors.

### Header behaviour

The header is deliberately minimal so it never competes with the hero logo. It
carries the small wordmark on the left (navigational, static, no entrance
animation) and the navigation plus primary CTA on the right. It is sticky, so
`DISCUSS A PROJECT` is reachable from any scroll position on any page.

On mobile the navigation collapses to a toggle, but the primary CTA stays
visible in the bar rather than hiding inside the menu.

### Footer

Two column groups (`Studio`, `Where we work`) plus contact details, defined in
`src/content/navigation.ts`. The footer is the secondary route into the five
context pages, which keeps the primary navigation short.

---

## 4. Homepage narrative

The homepage answers four questions in order, then asks for the conversation.

| # | Section | Question it answers | Responsibility |
| --- | --- | --- | --- |
| 1 | Hero | Who is this and what do they do? | Brand moment. Centered animated logo, Strike Line, broad headline, both CTAs. Establishes the visual system. |
| 2 | Opening visual proof | Is this real? | One large project surface revealed through the aperture. Neutral notation only: context, role, location, one statement. Not a case study. |
| 3 | Where art creates value | Where and why does the studio work? | Three long-form chapters (public art, brand and retail, hospitality and property). Each gives objective, contribution, responsibility, formats, one image. |
| 4 | From direction to delivery | What does the studio take responsibility for? | Five stages as one continuous progression on a single spine, not five cards. Each stage states its output. |
| 5 | What the work can become | What concrete form can the work take? | Editorial capability index. Seven formats. Desktop pairs the list with one shared visual area; mobile is a plain readable sequence. |
| 6 | Built to deliver | Can they actually execute? | Operational confidence: site adaptation, artist coordination, production planning, materials, scheduling, local delivery, single partner. No invented numbers. |
| 7 | Studio and proof | Who am I dealing with? | Concise studio model, three principles, route to `/work`. Collaborator logo area held empty until assets and permission exist. |
| 8 | Final project CTA | How do I start? | Enquiry form, honest about being an interface prototype until connected. |

### Section rules

- Sections 3 and 5 must never collapse into card grids. Section 3 is long-form
  chapters, section 5 is an index.
- Section 4 must read as one progression. If it ever renders as five equal
  blocks, it has failed.
- Section 7 must not become a stack of case studies. It routes to `/work` instead.

---

## 5. Reusable page templates

### Homepage
Composed from section components under `src/components/home/`. Each section
reads its own content file and owns no business copy.

### Work index (`/work`)
Editorial index, not a uniform card grid. Projects alternate presentation weight
and are filterable by context. Filtering is client-side and progressive: with
JavaScript unavailable, all projects remain visible.

### Project detail (`/work/[slug]`)
Progressive template. It renders only the fields a project actually has, so an
early project carrying imagery alone still looks finished. Supported blocks:

- Header: title, context, location, scale, role, period
- Objective
- Creative development
- Site adaptation
- Production and delivery
- Image gallery (varied media roles)
- Next project
- Project CTA

### What We Do overview (`/what-we-do`)
Lists all five contexts with statement and route. Also carries the direction to
delivery progression, so the overview answers both *where* and *what*.

### Context page (`/what-we-do/[slug]`)
One shared template. Sections: lead statement, client objective, how art
contributes, what the studio takes responsibility for, output formats, related
projects (only where they exist), CTA.

### Studio (`/studio`)
Model, three principles, grounding statement, collaborator area, CTA.

### Discuss a Project (`/discuss-a-project`)
Invitation, contact routes, form. Same form component as homepage section 8.

---

## 6. Content model

All editable content lives in `src/content/`. No business copy belongs inside a
layout or animation component.

| File | Owns |
| --- | --- |
| `global.ts` | Studio name, domain, locale, contact details, form mode |
| `navigation.ts` | Primary nav, footer nav, CTA labels |
| `seo.ts` | Defaults plus per-route titles and descriptions |
| `homepage.ts` | All homepage copy, including hero headline line breaks |
| `contexts.ts` | The five contexts, their objective, contribution, responsibility, formats |
| `capabilities.ts` | The seven output formats in the capability index |
| `process.ts` | The five direction to delivery stages |
| `projects.ts` | Project records, media, and lookup helpers |
| `studio.ts` | Studio model, principles, collaborator area |

### Key model shapes

**Context** carries `objective`, `contribution`, `responsibility[]`, `formats[]`,
one `image`, and `featuredOnHomepage`. The three primary commercial contexts are
flagged true and lead the homepage; art activations and workshops are false and
live only under `/what-we-do`.

**Project** separates required neutral fields (title, context, location, scale,
role, period, statement) from optional narrative fields (objective, creative
development, site adaptation, production and delivery). Optional fields are the
mechanism that lets thin early projects coexist with full case studies.

### Truthfulness rules

- No client names, statistics, awards, testimonials, dimensions or dates unless
  confirmed.
- Unconfirmed values are written as visible placeholders (`LOCATION TO BE
  CONFIRMED`), never guessed.
- Collaborator logos appear only where the asset and permission both exist. The
  logo area states that logos do not imply endorsement.
- Role labels are explicit. The site never implies the studio did more than it did.

---

## 7. Image requirements

Current imagery is six labelled placeholder SVGs in `public/assets/projects/`.
They exist so layout decisions are made against varied proportions rather than
three identical rectangles.

| Role | Ratio | Used for |
| --- | --- | --- |
| `environment-panorama` | 1600 x 700 | Wide site context, opening proof |
| `architectural-landscape` | 1600 x 1000 | Building and interior views |
| `portrait-detail` | 900 x 1200 | Vertical detail, brand environments |
| `material-detail` | 1000 x 1000 | Close material and surface texture |
| `production-onsite` | 1500 x 1000 | Work in progress, access equipment |
| `split-sequence` | 1600 x 900 | Before and after, or sequence |

When real photography arrives, replace the files or update the `src` paths in
`projects.ts` and `contexts.ts`. Layout components do not need to change.

Requirements for real assets:

- Exterior work needs at least one wide environment shot showing the artwork in
  its actual setting, at a distance a passer-by would see it from.
- Every project benefits from one production image. It is the single most
  effective proof that the studio executes rather than only designs.
- Detail shots should show the surface and finish, since that is what
  distinguishes a considered artwork from a printed graphic.
- Alt text is required on every image and is authored in the content files.

---

## 8. Conversion paths

The primary action is `DISCUSS A PROJECT`. The secondary is `VIEW SELECTED WORK`.

| Entry point | Path to conversion |
| --- | --- |
| Cold email to `/` | Hero CTA to `#discuss-project` on the same page |
| Any page, any scroll position | Sticky header CTA to `/discuss-a-project` |
| Reading a context page | Context CTA to `/discuss-a-project` |
| Reading a project | Project CTA at the end of the detail page |
| Footer | Contact details and enquiry link |

Every `DISCUSS A PROJECT` reaches a form. The homepage CTA scrolls to section 8;
every other instance routes to `/discuss-a-project`.

The contact framing deliberately welcomes early enquiries. Weak CTA language
(Learn More, Contact Us, Get Started) is not used anywhere.

### Form status

The form is an interface prototype. `global.form.mode` is `ui-only`. The form
displays a visible notice stating it is not connected and directs the visitor to
email instead. It must never appear to submit successfully. Connect a delivery
service and change `mode` before launch.

---

## 9. Future SEO page structure

Not built in this pass. The commercial pillars already have homes under
`/what-we-do/`, which is the correct place for them to grow.

Planned expansion:

- `/what-we-do/[context]` pages become the commercial pillar pages, each
  targeting its own intent and proof set.
- `/locations/[slug]` for genuine location intent (public art Dubai, public art
  UAE), only where the studio has real work or real capability to show.
- `/insights/[slug]` for supporting content: commissioning public art in the UAE,
  planning large-scale murals, exterior mural materials in UAE conditions,
  production timelines and site requirements, artist coordination through
  agencies, public art versus decorative mural work.

Guardrails carried from `docs/SEO-ROADMAP.md`:

- No mass near-duplicate pages and no thin location variants.
- Each commercial page needs a distinct audience, intent, problem, proof set and
  CTA framing.
- Nothing is hidden from users while being exposed to crawlers.
- Case studies and first-hand production expertise support the pillar pages.

---

## 10. Motion budget

The Strike Line language extends across the site through structure, not by
repeating the hero animation.

| Element | Motion |
| --- | --- |
| Hero logo | Strongest. Full strike sequence, once, on the homepage only. |
| Hero to project aperture | Second strongest. Surface opens from the strike line. |
| Section entrances | Quiet. Short settle, no displacement theatre. |
| Strike rules | A single scale from centre, reused as a section divider. |
| Everything else | Static. |

Rules:

- No pinned scrolling, no scroll hijacking.
- No gradients, particles, glassmorphism or generic rounded components.
- Every animation has a reduced-motion path that renders the resting state.
- Content is visible in the DOM before any animation runs, so a failed script
  leaves a readable page.
