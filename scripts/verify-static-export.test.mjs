import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import { verifyStaticExport } from "./verify-static-export.mjs";

const ORIGIN = "https://gamectl.shop";

function writeFixture(files) {
  const directory = mkdtempSync(join(tmpdir(), "gamectl-export-"));
  for (const [relativePath, contents] of Object.entries(files)) {
    const filePath = join(directory, relativePath);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, contents);
  }
  return directory;
}

function validFixture(overrides = {}) {
  const urls = [
    `${ORIGIN}/`,
    `${ORIGIN}/guide`,
    `${ORIGIN}/guide/gamectl-beginner-guide`,
    `${ORIGIN}/pt/guide`,
    `${ORIGIN}/es/guide`,
    `${ORIGIN}/id/guide`,
  ];

  return {
    "index.html": '<html><head><link rel="stylesheet" href="/_next/static/css/app.css"></head><body class="bg-background">Home</body></html>',
    "_next/static/css/app.css": ":root{--background:0 0% 98%}.bg-background{background-color:hsl(var(--background))}",
    "404.html": "<html><body>Not found</body></html>",
    "robots.txt": `User-agent: *\nSitemap: ${ORIGIN}/sitemap.xml\n`,
    "sitemap.xml": `<urlset>${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`,
    "guide.html": "<html><body>Guide</body></html>",
    "guide/gamectl-beginner-guide.html": "<html><body>Article</body></html>",
    "pt/guide.html": "<html><body>Guia</body></html>",
    "es/guide/index.html": "<html><body>Guía</body></html>",
    "id/guide.html": "<html><body>Panduan</body></html>",
    ...overrides,
  };
}

test("accepts root, extensionless, nested-index, and localized HTML outputs", () => {
  const directory = writeFixture(validFixture());
  try {
    assert.deepEqual(verifyStaticExport(directory, ORIGIN), {
      sitemapUrlCount: 6,
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("rejects a sitemap URL without corresponding exported HTML", () => {
  const directory = writeFixture(
    validFixture({
      "sitemap.xml": `<urlset>${[
        `${ORIGIN}/`,
        `${ORIGIN}/guide`,
        `${ORIGIN}/guide/gamectl-beginner-guide`,
        `${ORIGIN}/pt/guide`,
        `${ORIGIN}/es/guide`,
        `${ORIGIN}/missing-page`,
      ].map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`,
    }),
  );
  try {
    assert.throws(
      () => verifyStaticExport(directory, ORIGIN),
      /Missing exported HTML for https:\/\/gamectl.shop\/missing-page/,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("rejects generated text assets containing a vercel.app origin", () => {
  const directory = writeFixture(
    validFixture({
      "guide.html": '<link rel="canonical" href="https://gakuran.vercel.app/guide">',
    }),
  );
  try {
    assert.throws(
      () => verifyStaticExport(directory, ORIGIN),
      /vercel\.app reference in guide\.html/,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("rejects an export whose linked stylesheets contain only font declarations", () => {
  const directory = writeFixture(
    validFixture({
      "_next/static/css/app.css":
        '@font-face{font-family:Inter;src:url("/font.woff2") format("woff2")}',
    }),
  );
  try {
    assert.throws(
      () => verifyStaticExport(directory, ORIGIN),
      /Linked stylesheets contain no application style rules/,
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
