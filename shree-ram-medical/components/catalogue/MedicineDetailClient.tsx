"use client";

import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import type { InventoryItem, Medicine } from "@/lib/types";
import { discountPercent, formatINR } from "@/lib/utils";
import { formatExpiry, isLowStock } from "@/lib/data/inventory";
import styles from "./MedicineDetailClient.module.css";

const PlusIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

interface AccordionSection {
  title: string;
  body: React.ReactNode;
}

export function MedicineDetailClient({
  medicine,
  inventoryItem,
  related,
}: {
  medicine: Medicine;
  inventoryItem: InventoryItem | null;
  related: Medicine[];
}) {
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [openSection, setOpenSection] = useState(0);

  const discount = discountPercent(medicine.mrp, medicine.sellingPrice);
  const lowStock = inventoryItem ? isLowStock(inventoryItem) : false;

  const sections: AccordionSection[] = [
    { title: "Uses & Indications", body: <p>{medicine.uses}</p> },
    {
      title: "Dosage & Administration",
      body: (
        <>
          <p>{medicine.dosage}</p>
          <div className={styles.warnBox}>
            This listing is for wholesale distribution reference only and does not
            substitute a doctor&apos;s prescription or medical advice.
          </div>
        </>
      ),
    },
    { title: "Contraindications", body: <p>{medicine.contraindications}</p> },
    {
      title: "Warnings & Precautions",
      body: (
        <ul>
          {medicine.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ),
    },
    { title: "Side Effects", body: <p>{medicine.sideEffects}</p> },
    { title: "Drug Interactions", body: <p>{medicine.interactions}</p> },
    { title: "Storage", body: <p>{medicine.storage}</p> },
  ];

  return (
    <>
      <div className="page-ambient" />
      <Navbar active="/medicines" />
      <div className={styles.wrap}>
        <div className={styles.breadcrumb}>
          <Link href="/medicines">Medicines</Link>
          <span>/</span>
          <Link href={`/categories/${medicine.categorySlug}`}>{medicine.categoryName}</Link>
          <span>/</span>
          <span className={styles.cur}>{medicine.name}</span>
        </div>

        <div className={styles.productTop}>
          <div className={styles.gallery}>
            <div
              className={styles.galleryMain}
              style={{
                background: `linear-gradient(150deg, ${medicine.colors[0]}44, ${medicine.colors[1]}33)`,
              }}
            >
              {medicine.prescriptionRequired && (
                <span className={styles.rxBadge}>RX Required</span>
              )}
              <div className={styles.blister}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div className={styles.pill} key={i} />
                ))}
              </div>
            </div>
            <div className={styles.thumbs}>
              {Array.from({ length: 4 }).map((_, i) => (
                <button
                  type="button"
                  key={i}
                  className={`${styles.thumb} ${activeThumb === i ? styles.thumbActive : ""}`}
                  onClick={() => setActiveThumb(i)}
                  style={{
                    background: `linear-gradient(150deg, ${medicine.colors[1]}33, ${medicine.colors[0]}22)`,
                  }}
                  aria-label={`View image ${i + 1}`}
                >
                  <div className={styles.miniPill} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.info}>
            <span className={styles.catTag}>{medicine.categoryName}</span>
            <h1>{medicine.name}</h1>
            <div className={styles.comp}>{medicine.composition}</div>
            <div className={styles.manuLine}>
              Manufactured by <b>{medicine.companyName}</b>
            </div>

            <div className={styles.priceBlock}>
              <span className={styles.mrp}>{formatINR(medicine.mrp)}</span>
              <span className={styles.price}>{formatINR(medicine.sellingPrice)}</span>
              <span className={styles.discount}>{discount}% off</span>
            </div>
            <div className={styles.gstNote}>
              Inclusive of {medicine.gstRate}% GST · {medicine.packaging}
            </div>

            <div className={styles.stockLine} style={lowStock ? { color: "var(--amber)" } : undefined}>
              <span
                className={styles.dot}
                style={lowStock ? { background: "var(--amber)", boxShadow: "0 0 6px var(--amber)" } : undefined}
              />
              {lowStock ? "Low stock · Limited quantity available" : "In stock · Ships within 24 hours"}
            </div>

            <div className={styles.qtyRow}>
              <div className={styles.qtyControl}>
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  −
                </button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                  +
                </button>
              </div>
              <button type="button" className={styles.btnPrimary}>
                Request Quote
              </button>
            </div>

            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <div className={styles.k}>Packaging</div>
                <div className={styles.v}>{medicine.packaging}</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.k}>Strength</div>
                <div className={styles.v}>{medicine.strength}</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.k}>Batch Number</div>
                <div className={inventoryItem ? styles.v : `${styles.v} ${styles.placeholder}`}>
                  {inventoryItem ? inventoryItem.batchNumber : "Assigned at dispatch"}
                </div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.k}>Expiry Date</div>
                <div className={inventoryItem ? styles.v : `${styles.v} ${styles.placeholder}`}>
                  {inventoryItem ? formatExpiry(inventoryItem.expiryDate) : "Assigned at dispatch"}
                </div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.k}>GST Rate</div>
                <div className={styles.v}>{medicine.gstRate}%</div>
              </div>
              <div className={styles.specItem}>
                <div className={styles.k}>Storage</div>
                <div className={styles.v}>{medicine.storage.split(".")[0]}.</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.accordion}>
          {sections.map((section, i) => (
            <div className={`${styles.accItem} ${openSection === i ? styles.open : ""}`} key={section.title}>
              <button
                type="button"
                className={styles.accHead}
                onClick={() => setOpenSection(openSection === i ? -1 : i)}
                aria-expanded={openSection === i}
              >
                <span>{section.title}</span>
                <span className={styles.plus}>
                  <PlusIcon />
                </span>
              </button>
              {openSection === i && <div className={styles.accBodyInner}>{section.body}</div>}
            </div>
          ))}
        </div>

        {related.length > 0 && (
          <div className={styles.related}>
            <h2>Related medicines</h2>
            <div className={styles.relatedGrid}>
              {related.map((m) => (
                <Link href={`/medicines/${m.slug}`} className={styles.relCard} key={m.id}>
                  <div
                    className={styles.relVisual}
                    style={{ background: `linear-gradient(150deg, ${m.colors[0]}33, ${m.colors[1]}33)` }}
                  >
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div className={styles.p} key={i} />
                    ))}
                  </div>
                  <div className={styles.relName}>{m.name}</div>
                  <div className={styles.relComp}>{m.composition}</div>
                  <div className={styles.relPrice}>{formatINR(m.sellingPrice)}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
