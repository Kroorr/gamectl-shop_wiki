import { LegalPage } from "@/components/legal-page";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How we handle information on GameCTL Wiki."
    >
      <div className="space-y-4">
        <p>This fan wiki provides informational game guides. We do not request account credentials, passwords, or private payment information.</p>
        <p>We may use standard analytics tools to understand how visitors use the site. This data is anonymous and not shared with third parties except as required for service operation.</p>
        <p>By using this site, you agree to this privacy policy.</p>
      </div>
    </LegalPage>
  );
}
