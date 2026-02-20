"use client";

import { useEffect, useRef } from "react";
import styles from "./ScrollProgressBar.module.css";

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;
      barRef.current?.style.setProperty("--progress", String(progress));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[70] pointer-events-none">
      <div
        ref={barRef}
        className={`h-full bg-[var(--color-cyan)] origin-left ${styles.bar}`}
      />
    </div>
  );
}
