"use client";

import { Link } from "@/components/custom-link";
import Image from "next/image";
import { ArrowRight, BookOpen, Boxes, ChevronRight, CircleHelp, Code2, Compass, Flame, Gift, Map as MapIcon, ScrollText, Shield, Skull, Swords, Trophy, Users, Zap, type LucideIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { localizeHref } from "@/components/site";
import type { ContentItem, NavGroup } from "@/lib/content";
import en from "@/locales/en.json";
import { SITE_CONFIG } from "@/config/site";

type Home = typeof en.home;

const icons: LucideIcon[] = [BookOpen, Shield, Compass, Boxes, Flame, Code2, Swords, MapIcon, Users, Trophy, Skull, Zap, CircleHelp, ScrollText];


export default function HomePageClient({ home, locale, articles, recentArticles, navGroups }: { home: Home; locale: string; articles: ContentItem[]; recentArticles: ContentItem[]; navGroups: NavGroup[] }) {

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] border border-[hsl(var(--nav-theme)/0.28)] bg-gradient-to-br from-[hsl(var(--nav-theme)/0.14)] via-card to-card px-5 py-9 text-left shadow-2xl shadow-[hsl(var(--nav-theme)/0.08)] md:px-12 md:py-14">
        <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden opacity-25 dark:opacity-20">
          <Image
            src="/images/hero.webp"
            alt="Hero Background"
            fill
            priority
            className="object-cover filter blur-[95px] scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background opacity-85" />
        </div>

        <div className="relative z-10">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-[hsl(var(--nav-theme)/0.35)] bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[hsl(var(--nav-theme))]">{home.hero.eyebrow}</span>
            </div>
            <h1 className="max-w-3xl text-5xl font-black tracking-[-0.05em] text-foreground sm:text-6xl lg:text-8xl">{home.hero.title || SITE_CONFIG.gameName}<span className="text-[hsl(var(--nav-theme))]">.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{home.hero.description}</p>
          
          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={localizeHref("/guide", locale)}
              className="flex items-center gap-2 rounded-full bg-[hsl(var(--nav-theme))] px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all duration-200 hover:bg-[hsl(var(--nav-theme-light))] hover:shadow-lg hover:shadow-[hsl(var(--nav-theme))/0.2]"
            >
              <BookOpen className="h-4 w-4" />
              <span>{home.hero.cta.primary.label}</span>
            </Link>
            
            <Link
              href={localizeHref("/codes", locale)}
              className="flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-background/50 px-5 py-2.5 text-sm font-bold text-foreground transition-all duration-200 hover:border-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme))/0.1] hover:text-[hsl(var(--nav-theme))] hover:shadow-sm"
            >
              <Gift className="h-4 w-4" />
              <span>{home.hero.cta.secondary.label}</span>
            </Link>
          </div>

          <div className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
            {home.hero.stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex flex-col items-start text-left rounded-2xl border border-border bg-card/60 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)] hover:bg-card/85"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</span>
                <span className="mt-1 text-2xl font-extrabold text-foreground">{stat.value}</span>
                <span className="mt-1 text-xs leading-snug text-muted-foreground">{stat.description}</span>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="quick-answer-title" className="grid gap-5 rounded-3xl border border-[hsl(var(--nav-theme)/0.18)] bg-[hsl(var(--nav-theme)/0.06)] p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[hsl(var(--nav-theme))]">Quick answer</p>
          <h2 id="quick-answer-title" className="mt-2 text-xl font-bold text-foreground">Looking for the fastest way to progress?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">Start with the beginner guide, redeem every active code, then use the latest updates to keep your strategy current.</p>
        </div>
        <Link href={localizeHref("/guide/getting-started", locale)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--nav-theme))] px-5 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110">Start here <ArrowRight className="h-4 w-4" /></Link>
      </section>

      <section aria-labelledby="explore-title">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[hsl(var(--nav-theme))]">Explore the wiki</p>
            <h2 id="explore-title" className="mt-2 text-2xl font-bold text-foreground">Find what you need</h2>
          </div>
          <span className="hidden text-sm text-muted-foreground sm:block">{articles.length} resources indexed</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {navGroups.map((group, index) => {
            const Icon = icons[index % icons.length];
            return <Link key={group.slug} href={localizeHref(`/${group.slug}`, locale)} className="group rounded-2xl border border-border/70 bg-card/70 p-5 transition hover:-translate-y-1 hover:border-[hsl(var(--nav-theme)/0.45)] hover:shadow-lg">
              <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--nav-theme)/0.11)] text-[hsl(var(--nav-theme))]"><Icon className="h-5 w-5" /></span><ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-[hsl(var(--nav-theme))]" /></div>
              <h3 className="mt-5 font-bold text-foreground">{group.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{group.count} articles and resources</p>
            </Link>;
          })}
        </div>
      </section>

      {/* Featured Content */}
      {articles.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{home.featured.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{home.featured.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article, index) => {
              const Icon = icons[index % icons.length];
              return (
                <Card key={article.segments.join('/')} className="group relative overflow-hidden border-border/60 bg-card/50 p-5 transition-all duration-300 hover:border-[hsl(var(--nav-theme))/0.4] hover:shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-background/50 text-[hsl(var(--nav-theme))]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-foreground group-hover:text-[hsl(var(--nav-theme))] transition-colors">
                        <Link href={localizeHref(`/${article.segments.join('/')}`, locale)} className="after:absolute after:inset-0">
                          {article.metadata.title}
                        </Link>
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{article.metadata.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
                          {article.metadata.category}
                        </Badge>
                        <span>{article.metadata.date}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{home.latest.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{home.latest.description}</p>
            </div>
            <Link href={localizeHref("/updates", locale)} className="flex items-center gap-1 text-sm font-semibold text-[hsl(var(--nav-theme))] hover:underline">
              {home.latest.viewAll} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recentArticles.slice(0, 6).map((article) => (
              <Link
                key={article.segments.join('/')}
                href={localizeHref(`/${article.segments.join('/')}`, locale)}
                className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-4 transition-all duration-200 hover:border-[hsl(var(--nav-theme))/0.4] hover:bg-card/70"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-foreground group-hover:text-[hsl(var(--nav-theme))]">{article.metadata.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{article.metadata.date}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-[hsl(var(--nav-theme))]" />
              </Link>
            ))}
          </div>
        </section>
      )}
      </div>

  );
}
