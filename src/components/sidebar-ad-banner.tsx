/**
 * SidebarAdBanner
 *
 * Renders a sidebar Adsterra ad (160×300 or 160×600) for desktop only.
 * - hidden on mobile/tablet (hidden lg:flex) to avoid layout disruption
 * - justify-center centres the 160px iframe within the 300px sidebar column
 * - Returns null silently when adKey is absent
 */
"use client";

import { AdBanner, type AdSlot } from "@/components/ad-banner";

interface SidebarAdBannerProps {
  slot: AdSlot;
  adKey: string | undefined | null;
}

export function SidebarAdBanner({ slot, adKey }: SidebarAdBannerProps) {
  if (!adKey) return null;

  return (
    <div className="hidden lg:flex lg:justify-center">
      <AdBanner slot={slot} adKey={adKey} />
    </div>
  );
}
