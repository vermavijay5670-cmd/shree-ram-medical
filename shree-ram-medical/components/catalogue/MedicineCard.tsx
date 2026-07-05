"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Medicine } from "@/lib/types";
import { discountPercent, formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import styles from "./MedicineCard.module.css";

export function MedicineCard({
  medicine,
  index = 0,
  lowStock = false,
}: {
  medicine: Medicine;
  index?: number;
  lowStock?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const discount = discountPercent(medicine.mrp, medicine.sellingPrice);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--px", `${px}%`);
    el.style.setProperty("--py", `${py}%`);
  }

  return (
    <div
      ref={ref}
      className={styles.card}
      style={{ animationDelay: `${index * 0.03}s` }}
      onMouseMove={handleMouseMove}
    >
      <Link href={`/medicines/${medicine.slug}`} className={styles.linkArea}>
        <div
          className={styles.packVisual}
          style={{
            background: `linear-gradient(150deg, ${medicine.colors[0]}22, ${medicine.colors[1]}33)`,
          }}
        >
          <span className={cn(styles.rxBadge, medicine.prescriptionRequired ? styles.rx : styles.otc)}>
            {medicine.prescriptionRequired ? "RX" : "OTC"}
          </span>
          <div className={styles.strip}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.pill} />
            ))}
          </div>
        </div>
        <div className={styles.name}>{medicine.name}</div>
        <div className={styles.comp}>{medicine.composition}</div>
        <div className={styles.metaLine}>
          <span>
            Strength: <b>{medicine.strength}</b>
          </span>
          <span>·</span>
          <span>{medicine.packaging}</span>
        </div>
        <div className={styles.manuRow}>
          <span className={styles.manuDot} style={{ background: medicine.colors[0] }} />
          {medicine.companyName}
        </div>
        <div className={styles.priceRow}>
          <span className={styles.mrp}>{formatINR(medicine.mrp)}</span>
          <span className={styles.price}>{formatINR(medicine.sellingPrice)}</span>
          <span className={styles.discount}>{discount}% off</span>
        </div>
      </Link>
      <div className={styles.stockRow}>
        <div className={cn(styles.stock, lowStock ? styles.low : styles.in)}>
          <span className={styles.dot} />
          {lowStock ? "Low stock" : "In stock"}
        </div>
        <button type="button" className={styles.quoteBtn}>
          Request Quote
        </button>
      </div>
    </div>
  );
}
