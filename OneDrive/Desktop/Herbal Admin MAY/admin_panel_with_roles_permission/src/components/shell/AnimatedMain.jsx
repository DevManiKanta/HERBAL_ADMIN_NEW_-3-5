import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

export default function AnimatedMain({ children }) {
  const innerRef = useRef(null);
  const location = useLocation();

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    if (reduce) {
      gsap.set(el, { opacity: 1, y: 0, filter: "none" });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 16, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        ease: "power2.out",
      },
    );
    return () => tween.kill();
  }, [location.pathname]);

  return (
    <div ref={innerRef} className="admin-animated-main">
      {children}
    </div>
  );
}
