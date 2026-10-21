"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// 沿用舊站 sv.js 的動態效果：捲動時淡入、hero 線條視差。
// 換頁（client-side navigation）後會重新套用到新頁面的元素。

const REVEAL_SELECTOR = [
  ".section-head", ".grid > .tile", ".values > .value", ".stats > .stat", ".intro-copy", ".intro-media > .panel",
  ".about-img", ".contact-list > li", ".quality > div", ".why > *", ".motto-inner > *", ".mat-grid > .mat",
  ".ind-list > li", ".mat-ind .h2", ".en-panel", ".article-body > *", ".article-nav > a", ".contact-copy", ".contact .actions",
  ".cat-nav", ".toolbar", ".kw",
].join(",");

export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("motion");

    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    for (const el of els) {
      const sibs = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.matches(REVEAL_SELECTOR)) : [];
      el.style.setProperty("--d", `${Math.min(Math.max(0, sibs.indexOf(el)), 7) * 70}ms`);
      el.classList.add("reveal");
    }
    const finish = (el: HTMLElement) => {
      const onEnd = (e: TransitionEvent) => {
        if (e.target !== el) return;
        el.classList.remove("reveal", "in");
        el.style.removeProperty("--d");
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          const el = en.target as HTMLElement;
          el.classList.add("in");
          finish(el);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));

    const lines = Array.from(document.querySelectorAll<SVGElement>(".hero-lines"));
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        for (const l of lines) l.style.transform = `translate3d(0,${y * -0.12}px,0) rotate(${y * 0.02}deg)`;
        ticking = false;
      });
    };
    if (lines.length) window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      for (const el of els) {
        el.classList.remove("reveal", "in");
        el.style.removeProperty("--d");
      }
    };
  }, [pathname]);

  return null;
}
