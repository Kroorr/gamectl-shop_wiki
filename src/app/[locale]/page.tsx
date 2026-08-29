import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getHomeMetadata, HomePage } from "@/app/_shared/home-page";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return getHomeMetadata(locale);
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <HomePage locale={locale} />;
}
