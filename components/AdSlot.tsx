"use client";

import { useEffect, useRef } from "react";
import { adsense } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * A manual AdSense ad unit. Renders nothing unless both the publisher ID and
 * the slot ID are configured, so the site works fine before AdSense approval
 * (Auto ads, enabled in the AdSense dashboard, still work via the layout script).
 */
export function AdSlot({ slot }: { slot: keyof typeof adsense.slots }) {
  const slotId = adsense.slots[slot];
  const pushed = useRef(false);

  useEffect(() => {
    if (!adsense.client || !slotId || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blocked or script not loaded yet — ignore.
    }
  }, [slotId]);

  if (!adsense.client || !slotId) return null;

  return (
    <div className="ad-slot" aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsense.client}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
