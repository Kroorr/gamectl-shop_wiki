import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { CONTENT_TYPES } from "@/config/navigation";
import { existsSync } from "fs";
import path from "path";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gamectl.shop";

  const staticPaths = ["/", "/about", "/privacy-policy", "/terms-of-service", "/copyright", ...CONTENT_TYPES.map((ct) => `/${ct}`)];

  // Scan actual content files for each locale to avoid 404s
  const contentDir = path.join(process.cwd(), "content");
  const pathsByLocale: Record<string, string[]> = {};

  for (const locale of routing.locales) {
    pathsByLocale[locale] = [];
    for (const ct of CONTENT_TYPES) {
      const localeContentDir = path.join(contentDir, locale, ct);
      if (!existsSync(localeContentDir)) continue;
      const files = await import("fs").then((fs) => fs.readdirSync(localeContentDir));
      for (const file of files) {
        if (file.endsWith(".mdx")) {
          const slug = file.replace(".mdx", "");
          // Convert filename to URL-safe slug
          const urlSlug = slug.replace(/[^a-zA-Z0-9\-_]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
          pathsByLocale[locale].push(`/${ct}/${urlSlug}`);
        }
      }
    }
  }

  // Combine static + dynamic paths per locale
  const allUrls: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    const localePrefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    const dynamicPaths = pathsByLocale[locale] || [];
    const allPaths = [...staticPaths, ...dynamicPaths];
    for (const path of allPaths) {
      allUrls.push({
        url: `${siteUrl}${localePrefix}${path === "/" ? "" : path}`,
        lastModified: new Date(),
        changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
        priority: path === "/" ? 1 : 0.6,
      });
    }
  }

  return allUrls;
}
