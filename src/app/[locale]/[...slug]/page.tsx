import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import {
  ContentPage,
  getContentPageMetadata,
  getContentStaticParams,
} from "@/app/_shared/content-page";
import { routing } from "@/i18n/routing";

export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { locale: string; slug: string[] }[] = [];
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) continue;
    const slugParams = await getContentStaticParams(locale);
    for (const p of slugParams) {
      params.push({ locale, slug: p.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return getContentPageMetadata(locale, slug);
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <ContentPage locale={locale} segments={slug} />;
}
