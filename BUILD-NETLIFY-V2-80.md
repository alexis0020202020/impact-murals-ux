# V2-80 — Static Netlify package

The supplied design and copy are unchanged.

The initial build failed its content checks because three placeholder project
pages were generated even though the Work index intentionally hides them in
production. `projectsForBuild` now applies the existing placeholder guard to
page generation, the route registry and related-project links consistently.
The original project data remains available in development.

Verified: 89 tests pass; full Astro check, build and content validation pass;
8 HTML pages, 50 output files and 287 local references checked. Redirect
destinations exist. The private deployment manifest is outside the public output.
Real Netlify HTTP behavior and form delivery have not been tested here.

This static package was built with `CONTENT_SOURCE=fixtures` and
`CONTENT_CONFIRMATION_ENABLED=false`, without Airtable credentials. Editorial
fixtures and placeholder project pages are excluded from production. No Airtable
articles are included, and a manual upload does not activate automated publishing.
Canonical URLs remain `https://impactmurals.ae`, as configured in the source.

For the same offline build, with dependencies installed:

```sh
CONTENT_SOURCE=fixtures CONTENT_CONFIRMATION_ENABLED=false ASTRO_TELEMETRY_DISABLED=1 npm run build
```

Unzip the separate `impact-murals-V2-80-dist.zip` and upload its `dist` folder
to the existing Netlify site. `_headers` and `_redirects` are already included.
Do not replace a live site containing Airtable articles with this package if
those article URLs need to remain available; build with the real content source.
