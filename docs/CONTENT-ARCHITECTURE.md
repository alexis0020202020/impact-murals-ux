# Content Architecture

## V1 visible navigation
All V1 navigation remains on the homepage to avoid broken placeholder routes.

- `Work` → `#work`
- `What We Do` → `#contexts`
- `Studio` → `#studio`
- `Discuss a Project` → `#discuss-project`

The CTA can later be changed to a dedicated route from `src/data/site.ts` without redesigning the navigation.

## Landing narrative
1. Hero
2. Typographic-to-visual reveal
3. Three contexts demonstrated through work
4. End-to-end creative and production role
5. Two or three deeper featured project stories
6. Operational capability and site reality
7. Studio and collaborator logos
8. Final project CTA and lightweight form interface

## V1 route structure
- `/`

Optional routes should not be generated until content exists and the user requests them.

## Future route structure
- `/work/`
- `/work/[slug]/`
- `/studio/`
- `/discuss-a-project/`
- `/public-art/`
- `/large-scale-murals/`
- `/brand-environments/`
- `/retail-art/`
- `/hospitality-art/`
- `/art-activations/`
- `/place-identity/`
- `/locations/[slug]/`
- `/insights/[slug]/`

Do not expose every future route as a block on the landing page.

## Editable content files
- `src/data/site.ts`
- `src/data/seo.ts`
- `src/data/homepage.ts`
- `src/data/contexts.ts`
- `src/data/capabilities.ts`
- `src/data/projects.ts`
- `src/data/studio.ts`
- `src/data/clients.ts`
- `src/data/contact.ts`

## Media structure
- `public/assets/logo/`
- `public/assets/projects/`
- `public/assets/clients/`
- `public/assets/studio/`
- `public/assets/video/`

## Placeholder media roles
The V1 includes varied local placeholders so layout decisions are not based on three identical rectangles:
- environment panorama;
- architectural landscape;
- portrait detail;
- material square;
- on-site production image;
- split-sequence / diptych.

Do not use stock photography.
Do not invent case-study facts.

## Form status
The V1 form is an interface prototype by default.
It must not pretend to submit successfully unless a real delivery integration is explicitly configured later.
