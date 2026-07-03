"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageHead } from "@/components/catalogue/PageHead";
import { faqs } from "@/lib/data/faqs";
import styles from "./faq.module.css";

const categories = ["Ordering", "Delivery", "Partnership", "Compliance"] as const;

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <>
      <div className="page-ambient" />
      <Navbar />
      <PageHead
        kicker="Support"
        title="Frequently asked questions"
        description="Answers to the questions retail pharmacies and hospitals ask most often about ordering, delivery, partnership and compliance."
      />
      <div className={styles.wrap}>
        {categories.map((cat) => (
          <div key={cat} className={styles.section}>
            <h2 className={styles.sectionTitle}>{cat}</h2>
            <div className={styles.list}>
              {faqs
                .filter((f) => f.category === cat)
                .map((f) => {
                  const open = openId === f.id;
                  return (
                    <div key={f.id} className={styles.item}>
                      <button
                        type="button"
                        className={styles.question}
                        onClick={() => setOpenId(open ? null : f.id)}
                        aria-expanded={open}
                      >
                        {f.question}
                        <ChevronDown size={16} className={open ? styles.chevOpen : styles.chev} />
                      </button>
                      {open && <div className={styles.answer}>{f.answer}</div>}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}
