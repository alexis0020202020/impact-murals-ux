# Final Pass: Remaining Tasks

Ordered by commercial and visual importance. Everything below is a concrete
task, not a general observation.

---

## 1. Replace placeholder project content (blocks launch)

All three projects are placeholders. Nothing is invented, but nothing is real.
Edit `src/content/projects.ts` only. No layout component needs to change.

Per project, replace: `title`, `location`, `scale`, `role`, `period`,
`statement`, and the optional narrative fields (`objective`,
`creativeDevelopment`, `siteAdaptation`, `productionDelivery`).

The template renders only the fields a project has, so a thin project is fine.
Priority is one strong flagship project with full narrative, rather than three
thin ones.

## 2. Replace placeholder imagery (blocks launch)

Six labelled placeholder SVGs sit in `public/assets/projects/`. Replace the
files, keeping the same filenames, or update the `src` paths in
`projects.ts` and `contexts.ts`.

Minimum viable set for credibility:
- One wide environment shot per project, taken at the distance a passer-by sees it.
- One on-site production image per project. This is the single most effective
  proof that the studio executes rather than only designs. The homepage
  "Built to deliver" section is built around one.
- One material or finish detail per project.

Alt text is authored in the content files and must be updated with the images.

## 3. Connect the enquiry form (blocks launch)

`src/content/global.ts` has `form.mode: "ui-only"`. The form currently blocks
submission and states plainly that it is not connected.

To activate: connect a delivery service (Netlify Forms is the least work given
the static build), change `mode`, and remove the notice block in
`src/components/ProjectForm.astro`. Do not change `mode` before a real endpoint
exists, or the form will silently swallow enquiries.

## 4. Fill in real contact details (blocks launch)

`src/content/global.ts` contains `REPLACE_WITH_EMAIL`, `REPLACE_WITH_PHONE`,
`REPLACE_WITH_WHATSAPP_LINK`. The footer and form both hide the email link and
show "EMAIL TO BE CONFIRMED" until this is done, so the site currently has no
working contact route.

## 5. Collaborator logos

`studio.collaborators.logos` is an empty array with a visible placeholder note.
Add entries only where both the asset and permission exist. The disclosure line
stating that logos do not imply endorsement must stay.

## 6. Confirm the studio founder narrative

`src/content/studio.ts` `grounding` describes hands-on production background in
general terms. If specifics can be confirmed (years active, scale of work
delivered), this section will carry considerably more weight. Do not add
numbers that cannot be evidenced.

## 7. Licensed display typeface

The display face is Instrument Sans (OFL), used as a temporary stand-in for
Breul Grotesk. When licensed files are available, swap the `@import` and the
`--font-display` value in `src/styles/global.css`. Every component reads the
face through that one variable, so no other file changes.

## 8. Mobile homepage length

The homepage is roughly 18 mobile viewports. The offer justifies the length,
but if the bounce rate proves otherwise, the two longest sections to compress
are the context chapters (about 2,860px) and the capability index (about
2,054px). Do not solve this by deleting offer information.

## 9. Minor: /favicon.ico returns 404

Browsers request `/favicon.ico` automatically even though an SVG icon is
declared in `BaseLayout.astro`. It is harmless and does not affect rendering,
but it produces a console 404. Add a real `.ico` to `public/` to silence it.

## 10. Verify in Safari and on a real phone

The logo previously shipped with conflicting Tailwind sizing utilities
(`h-full` and `h-auto` on the same element). Chrome resolved that via the
intrinsic aspect ratio; other engines can resolve it to zero height and drop
the logo entirely. That is fixed, each caller now constrains one axis only,
but the fix should be confirmed on real Safari and a real device, since it was
never reproducible in the Chrome-based test environment.

## 11. Deferred to production readiness

Not part of this pass: analytics and consent, Search Console, legal and privacy
pages, the final production vector logo, and deployment with the domain switch.
