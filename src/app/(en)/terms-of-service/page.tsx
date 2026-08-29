import { LegalPage } from "@/components/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="Terms for using GameCTL Wiki."
      children={
        <div className="space-y-4">
          <p>By using this site, you agree not to misuse it, attempt unauthorized access, or present this fan wiki as an official property.</p>
          <p>All content is provided for informational purposes. We do not guarantee accuracy and are not liable for any damages from use of this information.</p>
          <p>Game-related assets, logos, and media belong to their respective owners.</p>
        </div>
      }
    />
  );
}
