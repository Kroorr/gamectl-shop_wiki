/**
 * AdBanner – Adsterra iframe-based banner component.
 *
 * Each ad slot runs in its own isolated HTML page (public/ads/banner-*.html).
 * The publisher key is forwarded via the `?key=` query-string so that the
 * HTML page can construct the correct atOptions and invoke.js URL –
 * completely isolated from every other slot on the page (no shared window,
 * no global atOptions collision).
 *
 * Usage:
 *   <AdBanner slot="728x90" adKey="abc123..." />
 *
 * Guard:
 *   When adKey is empty / undefined / null the component returns null
 *   immediately – nothing is rendered and no error is thrown.
 */

"use client";

import React from "react";

// ---------------------------------------------------------------------------
// Slot registry
// ---------------------------------------------------------------------------
const SLOT_CONFIGS = {
  "728x90":  { width: 728, height: 90,  label: "Leaderboard"      },
  "300x250": { width: 300, height: 250, label: "Medium Rectangle" },
  "320x50":  { width: 320, height: 50,  label: "Mobile Banner"    },
  "160x300": { width: 160, height: 300, label: "Small Rectangle"  },
  "160x600": { width: 160, height: 600, label: "Wide Skyscraper"  },
  "300x600": { width: 300, height: 600, label: "Half Page"        },
  "468x60":  { width: 468, height: 60,  label: "Full Banner"      },
} as const;

export type AdSlot = keyof typeof SLOT_CONFIGS;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface AdBannerProps {
  /** Ad slot size key, e.g. "728x90" */
  slot: AdSlot;
  /**
   * Adsterra publisher key for this specific slot.
   * Pass an empty string, undefined or null to suppress rendering entirely.
   */
  adKey: string | undefined | null;
  /** Optional extra class applied to the flex wrapper */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function AdBanner({ slot, adKey, className }: AdBannerProps) {
  // Silent guard – no key means no ad, no error.
  if (!adKey) return null;

  const config = SLOT_CONFIGS[slot];

  // Pass the key as a URL query param; the HTML page reads it via
  // URLSearchParams so each iframe has its own isolated scope.
  const src = `/ads/banner-${slot}.html?key=${encodeURIComponent(adKey)}`;

  return (
    <div
      className={className}
      style={{
        // Exactly match the ad dimensions so the wrapper never produces
        // phantom white-space on either side on desktop.
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: config.width,
        height: config.height,
      }}
    >
      <iframe
        src={src}
        width={config.width}
        height={config.height}
        scrolling="no"
        style={{ border: "none", display: "block" }}
        title={`Advertisement – ${config.label}`}
        aria-label="Advertisement"
      />
    </div>
  );
}

export default AdBanner;
