"use client";
import { useEffect, useRef } from "react";

interface Props {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
}

// Replace with your real publisher ID from Google AdSense dashboard
const PUBLISHER_ID = "ca-pub-XXXXXXXXXXXXXXXX";

export default function AdSenseUnit({ slot, format = "auto", className }: Props) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      // @ts-expect-error adsbygoogle is injected by the AdSense script tag
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch { /* silent — AdSense script not yet loaded */ }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
