# Technical guardrails for the UX pass

## Scope: change presentation, preserve systems

The project is Astro with TypeScript, Tailwind and GSAP. Preserve that stack, its dependency lockfile and environment behaviour.

Protected areas include:

- `src/lib/publishing.ts`: authorisation, dates, drafts, pause and fixture rules.
- `src/lib/content-source/`: Airtable adapter, validation, sanitised Markdown, version metadata and source configuration.
- `src/lib/routes.ts`, `src/lib/relations.ts`, `src/lib/sitemap.ts`: central route inventory, relationships, index/pagination behaviour and sitemap membership.
- SEO metadata, canonicals, structured-data escaping and indexation rules.
- Existing route paths, legacy redirects, generated redirect behaviour and response headers.
- Import, confirmation, scheduling and tracking scripts.
- Infrastructure configuration, private metadata isolation and environment variables.
- The corrected placeholder-project guard shared by project routes, route metadata and related links.

Do not bypass a guard, weaken a test or change source selection to obtain a visually convenient result. If a protected change seems necessary, leave it untouched, describe the precise issue and continue other in-scope work.

## Existing placeholder-project correction

The corrected baseline includes `projectsForBuild` in `src/content/projects.ts`. It excludes provisional project records from the public route inventory while retaining the original data for development.

Keep its consistent use in:

- `src/pages/work/[slug].astro`
- `src/lib/routes.ts`
- `src/lib/relations.ts`

Do not restore three orphan placeholder pages or put them back in the sitemap. Do not remove the tests covering this behaviour. Development-only preview remains allowed.

## What may change

Presentation components, layouts, styles, motion, navigation presentation, form presentation, image proportions and responsive behaviour may evolve substantially.

ArticleBody, editorial lists, offer layouts, breadcrumbs and related links may be restyled while retaining their behaviour. Keep one reusable editorial presentation system. Do not hand-compose each article or create a parallel routing system.

The source files mixing layout and behaviour need narrow diffs. A file being visually editable is not permission to remove its loading logic, metadata or route contract.

Keep text, navigation, offers, contact information and reusable claims editable through the existing content layer. Correct relevant existing presentation hardcoding carefully; do not introduce a broad content-model migration.

## Enquiry: preserve what actually exists

The current source is configured with `global.enquiry.mode = "preview"` and an empty `privacyUrl`. It does not establish verified real enquiry delivery.

During this pass:

- Do not activate live sending or change contact details.
- Preserve offer preselection, the unsure path, validations, back navigation and in-flow answer retention.
- Preserve the clearing of incompatible answers when the offer changes.
- Preserve email-only and phone-only entry if supported by the current validated flow.
- Keep dimensions, budget and a complete brief optional as designed.
- Preserve field names, the hidden static form registration and transport contracts.
- Do not add persistent browser storage for personal details.
- Do not show a successful-send state unless a real delivery success is known.
- Test preview flow or isolated mocks using obviously fictitious data; do not submit to a live endpoint or send email/WhatsApp.
- Keep direct-contact alternatives usable; do not trigger them as test messages.

Any requirement for a privacy notice or production form activation is a separate task. Record it, but do not expand this UX pass into legal drafting or service configuration.

## Local work only

No changes to Airtable, Artective, Netlify account settings, remote Git repositories, DNS, domains, mailboxes or credentials. Do not connect a generic account integration for this task. Do not extract credentials from other projects.

Read-only inspection of public reference sites is allowed when tools permit it. Do not copy their assets or branding.

Use existing local assets and dependencies. Do not purchase fonts, add tracking, install new plugins or introduce a new service.

## Safe local checks

Inspect the active checkout and preserve user changes. Do not reset, clean or overwrite unrelated work. Local tests and a development preview are appropriate.

Without Airtable credentials, use the existing development fallback. Keep sample articles isolated from real editorial data. Do not modify the adapter or replace the real source with hard-coded content.

Keep secrets out of logs, screenshots and handoff documents. If the local environment already contains real credentials, do not use them for this visual task; prefer a session-scoped development-only configuration without editing the user's saved settings.

Tests passing are not evidence of visual quality. A development preview is not evidence of live service behaviour. Report those separately.

## Baseline evidence

The preceding local verification reported 89 passing tests, 8 generated HTML pages, 50 output files and 287 valid local references. Those results describe the corrected baseline only.

Re-run relevant local checks after modifications. Do not present earlier results as fresh evidence for the new UX.
