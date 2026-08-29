import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDynamicNavigation, getContent, getAllContent, type ContentItem, type NavGroup, CONTENT_TYPES } from "@/lib/content";
import { WikiSidebar, Breadcrumbs, JsonLd } from "@/components/site";
import { Link } from "@/components/custom-link";
import { routing, type Locale } from "@/i18n/routing";
import { TableOfContents } from "@/components/table-of-contents";
import { SideAdBanner } from "@/components/sidebar-ad-banner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gamectl.shop";

function extractHeadings(headings: { id: string; text: string; level: number }[] | undefined) {
  if (!headings) return [];
  return headings.filter((h) => h.level === 2 || h.level === 3);
}

function localizeHref(href: string, locale: Locale) {
  if (locale === routing.defaultLocale) return href;
  return `/localePrefix` === "always" ? `/localePrefix${href}` : `/${locale}${href}`;
}

export async function getContentPageMetadata(locale: Locale, slug: string[]): Promise<Metadata> {
  setRequestLocale(locale);
  const contentType = slug[0];
  const contentSlug = slug.slice(1);

  if (contentSlug.length === 0) {
    const contentTypeTitle = contentType.charAt(0).toUpperCase() + contentType.slice(1);
    const title = `${contentTypeTitle} — GameCTL Wiki`;
    return {
      title,
      description: `Browse all ${contentTypeTitle.toLowerCase()} guides and resources.`,
      alternates: {
        canonical: locale === routing.defaultLocale ? `/${contentType}` : `/${locale}/${contentType}`,
      },
      openGraph: { title, url: `${siteUrl}/${contentType}` },
    };
  }

  const content = await getContent(contentType, contentSlug, locale);
  if (!content) return { title: "Not Found" };

  return {
    title: `${content.metadata.title} — GameCTL Wiki`,
    description: content.metadata.description,
    alternates: {
      canonical: locale === routing.defaultLocale
        ? `/${contentType}/${contentSlug.join("/")}`
        : `/${locale}/${contentType}/${contentSlug.join("/")}`,
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: `${siteUrl}/${contentType}/${contentSlug.join("/")}`,
    },
  };
}

export async function getContentStaticParams(locale: Locale, contentType?: string) {
  const types = contentType ? [contentType] : CONTENT_TYPES;
  const params: { slug: string[] }[] = [];

  for (const type of types) {
    params.push({ slug: [type] });
    try {
      const items = await getAllContent(type, locale);
      for (const item of items) {
        const segments = item.href.split("/").filter(Boolean);
        params.push({ slug: segments });
      }
    } catch {
      // skip
    }
  }

  return params;
}

export async function ContentPage({ locale, segments }: { locale: Locale; segments: string[] }) {
  setRequestLocale(locale);
  const contentType = segments[0];
  const slug = segments.slice(1);
  const navGroups = getDynamicNavigation(locale);

  // Listing page
  if (slug.length === 0) {
    const items = await getAllContent(contentType, locale);
    const contentTypeTitle = contentType.charAt(0).toUpperCase() + contentType.slice(1);

    const listing = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${contentType} — GameCTL Wiki`,
      description: `All ${contentTypeTitle.toLowerCase()} content.`,
    };

    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <JsonLd data={listing} />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            <Breadcrumbs items={[
              { label: "Home", href: "/" },
              { label: contentTypeTitle },
            ]} />
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">{contentTypeTitle}</h1>
            <p className="mt-2 text-muted-foreground">All {contentTypeTitle.toLowerCase()} content.</p>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {items.map((item) => {
                const itemHref = locale === routing.defaultLocale ? item.href : `/${locale}${item.href}`;
                return (
                  <Link
                    key={item.href}
                    href={itemHref}
                    className="group rounded-xl border border-border/60 bg-card/50 p-5 transition-all hover:border-[hsl(var(--nav-theme))/0.4] hover:shadow-lg"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
                        {item.metadata.category}
                      </Badge>
                      <span>{item.metadata.date}</span>
                    </div>
                    <h2 className="mt-2 font-bold text-foreground group-hover:text-[hsl(var(--nav-theme))]">
                      {item.metadata.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.metadata.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="hidden lg:block">
            <WikiSidebar locale={locale} navGroups={navGroups} currentPath={`/${contentType}`} />
          </div>
        </div>
      </main>
    );
  }

  // Single content page
  const content = await getContent(contentType, slug, locale);
  if (!content) return <div className="py-20 text-center text-muted-foreground">Content not found.</div>;

  const headings = extractHeadings(content.headings);
  const fullHref = `/${contentType}/${slug.join("/")}`;
  const contentHref = locale === routing.defaultLocale ? fullHref : `/${locale}${fullHref}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.metadata.title,
    description: content.metadata.description,
    datePublished: content.metadata.date,
    author: { "@type": "Organization", name: "GameCTL Wiki" },
    publisher: { "@type": "Organization", name: "GameCTL Wiki" },
  };

  const MDXContent = content.MDXContent;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={article} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: contentType.charAt(0).toUpperCase() + contentType.slice(1), href: locale === routing.defaultLocale ? `/${contentType}` : `/${locale}/${contentType}` },
            { label: content.metadata.title },
          ]} />
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">{content.metadata.title}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
              {content.metadata.category}
            </Badge>
            <span>{content.metadata.date}</span>
          </div>
          <Separator className="my-6" />
          <article className="prose prose-invert max-w-none prose-headings:scroll-mt-24">
            <MDXContent />
          </article>
        </div>
        <div className="hidden lg:block space-y-6">
          {headings.length > 0 && <TableOfContents headings={headings} />}
          <SideAdBanner adKey={process.env.NEXT_PUBLIC_AD_KEY_160X600} />
          <WikiSidebar locale={locale} navGroups={navGroups} currentPath={contentHref} />
        </div>
      </div>
    </main>
  );
}
