# Impact Murals — Complete Landing Build

Use the official frontend-design skill as the primary design guidance.

The identity spine has been reviewed. Preserve its approved visual logic.
Do not replace it with a new template or unrelated section system.

Read:
- `CLAUDE.md`
- `PRODUCT.md`
- `DESIGN.md`
- `docs/VISUAL-SIGNATURE.md`
- `docs/CONTENT-ARCHITECTURE.md`
- `docs/SEO-ROADMAP.md`
- `docs/QUALITY-GATES.md`
- all `src/data/` files

## Objective
Expand the approved identity spine into a complete, conversion-focused Impact Murals landing page.

The user has not selected every final project, image, client logo, or sentence yet.
Build a visually distinctive system that remains strong with local placeholders and supports later content replacement without redesigning the page.

## Build requirements
- Preserve the approved hero, logo animation, and hero-to-work transition.
- Build `#contexts` with three project-led chapters:
  1. Public Art & Large-Scale Murals
  2. Brand & Retail Environments
  3. Hospitality, Property & Destinations
- Use varied media roles and ratios rather than three identical image blocks.
- Build the end-to-end role as a continuous narrative, not an icon grid.
- Build `#work` with two or three deeper project-story treatments that are clearly different from the context chapters.
- Include operational reassurance around large-scale delivery.
- Build `#studio` with concise studio positioning and honest network language.
- Add an editable monochrome collaborator-logo area.
- Build `#discuss-project` with the final CTA and a lightweight form interface.
- Clearly label the form as an interface prototype in code; do not fake successful delivery.
- Keep all routine content inside `src/data/`.
- Add a concise root README explaining how to replace text, media, projects, logos, contact data, navigation, and SEO values.
- Add basic SEO foundations, sitemap, robots, canonical support, social metadata, and structured-data scaffolding.
- Design desktop, laptop, tablet, and mobile intentionally.
- Respect reduced-motion preferences.

## Non-negotiable distinctions
- Context chapters answer: “Where and why can Impact Murals intervene?”
- Deeper project stories answer: “How does Impact Murals think, develop, and deliver?”

Do not repeat the same large-image pattern twice.

## Forbidden patterns
- generic centered agency hero;
- service-card grid;
- three equal rounded cards;
- decorative gradient blobs;
- glassmorphism;
- random tech 3D;
- stock images;
- fake statistics;
- invented clients or project claims;
- repetitive fade-up animation;
- masonry portfolio as the main work experience;
- unnecessary backend or CMS;
- multiple animation libraries;
- broken placeholder routes.

## Completion protocol
1. Implement the complete landing.
2. Run install, build, and type checks.
3. Fix all build and runtime errors.
4. Review desktop, laptop, tablet, and mobile widths.
5. Check navigation anchors, CTA behavior, overflow, logo motion, reduced-motion behavior, placeholder loading, and form honesty.
6. Review against Gate 2 in `docs/QUALITY-GATES.md` and fix failures.
7. Report:
   - what is complete;
   - what remains placeholder content;
   - exact preview command;
   - exact files the user edits later;
   - any production integrations intentionally deferred.

Do not stop after planning. Build the complete first pass.
