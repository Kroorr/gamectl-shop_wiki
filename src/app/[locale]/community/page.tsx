import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.filter((l) => l !== routing.defaultLocale).map((locale) => ({ locale }));
}

export default async function CommunityPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Community</h1>
        <p className="mt-4 text-muted-foreground">Join the GameCTL community to connect with other players.</p>
        <div className="mt-8 space-y-5 leading-8 text-muted-foreground">
          <p>The GameCTL Wiki is built by the community, for the community.</p>
          <p>Community features coming soon!</p>
        </div>
      </article>
    </main>
  );
}
