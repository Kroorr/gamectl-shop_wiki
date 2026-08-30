import type { Metadata } from "next";
import { getMessages, setRequestLocale } from "next-intl/server";
import { JsonLd, WikiSidebar } from "@/components/site";
import HomePageClient from "@/components/home-page-client";
import { getAllContent, getDynamicNavigation, type ContentItem, CONTENT_TYPES } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";
import en from "@/locales/en.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gamectl.shop";
type Messages = typeof en;

export async function getHomeMetadata(locale: Locale): Promise<Metadata> {
  setRequestLocale(locale);
  const messages = (await getMessages({ locale })) as Messages;
  return {
    title: messages.home.meta.title,
    description: messages.home.meta.description,
    alternates: {
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
      languages: { en: "/", es: "/es", fr: "/fr", pt: "/pt" },
    },
      openGraph: {
      title: messages.home.meta.title,
      description: messages.home.meta.description,
      url: siteUrl,
      images: [{ url: `${siteUrl}/images/hero.webp`, width: 1200, height: 675, alt: "GameCTL Wiki" }],
    },
    twitter: { card: "summary_large_image", title: messages.home.meta.title, description: messages.home.meta.description, images: [`${siteUrl}/images/hero.webp`] },
  };
}

export async function HomePage({ locale }: { locale: Locale }) {
  setRequestLocale(locale);
  const messages = (await getMessages({ locale })) as Messages;
  const navGroups = getDynamicNavigation(locale);
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GameCTL Wiki",
    url: siteUrl,
    description: messages.home.meta.description,
  };

  const allArticles: ContentItem[] = [];
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, locale);
    allArticles.push(...items);
  }

  const recentArticles = [...allArticles]
    .sort((a, b) => {
      const dateA = a.metadata.lastModified || a.metadata.date;
      const dateB = b.metadata.lastModified || b.metadata.date;
      return dateB.localeCompare(dateA);
    })
    .slice(0, 8);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <JsonLd data={webSite} />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <HomePageClient
          home={messages.home}
          locale={locale}
          articles={allArticles}
          recentArticles={recentArticles}
          navGroups={navGroups}
        />
        <div className="hidden lg:block">
          <WikiSidebar locale={locale} navGroups={navGroups} />
        </div>
      </div>
    </main>
  );
}
