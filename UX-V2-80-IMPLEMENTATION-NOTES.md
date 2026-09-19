# Impact Murals UX/UI V2 — 80% implementation pass

## What this pass changes

- Reframes the site as an artist-led art direction and production studio rather than a service catalogue.
- Keeps the three offers as the primary UX architecture: Art for Brands, Art for Places, Public Art & Large-Scale Murals.
- Makes light/off-white the default canvas; dark sections are deliberate punctuation only.
- Removes the previous card/dashboard grammar from the core pages.
- Rebuilds the homepage as large editorial scenes rather than a sequence of boxed sections.
- Preserves and strengthens the fragmented Impact Murals logo as the main motion signature.
- Adds controlled drifting logo fragments through expressive pages.
- Reworks desktop navigation with What We Do first and a full-width offer reveal.
- Reworks mobile hierarchy so the layout becomes linear without losing the strong logo / typography / fragment language.
- Simplifies point-of-view and collaboration messages instead of turning them into multi-card frameworks.
- Rebuilds What We Do and each offer page around: client situation, artistic role, proof, possibilities, conversation.
- Keeps Work editorial and visual; no mandatory case-study framework.
- Prevents placeholder project data from being presented as completed work in production.
- Reworks Studio to feel more human, author-led and less like another capabilities page.
- Keeps the enquiry flow logic intact while changing its visual framing.
- Keeps Insights / Guides on the scalable automated editorial system.

## Protected architecture

The following core files are byte-for-byte unchanged from the provided corrected source ZIP:

- `src/lib/publishing.ts`
- `src/lib/routes.ts`
- `src/lib/relations.ts`
- `src/lib/sitemap.ts`

The Airtable/content-source implementation, publication rules, redirects, canonical/indexation logic, build configuration, Netlify configuration and external services were not redesigned or replaced.

## Visual direction now implemented

- Clear in purpose.
- Loose in composition.
- Precise in execution.
- Offers structure the journey.
- Artwork / imagery carries the visual proof.
- UI stays restrained.
- Light is the reading environment.
- Dark is a deliberate interruption.
- Fragments create motion and spatial identity.
- Metadata informs; it does not decorate every section.

## Still dependent on final assets

Real project photography will materially increase the perceived quality. Neutral development image fields are used only to design the composition while photography is unavailable.

The Work page uses development fields only outside production. In production, placeholder project records are not presented as completed client projects.

## Build status

A production `dist` has not been generated in this environment because the npm installation is incomplete and the required local build executables are not fully available. No build guard has been disabled to work around that limitation.

The project should be validated with its normal commands once dependencies are available:

```bash
npm ci
npm test
npm run build
```

Then verify:

- homepage desktop + mobile
- What We Do
- one offer page
- Work
- Studio
- Discuss a Project + real submission behavior
- one Insight / Guide
- sitemap / redirects / canonical behavior

No public deployment has been performed.
