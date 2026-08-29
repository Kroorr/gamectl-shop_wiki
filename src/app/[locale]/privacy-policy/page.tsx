import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal-page";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.filter((l) => l !== routing.defaultLocale).map((locale) => ({ locale }));
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalPage
      title="Privacy Policy"
      description="How we handle information on GameCTL Wiki."
      children={
        <div className="space-y-4">
          <p>This fan wiki provides informational game guides. We do not request account credentials, passwords, or private payment information.</p>
          <p>By using this site, you agree to this privacy policy.</p>
        </div>
      }
    />
  );
}
