# Vercel to Cloudflare Workers Static Export Design

## Goal

Move the existing `muscle-legends.wiki` Next.js 15 site from Vercel to Cloudflare Workers Static Assets without changing public URLs, page content, or SEO signals.

The deployment flow remains the one supplied by the site owner:

1. Next.js builds with `output: "export"`.
2. GitHub Actions installs dependencies and builds in the cloud.
3. `next build` writes the static site to `out/`.
4. Wrangler deploys `out/` as an asset-only Worker.
5. A push to `main` triggers later deployments automatically.

This migration does not use OpenNext, SSR, a Worker runtime script, Cloudflare Workers Builds, or a local production build.

## Current State and Constraints

- Framework: Next.js `15.3.7`, App Router, MDX, and `next-intl`.
- Canonical origin: `https://muscle-legends.wiki`.
- English URLs have no locale prefix: `/`, `/guide/...`, `/codes/...`.
- Portuguese, Spanish, and Indonesian URLs retain `/pt`, `/es`, and `/id` prefixes.
- Existing URLs and SEO metadata must remain stable.
- `www.muscle-legends.wiki` permanently redirects to the equivalent `muscle-legends.wiki` URL.
- `out/` remains ignored by Git and is never committed.
- Production builds run in GitHub Actions, not on the user's computer.
- At the time of design review, the current Vercel deployment returns HTTP `402` with `DEPLOYMENT_DISABLED`, so restoring successful HTTP `200` responses is urgent.

## Architecture

### Static application

`next.config.mjs` changes from `output: "standalone"` to `output: "export"`. The existing `images.unoptimized: true` setting remains enabled. The default no-trailing-slash URL policy remains unchanged so indexed URL shapes do not change.

All routes are generated during `next build`. Server Components may continue reading the repository's MDX files during the build, but no request-time Next.js server feature is allowed.

### Internationalized routing

The existing `next-intl` Middleware cannot run in a static export and is removed. Static route entry points must generate the same public URLs that the Middleware currently exposes:

- English: `/`, `/about`, `/guide/...`, and the other unprefixed paths.
- Other languages: `/pt/...`, `/es/...`, and `/id/...`.

English and prefixed locale routes call shared rendering functions/components. Article content and page behavior are not duplicated. `generateStaticParams()` enumerates every content path at build time, and dynamic parameters outside that set are disabled so missing pages become genuine 404 responses.

The language switcher continues to calculate deterministic locale URLs. Its `NEXT_LOCALE` cookie write is removed because no Middleware remains to consume it. Browser-language auto-detection is consequently unavailable in the asset-only design; visitors entering an unprefixed URL receive English and may switch languages explicitly.

The public `/en` prefix is not included in the sitemap or canonical metadata. If historical `/en` requests need compatibility, Cloudflare redirects `/en` to `/` and `/en/*` to the corresponding unprefixed path.

### Static metadata

The build receives:

```text
NEXT_PUBLIC_SITE_URL=https://muscle-legends.wiki
```

Sitemap, robots, canonical, Open Graph, hreflang, and JSON-LD URLs continue using the apex domain. Existing ad identifiers used by Server Components are also provided at build time when required. Values prefixed with `NEXT_PUBLIC_` are compiled into public output and must not be treated as server-side secrets.

## Cloudflare Configuration

`wrangler.jsonc` describes an asset-only Worker and therefore has no `main` field and no asset binding:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "gakuran",
  "compatibility_date": "2026-08-01",
  "assets": {
    "directory": "./out",
    "not_found_handling": "404-page",
    "html_handling": "auto-trailing-slash"
  },
  "routes": [
    {
      "pattern": "muscle-legends.wiki",
      "custom_domain": true
    }
  ]
}
```

`not_found_handling: "404-page"` is mandatory. A single-page-application fallback would return the home page with HTTP 200 for missing article URLs and is unsuitable for this pre-rendered SEO site.

The apex hostname uses a Worker Custom Domain so Cloudflare manages the Worker-backed DNS record directly. No Vercel origin record remains after cutover.

Cloudflare DNS must be authoritative for the `muscle-legends.wiki` zone. A proxied `www` DNS record is retained or created so a Cloudflare Redirect Rule can issue a permanent redirect:

```text
https://www.muscle-legends.wiki/<path>?<query>
→ 301 https://muscle-legends.wiki/<path>?<query>
```

The redirect preserves both path and query string. No content is served independently from `www`.

## GitHub Actions Deployment

`.github/workflows/deploy-workers.yml` runs on pushes to `main` and on manual `workflow_dispatch`.

Its sequence is:

1. Check out the repository.
2. Install Node.js 24 with npm caching.
3. Run `npm ci` using `package-lock.json`.
4. Run `npm run build` with `NODE_OPTIONS=--max-old-space-size=4096`, `NEXT_PUBLIC_SITE_URL`, and the required build-time ad variables.
5. Validate that `out/index.html`, `out/404.html`, `out/robots.txt`, and `out/sitemap.xml` exist.
6. Run the repository-pinned Wrangler deployment through Cloudflare's official Wrangler action.

GitHub repository Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- Any required ad configuration values that the owner chooses not to store as repository variables

The Cloudflare token is used only by the deployment step. It is never passed to `next build` and never stored in the repository.

The token must be scoped to the intended Cloudflare account and `muscle-legends.wiki` zone, with the minimum permissions needed to edit Workers scripts and the Worker route configuration. The account ID must refer to the same account.

## Verification

### Build validation

The CI workflow fails before deployment unless all of the following are true:

- Static export finishes successfully.
- Required root files exist in `out/`.
- The generated sitemap contains more than five URLs.
- Every sitemap URL maps to an exported HTML file under the selected Next.js/Cloudflare HTML handling convention.
- Generated files do not contain `vercel.app` canonical or asset origins.
- The build does not depend on Middleware, request cookies, request headers, Server Actions, ISR, or runtime redirects.

### Preview validation

Before attaching the production hostname, deploy the same asset output to a route-free preview Worker name. Check representative routes for every page class and locale:

- `/`
- `/about`
- One English listing and article
- One listing and article under each of `/pt`, `/es`, and `/id`
- `/robots.txt`
- `/sitemap.xml`
- A nonexistent path that must return 404
- CSS, JavaScript, images, theme switching, navigation, and language switching

### Production validation

Immediately after the production-route deployment:

- The apex homepage and all sitemap URLs return 200.
- `www` returns one 301 hop to the matching apex URL.
- A nonexistent URL returns 404 and the custom 404 page.
- Canonical URLs use `https://muscle-legends.wiki`.
- Locale alternates point to the same paths as before migration.
- No asset requests return 404.
- Google Search Console ownership remains valid and the unchanged sitemap is resubmitted.

## Cutover and Rollback

1. Merge and run the static-export CI without changing the production hostname.
2. Validate the preview Worker.
3. Record the last known Vercel DNS configuration and successful Git commit.
4. Attach `muscle-legends.wiki` as the Worker Custom Domain.
5. Enable and test the `www` redirect.
6. Run the production health checks repeatedly during Cloudflare propagation.

If the Worker fails validation, inspect or detach its custom domain and restore a recorded fallback DNS/origin configuration if required. Code rollback uses a revert commit on `main`, allowing the same GitHub Actions workflow to deploy the last known good static version. The Vercel project is not deleted until the Cloudflare deployment has remained healthy and Search Console shows normal crawling.

## Out of Scope

- SSR, ISR, API routes, Server Actions, or runtime authentication
- OpenNext and `@opennextjs/cloudflare`
- Cloudflare Workers Builds/Git integration
- Page redesign, content edits, or SEO copy changes
- Domain changes
- Committing `out/` or Cloudflare credentials
