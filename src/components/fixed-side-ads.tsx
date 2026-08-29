/**
 * FixedSideAds
 *
 * Replicates the reference site layout:
 * - Left side:  160×600, fixed top-32, only on viewport ≥1700px
 * - Right side: 160×300, fixed top-32, only on viewport ≥1700px
 *
 * Position formula: max(1rem, calc((100vw - 80rem) / 2 - 11rem))
 * This places each ad just outside the max-w-7xl (80rem) content column
 * so they never overlap the main layout.
 *
 * Returns null silently when either key is absent.
 */
"use client";

import { AdBanner } from "@/components/ad-banner";

interface FixedSideAdsProps {
  adKey160x600?: string | null;
  adKey160x300?: string | null;
}

export function FixedSideAds({ adKey160x600, adKey160x300 }: FixedSideAdsProps) {
  if (!adKey160x600 && !adKey160x300) return null;

  return (
    <>
      {/* Left: 160×600 – only on ≥1700px */}
      {adKey160x600 && (
        <div
          className="fixed top-32 z-10 hidden min-[1700px]:block"
          style={{ left: "max(1rem, calc((100vw - 80rem) / 2 - 11rem))" }}
        >
          <div className="flex w-full justify-center">
            <AdBanner slot="160x600" adKey={adKey160x600} />
          </div>
        </div>
      )}

      {/* Right: 160×300 – only on ≥1700px */}
      {adKey160x300 && (
        <div
          className="fixed top-32 z-10 hidden min-[1700px]:block"
          style={{ right: "max(1rem, calc((100vw - 80rem) / 2 - 11rem))" }}
        >
          <div className="flex w-full justify-center">
            <AdBanner slot="160x300" adKey={adKey160x300} />
          </div>
        </div>
      )}
    </>
  );
}
