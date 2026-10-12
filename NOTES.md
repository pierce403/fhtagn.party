# Cloudflare migration notes

## 2026-10-12 preparation

Prepared from `650650c9c535efb3c834f53886c9eccddd3d0dd9` on
`codex/cloudflare-migration`. Worker `fhtagn-party` serves Next.js static export
from `out`. Consolidated the duplicate Next configs while retaining strict mode.
The existing image cache rules moved to `public/_headers`; all page and challenge
code is unchanged. Extensionless `/filter` and `/secret` work; missing paths stay
404. No server, storage, image optimizer, secret or runtime API is required.

Validation: Node 22 static build (including lint/typecheck), separate typecheck,
Wrangler dry run, 26 local HTTP checks including twenty challenge JPEGs and their
immutable cache header. Browser quiz progressed and wrong answers reset to the
first question; initial page rendered correctly. The reverse-CAPTCHA was not
completed during browser checks. `/secret` was already directly publicly served.

The build retains three existing lint warnings about hook dependencies and plain
img usage; it succeeds. npm audit flags the retained Next.js build dependency;
production contains exported files and no Next server. No broad framework upgrade
was mixed into this migration.

Clean `npm ci --no-audit --no-fund` from the final lockfile succeeded under Node
22.23.3. The final Cloudflare build and Wrangler dry run were repeated after that
install. Existing application dependency versions are preserved except the required
React 19.2.6 adapter peer alignment in OSSTrust and resolved shared transitive tools.

## Deployment contract

Cloudflare native Git builds publish production after an approved push to `main`.
Use Node 22.23.3 (`.nvmrc`), install with `npm ci`, build with
`npm run build:cloudflare`, and deploy with `npx wrangler deploy`. Deployment
credentials stay in Cloudflare. `vercel.json` disables future Vercel Git builds
while the existing deployment remains the recovery source. Do not run a local
production deployment concurrently with native builds. The initial migration commit had no production routes; the migration coordinator
owns DNS, routes and cutover. The later route candidate below remains unpublished.
`/deployment.json` reports `CF_COMMIT_SHA` (or the local Git commit) with `no-store`.
A local build does not establish deployment identity, DNS, TLS or production behavior.
Ignored `.migration/` contains local command logs, HTTP evidence and a screenshot.

## 2026-10-12 route cutover candidate

Prepared `preview_urls: false` and ordinary zone routes for `fhtagn.party/*`.
Routes use `zone_name` and do not create custom-domain DNS. Build and Wrangler
dry run pass. No push, deployment, proxy/DNS change or certificate change was made
for this candidate. The coordinator must finish DNS/TLS readiness and sequence the
production push.
