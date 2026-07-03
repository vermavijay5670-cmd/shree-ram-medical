"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./StatsCounter.module.css";

const stats = [
  { target: 50, suffix: "+", label: "Pharmaceutical companies" },
  { target: 20000, suffix: "+", label: "Medicines listed" },
  { target: 500, suffix: "+", label: "Retail partners" },
  { target: 100, suffix: "+", label: "Hospitals served" },
  { target: 50, suffix: "+", label: "Cities covered" },
  { target: 98, suffix: "%", label: "Customer satisfaction" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 1600;
            const start = performance.now();
            function tick(now: number) {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setValue(Math.floor(eased * target));
              if (p < 1) requestAnimationFrame(tick);
              else setValue(target);
            }
            requestAnimationFrame(tick);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <div className={styles.statNum} ref={ref}>
      {value.toLocaleString("en-IN")}
      {suffix}
    </div>
  );
}

export function StatsCounter() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <span className={styles.kicker}>Live network</span>
        <h2>A distribution network built on trust</h2>
        <p>Numbers our retail and hospital partners rely on every day.</p>
      </div>
      <div className={styles.grid}>
        {stats.map((s) => (
          <div className={styles.card} key={s.label}>
            <Counter target={s.target} suffix={s.suffix} />
            <div className={styles.label}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
