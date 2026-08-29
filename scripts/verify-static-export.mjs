import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const REQUIRED_FILES = ["index.html", "404.html", "robots.txt", "sitemap.xml"];
const TEXT_EXTENSIONS = new Set([".css", ".html", ".js", ".json", ".txt", ".xml"]);

function listFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

function htmlCandidates(outputDirectory, pathname) {
  if (pathname === "/") return [join(outputDirectory, "index.html")];

  const relativePath = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, "");
  return [
    join(outputDirectory, `${relativePath}.html`),
    join(outputDirectory, relativePath, "index.html"),
  ];
}

export function verifyStaticExport(outputDirectory, canonicalOrigin) {
  for (const requiredFile of REQUIRED_FILES) {
    if (!existsSync(join(outputDirectory, requiredFile))) {
      throw new Error(`Missing required export file: ${requiredFile}`);
    }
  }

  const sitemap = readFileSync(join(outputDirectory, "sitemap.xml"), "utf8");
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    match[1].replaceAll("&amp;", "&"),
  );

  if (sitemapUrls.length < 6) {
    throw new Error(`Expected at least 6 sitemap URLs, found ${sitemapUrls.length}`);
  }

  for (const sitemapUrl of sitemapUrls) {
    const url = new URL(sitemapUrl);
    if (url.origin !== canonicalOrigin) {
      throw new Error(`Unexpected sitemap origin: ${sitemapUrl}`);
    }
    if (!htmlCandidates(outputDirectory, url.pathname).some(existsSync)) {
      throw new Error(`Missing exported HTML for ${sitemapUrl}`);
    }
  }

  const indexHtml = readFileSync(join(outputDirectory, "index.html"), "utf8");
  const stylesheetHrefs = [...indexHtml.matchAll(/<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1]);
  const linkedCss = stylesheetHrefs.map((href) => {
    const pathname = new URL(href, canonicalOrigin).pathname.replace(/^\/+/, "");
    const stylesheetPath = join(outputDirectory, pathname);
    if (!existsSync(stylesheetPath)) {
      throw new Error(`Missing linked stylesheet: ${href}`);
    }
    return readFileSync(stylesheetPath, "utf8");
  }).join("\n");
  const applicationCss = linkedCss.replace(/@font-face\s*\{[^}]*\}/gi, "");
  if (!applicationCss.includes("{")) {
    throw new Error("Linked stylesheets contain no application style rules");
  }

  for (const file of listFiles(outputDirectory)) {
    if (!TEXT_EXTENSIONS.has(extname(file))) continue;
    if (readFileSync(file, "utf8").includes("vercel.app")) {
      throw new Error(`Found vercel.app reference in ${relative(outputDirectory, file)}`);
    }
  }

  return { sitemapUrlCount: sitemapUrls.length };
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isCli) {
  const outputDirectory = process.argv[2] ?? "out";
  const canonicalOrigin = process.argv[3] ?? "https://gamectl.shop";
  try {
    const result = verifyStaticExport(outputDirectory, canonicalOrigin);
    console.log(`Static export verified: ${result.sitemapUrlCount} sitemap URLs`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
