import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.filter((l) => l !== routing.defaultLocale).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });
  return { title: `${t("about")} — GameCTL Wiki` };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalPage
      title="About GameCTL Wiki"
      description="GameCTL Wiki is an independent fan-made guide site covering guides, codes, updates, and community resources."
      children={
        <div className="space-y-4">
          <p>GameCTL Wiki is an independent fan-made guide site covering guides, codes, updates, and community resources.</p>
          <p>This is a community-driven resource built by players, for players.</p>
        </div>
      }
    />
  );
}
