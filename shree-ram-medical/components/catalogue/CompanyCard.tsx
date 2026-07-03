"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Company } from "@/lib/types";
import styles from "./CompanyCard.module.css";

export function CompanyCard({ company, index = 0 }: { company: Company; index?: number }) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--px", `${px}%`);
    el.style.setProperty("--py", `${py}%`);
    const rx = ((py - 50) / 50) * -6;
    const ry = ((px - 50) / 50) * 6;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
  }

  return (
    <Link
      href={`/companies/${company.slug}`}
      ref={ref}
      className={styles.card}
      style={{ animationDelay: `${index * 0.04}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.top}>
        <div
          className={styles.logo}
          style={{
            background: `linear-gradient(145deg, ${company.logoColors[0]}, ${company.logoColors[1]})`,
          }}
        >
          {company.logoInitials}
        </div>
        <div className={styles.names}>
          <h3>{company.name}</h3>
          <div className={styles.meta}>
            <span>{company.country}</span>
            <span>·</span>
            <span>Est. {company.foundedYear}</span>
          </div>
        </div>
      </div>
      <div className={styles.desc}>{company.description}</div>
      <div className={styles.tags}>
        {company.tags.slice(0, 3).map((t) => (
          <span key={t} className={styles.tag}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </span>
        ))}
      </div>
      <div className={styles.foot}>
        <div className={styles.statMini}>
          <b>{company.productsListed.toLocaleString("en-IN")}</b> products listed
        </div>
        <div className={styles.arrow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17 17 7M7 7h10v10" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
