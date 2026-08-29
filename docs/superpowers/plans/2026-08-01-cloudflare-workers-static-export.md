# Cloudflare Workers Static Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Export the existing SEO-indexed Next.js site as static files and deploy `out/` to an asset-only Cloudflare Worker from GitHub Actions without changing public URLs.

**Architecture:** Remove request-time locale Middleware and replace it with build-time route entries: unprefixed English routes live under an `(en)` route group, while `/pt`, `/es`, and `/id` continue through the locale segment. Shared page and layout modules prevent content duplication. GitHub Actions runs the only production build, verifies `out/`, and deploys it with Wrangler static assets.

**Tech Stack:** Next.js 15.3.7 App Router, React 18, next-intl 4, MDX, Node.js 24, npm 11, Wrangler 4, GitHub Actions, Cloudflare Workers Static Assets

## Global Constraints

- Preserve the canonical origin `https://muscle-legends.wiki`.
- Preserve every indexed unprefixed English URL and `/pt`, `/es`, `/id` localized URL.
- Use `output: "export"`, `out/`, asset-only Wrangler configuration, and GitHub Actions cloud builds.
- Do not use OpenNext, SSR, ISR, Server Actions, runtime Worker code, Cloudflare Workers Builds, or local production builds.
- Do not commit `out/`, API tokens, account IDs, or `.env` files.
- Do not push `main`, attach the production Worker Route, or trigger deployment without an explicit production-cutover confirmation.

---

## File Structure

### Shared rendering

- Create `src/app/_shared/locale-layout.tsx`: shared `<html>`, providers, header/footer, metadata, and viewport for a supplied locale.
- Create `src/app/_shared/home-page.tsx`: shared home-page rendering and metadata for a supplied locale.
- Create `src/app/_shared/content-page.tsx`: shared listing/article rendering, metadata, and static-param helpers.
- Move `src/app/[locale]/HomePageClient.tsx` to `src/components/home-page-client.tsx`: locale-neutral home client UI.

### English route entries

- Create `src/app/(en)/layout.tsx` and `src/app/(en)/page.tsx`.
- Create English legal pages under `src/app/(en)/about`, `copyright`, `privacy-policy`, and `terms-of-service`.
- Create one optional catch-all entry for each static content prefix:
  - `src/app/(en)/guide/[[...slug]]/page.tsx`
  - `src/app/(en)/controls/[[...slug]]/page.tsx`
  - `src/app/(en)/styles/[[...slug]]/page.tsx`
  - `src/app/(en)/codes/[[...slug]]/page.tsx`
  - `src/app/(en)/customization/[[...slug]]/page.tsx`
  - `src/app/(en)/roleplay/[[...slug]]/page.tsx`
  - `src/app/(en)/trello/[[...slug]]/page.tsx`

Static first segments ensure these routes win over `[locale]`; no request-time rewrite is needed.

### Localized route entries

- Modify `src/app/[locale]/layout.tsx`, `page.tsx`, and `[...slug]/page.tsx` into thin wrappers around shared rendering.
- Keep the existing localized legal-page files.
- Generate only `pt`, `es`, and `id` under `[locale]`; do not emit `/en` pages.

### Deployment and validation

- Modify `next.config.mjs` and `src/components/language-switcher.tsx`.
- Delete `src/middleware.ts` and the redirecting `src/app/page.tsx`.
- Create `scripts/verify-static-export.mjs` and `scripts/verify-static-export.test.mjs`.
- Create `wrangler.jsonc` and `.github/workflows/deploy-workers.yml`.
- Modify `package.json`, `package-lock.json`, and `README.md`.

---

### Task 1: Add static-export artifact verification

**Files:**
- Create: `scripts/verify-static-export.mjs`
- Create: `scripts/verify-static-export.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `verifyStaticExport(outputDirectory: string, canonicalOrigin: string): { sitemapUrlCount: number }`
- CLI: `node scripts/verify-static-export.mjs [output-directory] [canonical-origin]`
- Package script: `npm run verify:export`

- [ ] **Step 1: Write failing verifier tests**

Use `node:test` and temporary fixture directories. Cover:

```js
test("accepts index, extensionless HTML, locale HTML, sitemap and 404 outputs", () => {
  // Fixture includes index.html, guide.html, pt/guide.html, 404.html,
  // robots.txt and sitemap.xml with six canonical URLs.
  assert.deepEqual(verifyStaticExport(fixture, "https://muscle-legends.wiki"), {
    sitemapUrlCount: 6,
  });
});

test("rejects a sitemap URL without a corresponding HTML file", () => {
  assert.throws(
    () => verifyStaticExport(fixture, "https://muscle-legends.wiki"),
    /Missing exported HTML/,
  );
});

test("rejects vercel.app references in generated text assets", () => {
  assert.throws(
    () => verifyStaticExport(fixture, "https://muscle-legends.wiki"),
    /vercel\.app/,
  );
});
```

- [ ] **Step 2: Run the tests and verify failure**

Run: `node --test scripts/verify-static-export.test.mjs`

Expected: FAIL because `scripts/verify-static-export.mjs` does not exist.

- [ ] **Step 3: Implement the verifier**

Implement these exact checks:

- `index.html`, `404.html`, `robots.txt`, and `sitemap.xml` exist.
- `sitemap.xml` contains at least six `<loc>` values.
- Every `<loc>` starts with the supplied canonical origin.
- Each sitemap pathname maps to one of `path.html`, `path/index.html`, or root `index.html`.
- Text-like exported files do not contain `vercel.app`.
- CLI errors print a concise message and exit nonzero.

- [ ] **Step 4: Run the verifier unit tests**

Run: `node --test scripts/verify-static-export.test.mjs`

Expected: all tests PASS.

- [ ] **Step 5: Add package scripts**

Add:

```json
{
  "scripts": {
    "test:export": "node --test scripts/verify-static-export.test.mjs",
    "verify:export": "node scripts/verify-static-export.mjs out https://muscle-legends.wiki"
  }
}
```

- [ ] **Step 6: Commit the independently testable verifier**

```bash
git add package.json scripts/verify-static-export.mjs scripts/verify-static-export.test.mjs
git commit -m "test: verify static export artifacts"
```

### Task 2: Extract locale-neutral page rendering

**Files:**
- Create: `src/app/_shared/locale-layout.tsx`
- Create: `src/app/_shared/home-page.tsx`
- Create: `src/app/_shared/content-page.tsx`
- Move: `src/app/[locale]/HomePageClient.tsx` to `src/components/home-page-client.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/[...slug]/page.tsx`

**Interfaces:**
- `LocaleLayoutShell({ children, locale }): Promise<React.ReactNode>`
- `getLocaleMetadata(locale: Locale): Promise<Metadata>`
- `HomePage({ locale }: { locale: Locale }): Promise<React.ReactNode>`
- `getHomeMetadata(locale: Locale): Promise<Metadata>`
- `ContentPage({ locale, segments }): Promise<React.ReactNode>`
- `getContentPageMetadata(locale: Locale, segments: string[]): Promise<Metadata>`
- `getContentStaticParams(locale: Locale, contentType?: string): Promise<Array<{ slug: string[] }>>`

- [ ] **Step 1: Move the client home component without changing behavior**

Update its imports and all consumers to use:

```ts
import HomePageClient from "@/components/home-page-client";
```

- [ ] **Step 2: Extract the locale layout shell**

Move the body of the current locale layout to `LocaleLayoutShell`. Pass `locale` explicitly, use `getMessages({locale})`, keep the existing providers and JSON-LD, and retain `NEXT_PUBLIC_SITE_URL || "https://muscle-legends.wiki"`.

Make `src/app/[locale]/layout.tsx` a wrapper that:

```ts
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .map((locale) => ({ locale }));
}
```

It validates the locale and delegates to `LocaleLayoutShell`.

- [ ] **Step 3: Extract home rendering and metadata**

Move the current localized home implementation into shared functions that always receive an explicit `Locale`. Preserve article ordering, JSON-LD, metadata, canonical behavior, and all visible content.

Make the localized page unwrap `params.locale`, validate it, and call the shared functions.

- [ ] **Step 4: Extract content listing/article rendering**

Move `NavigationPage`, `DetailPage`, `ArticleCards`, `SmallCard`, metadata generation, and static-param enumeration into `content-page.tsx`. Replace implicit route params with explicit `locale` and `segments` arguments.

For localized routes, static params contain listing pages and all English-source article paths, preserving the existing locale fallback behavior.

- [ ] **Step 5: Make dynamic routes closed over generated params**

Add:

```ts
export const dynamicParams = false;
```

to localized dynamic route wrappers so ungenerated paths become 404 responses.

- [ ] **Step 6: Run type checking**

Run: `npx tsc --noEmit`

Expected: PASS.

- [ ] **Step 7: Commit shared rendering**

```bash
git add src/app/_shared src/app/[locale] src/components/home-page-client.tsx
git commit -m "refactor: share static locale page rendering"
```

### Task 3: Generate the unprefixed English route tree

**Files:**
- Delete: `src/app/page.tsx`
- Create: `src/app/(en)/layout.tsx`
- Create: `src/app/(en)/page.tsx`
- Create: `src/app/(en)/about/page.tsx`
- Create: `src/app/(en)/copyright/page.tsx`
- Create: `src/app/(en)/privacy-policy/page.tsx`
- Create: `src/app/(en)/terms-of-service/page.tsx`
- Create: the seven content entry files listed in File Structure

**Interfaces:**
- Each English route passes `locale="en"` to the shared renderer.
- Each content route passes its literal content type and optional article slug.

- [ ] **Step 1: Create the English layout and homepage wrappers**

`(en)/layout.tsx` calls `LocaleLayoutShell` with `routing.defaultLocale`. `(en)/page.tsx` calls `HomePage` and `getHomeMetadata` with the same locale. No redirect is emitted.

- [ ] **Step 2: Create the four English legal routes**

Move the exact existing English legal content into the new unprefixed route files. Do not change titles or paragraphs.

- [ ] **Step 3: Create a closed optional-catch-all wrapper for every content prefix**

Each wrapper uses this interface, with a literal `CONTENT_TYPE` matching its directory:

```ts
export const dynamicParams = false;

export async function generateStaticParams() {
  return getContentStaticParams("en", CONTENT_TYPE);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  return getContentPageMetadata("en", [CONTENT_TYPE, ...slug]);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  return <ContentPage locale="en" segments={[CONTENT_TYPE, ...slug]} />;
}
```

The seven literal values are `guide`, `controls`, `styles`, `codes`, `customization`, `roleplay`, and `trello`.

- [ ] **Step 4: Run type checking**

Run: `npx tsc --noEmit`

Expected: PASS with no route or type errors.

- [ ] **Step 5: Commit English routes**

```bash
git add 'src/app/(en)' src/app/page.tsx
git commit -m "feat: generate unprefixed English static routes"
```

### Task 4: Enable Next.js static export and remove request-time locale behavior

**Files:**
- Modify: `next.config.mjs`
- Delete: `src/middleware.ts`
- Modify: `src/components/language-switcher.tsx`

**Interfaces:**
- Next build output directory: `out/`
- Locale navigation: deterministic URL navigation only

- [ ] **Step 1: Change Next.js output mode**

Replace:

```js
output: "standalone",
```

with:

```js
output: "export",
```

Keep `images.unoptimized: true` and do not enable `trailingSlash`.

- [ ] **Step 2: Delete Middleware**

Delete `src/middleware.ts`; do not replace it with Worker code, redirects, or rewrites.

- [ ] **Step 3: Remove the unused locale cookie**

Remove only the `document.cookie = ...` statement and its Middleware-specific comment. Keep current path conversion and `router.push()` behavior.

- [ ] **Step 4: Run non-production checks**

Run:

```bash
npx tsc --noEmit
node --test scripts/verify-static-export.test.mjs
```

Expected: both PASS. Do not run `npm run build` locally.

- [ ] **Step 5: Commit static-export compatibility**

```bash
git add next.config.mjs src/components/language-switcher.tsx src/middleware.ts
git commit -m "feat: enable Next.js static export"
```

### Task 5: Configure asset-only Wrangler deployment

**Files:**
- Create: `wrangler.jsonc`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`

**Interfaces:**
- Worker name: `gakuran`
- Production Custom Domain: `muscle-legends.wiki`
- Asset directory: `./out`

- [ ] **Step 1: Add a pinned Wrangler development dependency**

Run: `npm install --save-dev wrangler@^4`

Expected: `package.json` and `package-lock.json` both change.

- [ ] **Step 2: Create the Wrangler configuration**

Use the exact asset-only structure from the approved design:

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
    { "pattern": "muscle-legends.wiki", "custom_domain": true }
  ]
}
```

Do not add `main`, `binding`, `run_worker_first`, or SPA fallback settings.

- [ ] **Step 3: Ignore Wrangler local state**

Add:

```gitignore
.wrangler/
.dev.vars*
```

Keep `out/` ignored.

- [ ] **Step 4: Validate configuration without deploying**

Run: `npx wrangler deploy --dry-run`

Expected: Wrangler accepts the configuration and reports static assets without uploading anything.

- [ ] **Step 5: Commit Wrangler configuration**

```bash
git add wrangler.jsonc package.json package-lock.json .gitignore
git commit -m "build: configure Cloudflare static assets"
```

### Task 6: Add GitHub Actions cloud build and deploy

**Files:**
- Create: `.github/workflows/deploy-workers.yml`
- Modify: `README.md`

**Interfaces:**
- Triggers: push to `main`, manual `workflow_dispatch`
- Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Build variable: `NEXT_PUBLIC_SITE_URL=https://muscle-legends.wiki`

- [ ] **Step 1: Create the workflow**

The workflow must:

```yaml
name: Deploy Cloudflare Worker

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy-cloudflare-production
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run test:export
      - run: npm run build
        env:
          NODE_OPTIONS: --max-old-space-size=4096
          NEXT_PUBLIC_SITE_URL: https://muscle-legends.wiki
      - run: npm run verify:export
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
```

Add only ad-related build variables that are confirmed to be required. Never expose the Cloudflare token to the build step.

- [ ] **Step 2: Document setup and rollback**

Replace the generic deployment README sections with exact instructions for:

- GitHub repository Secrets.
- Cloudflare account ID lookup.
- Token scope.
- Manual workflow dispatch.
- `www` to apex 301 Redirect Rule preserving paths and queries.
- Cloudflare Custom Domain cutover.
- Reverting the deployment commit if cloud validation fails.

- [ ] **Step 3: Validate workflow and repository state**

Run:

```bash
npx tsc --noEmit
node --test scripts/verify-static-export.test.mjs
npx wrangler deploy --dry-run
git diff --check
```

Expected: every command PASS; no credential or `out/` file appears in `git status`.

- [ ] **Step 4: Commit CI configuration**

```bash
git add .github/workflows/deploy-workers.yml README.md
git commit -m "ci: deploy static site to Cloudflare Workers"
```

### Task 7: Cloud validation and production cutover

**Files:**
- No repository files unless cloud build diagnostics require a corrective commit

**Interfaces:**
- Preview: route-free Cloudflare Worker deployment
- Production: `https://muscle-legends.wiki`

- [ ] **Step 1: Configure GitHub Secrets**

In GitHub: Repository → Settings → Secrets and variables → Actions. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

- [ ] **Step 2: Push a non-production branch and verify cloud build**

Do not attach the apex domain yet. Use a route-free preview configuration or preview Worker name and confirm the GitHub-hosted Next.js build produces a valid `out/`.

- [ ] **Step 3: Verify representative preview URLs**

Expected status codes:

```text
/                                      200
/guide                                 200
/guide/gakuran-how-to-play             200
/pt/guide/gakuran-how-to-play          200
/es/guide/gakuran-how-to-play          200
/id/guide/gakuran-how-to-play          200
/robots.txt                            200
/sitemap.xml                           200
/definitely-not-a-real-page            404
```

- [ ] **Step 4: Obtain explicit production-cutover confirmation**

Report cloud build results and the exact Worker Route change. Do not continue until the owner approves attaching `muscle-legends.wiki/*`.

- [ ] **Step 5: Deploy `main` and attach the production custom domain**

Push the approved commit to `main`, let GitHub Actions deploy, and attach `muscle-legends.wiki` as the Worker Custom Domain.

- [ ] **Step 6: Configure permanent redirects**

Create the Cloudflare `www` → apex 301 rule with path/query preservation. Add `/en` compatibility redirects only if historical traffic or Search Console shows `/en` URLs.

- [ ] **Step 7: Run production health checks**

Verify every sitemap URL returns 200, missing routes return 404, `www` has one 301 hop, canonical/hreflang remain correct, and no static asset returns 404.

- [ ] **Step 8: Complete SEO handoff**

Resubmit `https://muscle-legends.wiki/sitemap.xml` in Search Console, monitor Pages/Crawl Stats/Core Web Vitals, and keep the Vercel project available for rollback until Cloudflare remains healthy.
