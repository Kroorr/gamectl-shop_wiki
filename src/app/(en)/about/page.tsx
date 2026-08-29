import { LegalPage } from "@/components/legal-page";

export default function AboutPage() {
  return (
    <LegalPage
      title="About GameCTL Wiki"
      description="GameCTL Wiki is an independent fan-made guide site covering guides, codes, updates, and community resources."
      content={
        <div className="space-y-4">
          <p>GameCTL Wiki is an independent fan-made guide site covering guides, codes, updates, and community resources.</p>
          <p>This is a community-driven resource built by players, for players. We are not affiliated with any official game studio.</p>
          <p>Our mission is to provide accurate, up-to-date information to help players get the most out of their experience.</p>
        </div>
      }
    />
  );
}
