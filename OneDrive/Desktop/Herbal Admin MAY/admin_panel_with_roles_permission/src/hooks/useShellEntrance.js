import { useLayoutEffect } from "react";
import gsap from "gsap";

/**
 * Entrance animation for shell chrome (navbar + ribbon + main).
 */
export function useShellEntrance({ headerRef, ribbonRef, mainRef }) {
  useLayoutEffect(() => {
    const header = headerRef?.current;
    const ribbon = ribbonRef?.current;
    const main = mainRef?.current;
    if (!header || !ribbon || !main) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.set([header, ribbon, main], { willChange: "transform, opacity" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(header, { y: -20, opacity: 0, duration: 0.55 }, 0)
        .from(ribbon, { y: -12, opacity: 0, duration: 0.45 }, 0.06)
        .from(main, { opacity: 0, y: 18, duration: 0.55 }, 0.1);

      tl.eventCallback("onComplete", () => {
        gsap.set([header, ribbon, main], { clearProps: "willChange" });
      });
    });

    return () => ctx.revert();
  }, [headerRef, ribbonRef, mainRef]);
}
