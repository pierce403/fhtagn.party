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

## 2026-10-13 dependency remediation candidate

The separate `codex/dependency-alerts` review branch upgrades Next.js to 15.5.27
and its ESLint configuration to 15.5.20. It pins patched transitive packages in
`package-lock.json`, including source-map-js 1.2.2, and uses npm overrides for
postcss 8.5.30 and postcss-selector-parser 7.1.6. The latter crosses a major
version for Tailwind CSS 3.4.7, so the static export build is the compatibility
check. No application routes or Cloudflare deployment configuration were changed.

Validation: clean offline `npm ci` under Node 22.22.1, `npm run
build:cloudflare` with `CF_COMMIT_SHA` set to the reviewed main commit,
`npm run typecheck`, and Wrangler dry run. The build retains the three existing
ESLint warnings. The local checkout omits binary `public/` assets from the
remote repository, so its asset count is not a full deployment parity check.
Production publication and migration sequencing remain with the coordinator.

## 2026-10-14 exact-PR recheck

The published PR head was cloned with all 24 `public/` assets. Under pinned
Node 22.23.3, clean `npm ci`, static `build:cloudflare`, `typecheck`, and Wrangler
deploy dry run passed. The dry run included 57 files. A fresh `npm audit fix`
patched compatible `ajv`, `cross-spawn`, and `yaml` versions in the lockfile;
the remaining eight high npm findings trace to unpatched `braces` in the
Tailwind 3 / lint tool graph. No `--force` migration was used.

The current public `https://fhtagn.party/deployment.json` returned the exact
default-branch revision `3ee8a84b829e97b37289f62c1fe76d4432752156` over
working Cloudflare DNS and TLS. The exact security PR revision still needs a
new production deployment and public revision check after merge.

## 2026-10-24 Next.js and Undici remediation follow-through

PR #20 upgraded Next.js to 15.5.28, pinned Undici 7.30.1 through the npm
override, and merged as `dd1e93f3c9cef454437f056c23041612c89fee08`.
The eight high findings recorded in the 2026-10-14 snapshot are superseded for
this lockfile: a fresh `npm audit` against the merged revision reported zero
known vulnerabilities.

Exact-runtime validation was repeated from a clean locked install with Node
22.23.3 from `.nvmrc` and npm 11.17.0. `npm ci --no-fund`, `npm audit`, `npm run
lint`, `npm run typecheck`, and `npm run check:deploy` all passed. The latter
completed the Next.js static export and Wrangler deploy dry run with 57 asset
files. Lint retained the same three warnings in `pages/filter.tsx` described
above. npm also warned that the install scripts for esbuild and workerd are not
covered by `allowScripts`; the completed build and dry run exercised the
installed toolchain, and this follow-through did not change install policy.

This exact-runtime pass closes a documentation gap in the original PR. Its
earlier local checks began on Node 24.19.0, then lint, typecheck, build, and dry
run were repeated on Node 22.23.0 using an existing install. A clean install was
not demonstrated on that runtime, so the PR body's claim of a clean Node
22.23.0 install was inaccurate. The checks above are the first clean validation
of the merged revision on the repository's pinned Node 22.23.3 runtime.

No production deployment, DNS/TLS change, or public `/deployment.json` revision
check was performed. Cloudflare native Git publication and production revision
verification remain with the migration coordinator.
