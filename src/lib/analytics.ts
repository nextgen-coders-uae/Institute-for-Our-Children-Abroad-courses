/** Fire a conversion event on all configured pixels (call it after a booking). */
export function trackEvent(name: "Lead" | "AddToCart" | "CompleteRegistration", params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...a: unknown[]) => void;
    fbq?: (...a: unknown[]) => void;
    ttq?: { track: (...a: unknown[]) => void };
  };
  w.gtag?.("event", name.toLowerCase(), params);
  w.fbq?.("track", name, params);
  w.ttq?.track(name, params);
}
