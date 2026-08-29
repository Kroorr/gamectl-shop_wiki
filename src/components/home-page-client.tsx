"use client";

import { Link } from "@/components/custom-link";
import Image from "next/image";
import { ArrowRight, BookOpen, Boxes, ChevronRight, CircleHelp, Code2, Compass, Flame, Gift, Map as MapIcon, ScrollText, Shield, Skull, Swords, Trophy, Users, Zap, type LucideIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { localizeHref } from "@/components/site";
import type { ContentItem } from "@/lib/content";
import en from "@/locales/en.json";

type Home = typeof en.home;

const icons: LucideIcon[] = [BookOpen, Shield, Compass, Boxes, Flame, Code2, Swords, MapIcon, Users, Trophy, Skull, Zap, CircleHelp, ScrollText];


export default function HomePageClient({ home, locale, articles, recentArticles,  }: { home: Home; locale: string; articles: ContentItem[]; recentArticles: ContentItem[] }) {

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative text-center py-10 px-4 md:py-16 md:px-8 rounded-3xl border border-border/40 bg-card/10 overflow-hidden shadow-sm">
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
          <div className="mx-auto mb-5 flex flex-wrap items-center justify-center gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">{home.hero.title}</h1>
            <span className="inline-flex items-center rounded-md border border-[hsl(var(--nav-theme))] bg-[hsl(var(--nav-theme))] px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">{home.hero.eyebrow}</span>
          </div>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">{home.hero.description}</p>
          
          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
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

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
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
                <Card key={article.href} className="group relative overflow-hidden border-border/60 bg-card/50 p-5 transition-all duration-300 hover:border-[hsl(var(--nav-theme))/0.4] hover:shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-background/50 text-[hsl(var(--nav-theme))]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-foreground group-hover:text-[hsl(var(--nav-theme))] transition-colors">
                        <Link href={localizeHref(article.href, locale)} className="after:absolute after:inset-0">
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
                key={article.href}
                href={localizeHref(article.href, locale)}
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
