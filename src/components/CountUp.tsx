"use client";

import { useEffect, useRef, useState } from "react";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Count-up hook (brief task 1). The real `target` is rendered in the HTML by
 * the component below, so the number is present on first paint, with JS
 * disabled, and under reduced motion. This hook only *animates* that value: it
 * eases from 0 up to the target the first time the element scrolls into view.
 * It reads the target — it never supplies the visible number.
 */
export function useCountUp(
  target: number,
  { duration = 1200 }: { duration?: number } = {},
) {
  const ref = useRef<HTMLSpanElement | null>(null);
  // Start at the real target so SSR and the first client render agree — the
  // number is always in the DOM. JS only enhances it.
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: leave the real value untouched, no animation.
    if (prefersReducedMotion()) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        obs.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          setDisplay(Math.round(eased * target));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    // Reset to 0 so the tween has somewhere to climb from — deferred out of the
    // effect body so we never setState synchronously. The stats sit below the
    // fold, so this happens off-screen; the user only ever sees 0 → target.
    const resetRaf = requestAnimationFrame(() => setDisplay(0));
    observer.observe(el);
    return () => {
      cancelAnimationFrame(resetRaf);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return { ref, display } as const;
}

/**
 * Renders a number with its prefix/suffix and thousands separators, animating
 * up from 0 on scroll-in while preserving that formatting throughout the tween.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1200,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}) {
  const { ref, display } = useCountUp(value, { duration: durationMs });

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
