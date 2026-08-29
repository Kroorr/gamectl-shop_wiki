import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.filter((l) => l !== routing.defaultLocale).map((locale) => ({ locale }));
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalPage
      title="Terms of Service"
      description="Terms for using GameCTL Wiki."
      children={
        <div className="space-y-4">
          <p>By using this site, you agree not to misuse it, attempt unauthorized access, or present this fan wiki as an official property.</p>
        </div>
      }
    />
  );
}
