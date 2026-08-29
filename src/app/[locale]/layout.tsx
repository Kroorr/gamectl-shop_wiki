import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getLocaleMetadata, LocaleLayoutShell, siteViewport } from "@/app/_shared/locale-layout";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales
    .filter((locale) => locale !== routing.defaultLocale)
    .map((locale) => ({ locale }));
}

export const viewport = siteViewport;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return getLocaleMetadata(locale);
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <LocaleLayoutShell locale={locale}>{children}</LocaleLayoutShell>;
}
