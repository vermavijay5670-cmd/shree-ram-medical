"use client";

import { useEffect, useState } from "react";
import styles from "./LoadingScreen.module.css";

export function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = setTimeout(() => setHidden(true), prefersReduced ? 0 : 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`${styles.loader} ${hidden ? styles.hide : ""}`} aria-hidden={hidden}>
      <div className={styles.crossWrap}>
        <svg viewBox="0 0 64 64">
          <path d="M32 10 L32 54 M10 32 L54 32" />
        </svg>
      </div>
      <div className={styles.bar}>
        <span />
      </div>
      <div className={styles.label}>Shree Ram Medical Agency</div>
    </div>
  );
}
