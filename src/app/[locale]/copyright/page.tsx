import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.filter((l) => l !== routing.defaultLocale).map((locale) => ({ locale }));
}

export default async function CopyrightPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalPage
      title="Copyright"
      description="Copyright information for GameCTL Wiki."
      content={
        <div className="space-y-4">
          <p>Game-related assets, logos, and media belong to their respective owners. This is a fan-made wiki and is not affiliated with or endorsed by the original creators.</p>
        </div>
      }
    />
  );
}
