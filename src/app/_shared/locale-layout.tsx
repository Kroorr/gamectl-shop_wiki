import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site";
import { StickyAdBanner } from "@/components/sticky-ad-banner";
import type { Locale } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gamectl.shop";

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export function getLocaleMetadata(locale: Locale): Metadata {
  const image = `${siteUrl}/images/hero.webp`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "GameCTL Wiki", template: "%s" },
    description: "GameCTL Wiki — a fan-made community wiki with guides, codes, updates, and tips for players.",
    openGraph: { type: "website", locale, url: siteUrl, siteName: "GameCTL Wiki", title: "GameCTL Wiki", description: "GameCTL Wiki guides, active codes, updates, maps, and practical tips for players.", images: [{ url: image, width: 1200, height: 675, alt: "GameCTL Wiki" }] },
    twitter: { card: "summary_large_image", title: "GameCTL Wiki", description: "Guides, codes, updates, maps, and tips for GameCTL players.", images: [image] },
  };
}

export async function LocaleLayoutShell({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GameCTL Wiki",
    url: siteUrl,
    logo: `${siteUrl}/android-chrome-512x512.png`,
    image: `${siteUrl}/images/hero.webp`,
  };

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <JsonLd data={organization} />
            <SiteHeader locale={locale} />
            <StickyAdBanner adKey={process.env.NEXT_PUBLIC_AD_KEY_320X50} />
            {children}
            <SiteFooter locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
