import { LegalPage } from "@/components/legal-page";

export default function CopyrightPage() {
  return (
    <LegalPage
      title="Copyright"
      description="Copyright information for GameCTL Wiki."
    >
      <div className="space-y-4">
        <p>Game-related assets, logos, and media belong to their respective owners. This is a fan-made wiki and is not affiliated with or endorsed by the original creators.</p>
        <p>Original content on this site (guides, articles, structure) is available under our open license unless otherwise noted.</p>
        <p>If you are a rights holder and believes content on this site infringes on your rights, please contact us.</p>
      </div>
    </LegalPage>
  );
}
