"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/shared/Button";
import styles from "./Hero.module.css";

const capsules = [
  { className: "c1", depth: 0.03, rotate: -24 },
  { className: "c2", depth: 0.06, rotate: 18 },
  { className: "c3", depth: 0.04, rotate: 32 },
  { className: "c4", depth: 0.05, rotate: -16 },
  { className: "c5", depth: 0.07, rotate: 70 },
];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const capsuleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = heroRef.current;
    const glow = glowRef.current;
    if (!hero || !glow || prefersReduced) return;

    let mx = 0.5,
      my = 0.4,
      tx = 0.5,
      ty = 0.4;
    let raf = 0;

    function handleMove(e: MouseEvent) {
      const r = hero!.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width;
      ty = (e.clientY - r.top) / r.height;
    }

    function animate() {
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;
      glow!.style.setProperty("--mx", `${mx * 100}%`);
      glow!.style.setProperty("--my", `${my * 100}%`);
      capsuleRefs.current.forEach((el, i) => {
        if (!el) return;
        const depth = capsules[i].depth;
        const dx = (mx - 0.5) * 100 * depth * 10;
        const dy = (my - 0.5) * 100 * depth * 10;
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${capsules[i].rotate}deg)`;
      });
      raf = requestAnimationFrame(animate);
    }

    hero.addEventListener("mousemove", handleMove);
    raf = requestAnimationFrame(animate);

    return () => {
      hero.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.glow} ref={glowRef} />
      <div className={styles.gridFloor} />
      <div className={styles.capsuleField}>
        {capsules.map((c, i) => (
          <div
            key={c.className}
            ref={(el) => {
              capsuleRefs.current[i] = el;
            }}
            className={`${styles.capsule} ${styles[c.className]} ${styles[`bob${(i % 3) + 1}`]}`}
          />
        ))}
      </div>

      <span className={styles.eyebrow}>
        <span className={styles.dot} />
        Serving 50+ cities across India
      </span>

      <h1 className={styles.headline}>
        <span className={styles.line}>
          <span className={styles.riseSpan}>Medicine, moved</span>
        </span>
        <span className={styles.line}>
          <span className={`${styles.riseSpan} ${styles.grad}`}>with precision.</span>
        </span>
      </h1>

      <p className={styles.subtitle}>
        Shree Ram Medical Agency is the trusted pharmaceutical distribution
        partner connecting 50+ manufacturers to retailers, hospitals and
        clinics — reliably, every single day.
      </p>

      <div className={styles.ctaRow}>
        <Button href="/companies" variant="primary">
          Browse Companies
        </Button>
        <Button href="/medicines" variant="ghost">
          Browse Medicines
        </Button>
        <Button href="/register" variant="ghost">
          Become a Partner
        </Button>
        <Button href="/contact" variant="subtle">
          Contact Sales →
        </Button>
      </div>

      <div className={styles.scrollCue}>
        <span>Scroll</span>
        <div className={styles.stem} />
      </div>
    </section>
  );
}
