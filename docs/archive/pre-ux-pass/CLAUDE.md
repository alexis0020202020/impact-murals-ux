# Impact Murals — Project Rules

## Read first
Before making product, design, copy, motion, or architecture decisions, read:
- `PRODUCT.md`
- `DESIGN.md`
- `docs/VISUAL-SIGNATURE.md`
- `docs/CONTENT-ARCHITECTURE.md`
- `docs/SEO-ROADMAP.md`
- `docs/logo-animation-spec.md`
- `references/DIRECTIONAL-REFERENCES.md`
- `docs/QUALITY-GATES.md`
- `docs/COPY-CONSTRAINTS.md`

## Stack
- Astro
- TypeScript
- Tailwind CSS
- React islands only when interaction genuinely requires them
- One primary animation library only

## Core working principle
Do not begin from a template or a component-library aesthetic.
The site must have one coherent, ownable visual system derived from the Impact Murals identity.
At least the hero, logo motion, hero-to-work transition, and featured-project treatment must be bespoke.

## Workflow
- Inspect the current repository before changing anything.
- Use the official frontend-design skill as the primary design guidance.
- Follow the two-stage build workflow in `START-HERE.md`.
- First validate the identity spine before expanding the whole landing.
- Review desktop and mobile together.
- Run build and type checks before declaring completion.
- Keep implementation practical, performant, and maintainable.
- Commit after the identity-spine approval and after the complete V1.

## Truthfulness
- Never invent clients, projects, testimonials, statistics, dimensions, roles, or outcomes.
- Use clearly labelled placeholders when content is missing.
- Do not imply that every featured brand was a direct client.
- Project role labels must be explicit and honest.

## Content editability
- Keep editable text, projects, images, logos, navigation, CTA labels, contact details, and SEO data separate from layout components.
- Routine changes must not require redesigning components.
- Use local assets only.
- Do not hardcode reusable commercial copy inside visual components.

## Design constraints
- No SaaS-style card grids.
- No generic agency template.
- No dominant hero photograph.
- No graffiti clichés, spray-can icons, decorative splashes, neon tech gradients, or unrelated 3D objects.
- No excessive rounded containers, glassmorphism, or repetitive fade-up effects.
- Motion must express impact, surface, scale, reveal, or spatial transition.
- Respect `prefers-reduced-motion`.

## V1 scope
- Homepage landing with same-page navigation anchors
- Typographic hero
- Animated Impact Murals logo
- Bespoke hero-to-project transition
- Three commercial contexts integrated with visual proof
- End-to-end creative and production role
- Selected-work system with varied placeholders
- Operational reassurance
- Studio and social proof
- Final project CTA and form interface
- Responsive implementation
- Editable local content layer
- SEO foundations

## V1 navigation behavior
- `Work` → `#work`
- `What We Do` → `#contexts`
- `Studio` → `#studio`
- `Discuss a Project` → `#discuss-project`

Do not create broken routes for V1. Future dedicated routes are documented separately.

## Out of scope for V1
- CMS
- Mass SEO page generation
- Full blog
- Complex backend
- Production form delivery unless explicitly added after the visual V1
- Production deployment without approval
