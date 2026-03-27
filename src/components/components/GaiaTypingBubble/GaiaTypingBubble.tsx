"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./GaiaTypingBubble.module.css";

interface GaiaTypingBubbleProps {
  text: string;
  /** Delay in ms before typing starts */
  startDelay?: number;
  /** Ms per character */
  speed?: number;
  /** Show the Gaia sender label above the bubble. Default: true */
  showSender?: boolean;
}

export default function GaiaTypingBubble({
  text,
  startDelay = 1200,
  speed = 35,
  showSender = true,
}: GaiaTypingBubbleProps) {
  const [phase, setPhase] = useState<"dots" | "typing" | "done">("dots");
  const [charIndex, setCharIndex] = useState(0);
  const hasStarted = useRef(false);
  const elRef = useRef<HTMLDivElement>(null);

  /* Start typing after delay, triggered by intersection observer */
  useEffect(() => {
    if (!elRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          setTimeout(() => setPhase("typing"), startDelay);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(elRef.current);
    return () => observer.disconnect();
  }, [startDelay]);

  /* Type out characters */
  useEffect(() => {
    if (phase !== "typing") return;
    if (charIndex >= text.length) {
      setPhase("done");
      return;
    }
    const timer = setTimeout(() => setCharIndex((i) => i + 1), speed);
    return () => clearTimeout(timer);
  }, [phase, charIndex, text, speed]);

  return (
    <div ref={elRef} className={styles.wrap}>
      {/* Gaia label */}
      {showSender && (
        <div className={styles.sender}>
          <div className={styles.avatar}>G</div>
          <span className={styles.name}>Gaia</span>
        </div>
      )}

      {/* Dots phase */}
      {phase === "dots" && (
        <div className={styles.bubble}>
          <span className={styles.dots}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
        </div>
      )}

      {/* Typing / done phase */}
      {phase !== "dots" && (
        <div className={styles.bubble}>
          <span className={styles.text}>
            {text.slice(0, charIndex)}
            {phase === "typing" && <span className={styles.cursor} />}
          </span>
        </div>
      )}
    </div>
  );
}
