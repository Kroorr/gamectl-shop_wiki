/**
 * StickyAdBanner
 *
 * Renders a 320×50 Adsterra banner that sticks just below the site header.
 * - sticky top-[57px] keeps it anchored below the header (header ≈ 57px tall)
 * - z-20 sits above page content but below the z-50 header
 * - No border-y / no background → desktop side-gutters are completely invisible
 * - Outer mx-auto max-w-4xl centres the slot; inner w-[320px] locks the ad width
 *   so no phantom transparent box bleeds to the edges on desktop
 * - ✕ close button (lucide X) overlaid at top-right; dismissed state removes the
 *   component entirely (return null) so it never re-appears until next page load
 * - Returns null silently when adKey is absent or user has dismissed the ad
 */
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { AdBanner } from "@/components/ad-banner";

interface StickyAdBannerProps {
  adKey: string | undefined | null;
}

export function StickyAdBanner({ adKey }: StickyAdBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!adKey || dismissed) return null;

  return (
    <div className="sticky top-[57px] z-20 py-2">
      {/* Center the ad banner slot on all screens, adding small margin for mobile bounds */}
      <div className="mx-auto flex justify-center px-4">
        {/* relative container with exact ad slot width, no layout overflow padding */}
        <div className="relative">
          <AdBanner slot="320x50" adKey={adKey} />

          {/* Close button – overlays the top-right corner of the ad slot */}
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="关闭广告"
            className="
              absolute -top-2 -right-2 z-30
              flex h-5 w-5 items-center justify-center
              rounded-full border border-border bg-background text-foreground shadow-md
              transition hover:bg-muted
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            "
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
