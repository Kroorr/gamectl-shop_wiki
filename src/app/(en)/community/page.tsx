export default function CommunityPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Community</h1>
        <p className="mt-4 text-muted-foreground">Join the GameCTL community to connect with other players, share strategies, and stay updated.</p>
        <div className="mt-8 space-y-5 leading-8 text-muted-foreground">
          <p>The GameCTL Wiki is built by the community, for the community. Here's how you can get involved:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Share your knowledge by contributing guides and tips</li>
            <li>Help keep codes and information up to date</li>
            <li>Report issues or suggest improvements</li>
            <li>Connect with fellow players</li>
          </ul>
          <p>Community features and contribution guidelines coming soon!</p>
        </div>
      </article>
    </main>
  );
}
