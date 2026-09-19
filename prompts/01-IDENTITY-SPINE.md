# Impact Murals — Identity Spine Build

Use the official frontend-design skill as the primary design guidance.

Read in full:
- `CLAUDE.md`
- `PRODUCT.md`
- `DESIGN.md`
- `docs/VISUAL-SIGNATURE.md`
- `docs/CONTENT-ARCHITECTURE.md`
- `docs/logo-animation-spec.md`
- `references/DIRECTIONAL-REFERENCES.md`
- `docs/QUALITY-GATES.md`

Inspect the complete repository and all assets before coding.

## Objective
Build the identity spine of the Impact Murals landing page before expanding the entire site.

This pass must establish the visual idea strongly enough that the final website cannot drift into a generic dark agency template.

## Build only
- the V1 navigation using same-page anchors;
- the animated Impact Murals logo;
- the complete typographic hero;
- the primary and secondary CTA treatment;
- the bespoke hero-to-work transition;
- the first project surface using a local placeholder;
- the opening repositioning statement;
- intentional desktop and mobile compositions.

Do not build the remaining landing sections yet.

## Required concept
Use the **Impact Field** system described in `docs/VISUAL-SIGNATURE.md`.

The logo, typography, grid interruption, transition, and first project surface must feel related.
Do not simply add independent animations to an otherwise conventional layout.

## Before implementation
State briefly:
- the exact visual concept;
- the impact origin or axis;
- how the logo motion relates to the hero composition;
- how the hero opens into the first project surface;
- the primary animation library and why;
- how the mobile composition changes rather than merely shrinks.

Then proceed to implementation without waiting for another response.

## Technical requirements
- Astro
- TypeScript
- Tailwind CSS
- React islands only if genuinely required
- one primary animation library only
- local assets only
- content values from `src/data/`
- `prefers-reduced-motion` support
- semantic HTML
- accessible CTA focus states

## Visual requirements
- no dominant hero photograph;
- no centered generic agency composition;
- no card grid;
- no decorative gradient blobs;
- no glassmorphism;
- no random 3D object;
- no repetitive fade-up motion;
- no stock media;
- no invented claims.

## Review protocol
After implementation:
1. Run install, build, and type checks.
2. Open the local preview.
3. Review desktop and mobile.
4. Self-critique the result against Gate 1 in `docs/QUALITY-GATES.md`.
5. Fix all Gate 1 failures before stopping.
6. Report:
   - preview command and URL;
   - files created;
   - animation library used;
   - any placeholders or unresolved decisions;
   - a concise explanation of why the result is specific to Impact Murals.

Stop after the identity spine is complete and reviewed. Do not build the rest of the landing in this pass.
