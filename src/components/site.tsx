import { Link } from "@/components/custom-link";
import Image from "next/image";
import { ChevronRight, Moon, Sun, Menu } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { NAVIGATION_CONFIG } from "@/config/navigation";
import type { NavGroup } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CollapsibleNavGroup } from "@/components/collapsible-nav-group";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ClientThemeToggle } from "@/components/theme-toggle";
import { SITE_CONFIG } from "@/config/site";

export function localizeHref(href: string, locale: string) {
  if (locale === "en") return href;
  return `/${locale}${href === "/" ? "" : href}`;
}

export async function SiteHeader({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const header = (
    <div className="flex items-center justify-between gap-4">
      <Link href={localizeHref("/", locale)} className="flex items-center gap-3" aria-label={`${SITE_CONFIG.displayName} home`}>
        <Image
          src="/favicon.ico"
          alt=""
          width={36}
          height={36}
          aria-hidden="true"
          className="h-9 w-9 rounded-xl"
          priority
          unoptimized
        />
        <span className="text-sm font-bold tracking-wide text-foreground">{SITE_CONFIG.gameName} <span className="font-normal text-muted-foreground">Wiki</span></span>
      </Link>
      <nav className="hidden items-center gap-1 md:flex">
        {NAVIGATION_CONFIG.map((item) => (
          <Link key={item.key} href={localizeHref(item.path, locale)} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <LanguageSwitcher locale={locale} />
        <ThemeToggle label={t("toggleTheme")} />
        <Sheet>
          <SheetTrigger asChild className="md:hidden"><Button variant="outline" size="icon" aria-label={t("menu")}><Menu className="h-4 w-4" /></Button></SheetTrigger>
          <SheetContent className="border-border bg-background text-foreground">
            <div className="mt-8 grid gap-2">
              {NAVIGATION_CONFIG.map((item) => <Link key={item.key} href={localizeHref(item.path, locale)} className="rounded-lg px-3 py-3 text-sm font-semibold hover:bg-muted">{t(item.key)}</Link>)}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
  // Keep the complete mobile navigation group available while the page scrolls.
  return <header data-site-header className="site-header sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-xl"><div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">{header}</div></header>;
}

function ThemeToggle({ label }: { label: string }) {
  return <ClientThemeToggle label={label} />;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="mb-7 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">{items.map((item, index) => <span key={`${item.label}-${index}`} className="flex items-center gap-2">{index > 0 && <ChevronRight className="h-4 w-4" />}{item.href ? <Link className="hover:text-foreground" href={item.href}>{item.label}</Link> : <span className="text-foreground">{item.label}</span>}</span>)}</nav>;
}

export async function WikiSidebar({
  locale,
  navGroups,
  currentPath,
}: {
  locale: string;
  navGroups: NavGroup[];
  currentPath?: string;
}) {
  const t = await getTranslations({ locale, namespace: "shared" });
  const isActive = (href: string) => currentPath === href;
  return (
    <aside className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-1">

      <section className="rounded-2xl border border-border bg-card/60 p-5 shadow-sm">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">{t("wikiNavigation")}</h3>
        <div className="space-y-4">
          {navGroups.map((group) => (
            <CollapsibleNavGroup
              key={group.slug}
              title={group.title}
              icon={<span className="grid h-4 w-4 place-items-center rounded text-[10px] font-bold text-[hsl(var(--nav-theme))]">{group.title[0]}</span>}
              count={group.count}
              currentPath={currentPath}
            >
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localizeHref(link.href, locale)}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                        isActive(link.href)
                          ? "bg-[hsl(var(--nav-theme)/0.15)] font-semibold text-[hsl(var(--nav-theme))]"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span className="truncate">{link.label}</span>
                      {link.badge && (
                        <Badge variant="secondary" className="ml-auto h-5 border-border px-1.5 text-[10px]">
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </CollapsibleNavGroup>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/60 p-5">
        <h3 className="mb-3 text-sm font-bold text-foreground">{t("activeCodes")}</h3>
        <div className="space-y-3 text-sm">
          <div className="rounded-xl border border-border bg-muted p-3">
            <div className="flex items-center justify-between gap-2">
              <code className="font-mono text-sm font-bold text-foreground">junglegym500</code>
              <span className="shrink-0 text-xs font-semibold text-emerald-500">500 Strength</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-muted p-3">
            <div className="flex items-center justify-between gap-2">
              <code className="font-mono text-sm font-bold text-foreground">epicmuscle20</code>
              <span className="shrink-0 text-xs font-semibold text-emerald-500">2,000 Strength</span>
            </div>
          </div>
          <Link href={localizeHref("/codes", locale)} className="inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--nav-theme))]">
            {t("viewAllCodes")} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </aside>
  );
}

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const site = await getTranslations({ locale, namespace: "site" });
  return <footer className="mt-16 border-t border-border bg-card/30"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-10 rounded-2xl border border-border bg-muted/40 p-5"><div className="font-bold text-foreground">GameCTL</div><p className="mt-1 text-sm text-muted-foreground">{site("description")}</p></div><p className="mb-8 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{site("legalNotice")}</p><div className="grid grid-cols-1 gap-8 md:grid-cols-4"><div className="md:col-span-2"><h3 className="font-bold text-foreground">{t("about")}</h3><p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{site("description")}</p></div><FooterList title={t("guides")} links={[[t("privacy"), "/privacy-policy"], [t("terms"), "/terms-of-service"], [t("copyright"), "/copyright"]]} /></div><p className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">{t("disclaimer")}</p></div></footer>;
}

function FooterList({ title, links }: { title: string; links: string[][] }) { return <div><h4 className="font-semibold text-foreground">{title}</h4><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{links.map(([label, href]) => <li key={href}><Link className="hover:text-foreground" href={href}>{label}</Link></li>)}</ul></div>; }

export function TrailerButton({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border shadow-lg">
      <div className="relative aspect-video w-full">
        <iframe
          className="size-full rounded-2xl"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export function JsonLd({ data }: { data: unknown }) { return <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />; }
