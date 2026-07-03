import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageHead } from "@/components/catalogue/PageHead";
import { GlassCard } from "@/components/shared/GlassCard";
import { companies } from "@/lib/data/companies";
import { medicines } from "@/lib/data/medicines";
import styles from "./about.module.css";

export const metadata: Metadata = { title: "About" };

const values = [
  { title: "Verified sourcing", desc: "Every manufacturing partner in our network holds WHO-GMP certification at minimum, checked before they're ever listed in our catalogue." },
  { title: "Same-week fulfilment", desc: "Warehouses in Patna, Gaya and Muzaffarpur mean most in-stock orders reach retail and hospital partners within the same week." },
  { title: "Batch-level transparency", desc: "Batch numbers, expiry dates and Certificates of Analysis are tracked from receipt to dispatch, not just printed on the box." },
  { title: "Partner-first pricing", desc: "Volume-based pricing tiers reward standing retail and hospital relationships rather than one-off orders." },
];

export default function AboutPage() {
  return (
    <>
      <div className="page-ambient" />
      <Navbar active="/about" />
      <PageHead
        kicker="Our story"
        title="Connecting India's manufacturers to the pharmacies that need them"
        description="Shree Ram Medical Agency has spent over a decade building a distribution network that retail pharmacies, hospitals, clinics and nursing homes actually trust — one verified batch at a time."
      />
      <div className={styles.wrap}>
        <div className={styles.storyGrid}>
          <div className={styles.storyText}>
            <p>
              We started as a single-warehouse distributor serving pharmacies across Patna. Today
              we carry <strong>{medicines.length}+ actively stocked SKUs</strong> from{" "}
              <strong>{companies.length} manufacturing partners</strong>, spanning respiratory,
              cardiology, diabetes care, antibiotics, pain management and vitamin supplements.
            </p>
            <p>
              What hasn&rsquo;t changed since our first delivery is the standard we hold every batch
              to: verified manufacturing certification, tracked expiry and batch numbers, and a
              same-week fulfilment commitment for every retail and hospital partner in our network.
            </p>
            <p>
              We work with independent retail pharmacies, hospital procurement teams, nursing
              homes and regional sub-distributors — and we&rsquo;re always evaluating new
              manufacturing partners who meet our certification bar.
            </p>
          </div>
          <div className={styles.statCol}>
            <GlassCard className={styles.statCard}>
              <div className={styles.statVal}>{companies.length}</div>
              <div className={styles.statLbl}>Manufacturing partners</div>
            </GlassCard>
            <GlassCard className={styles.statCard}>
              <div className={styles.statVal}>{medicines.length}+</div>
              <div className={styles.statLbl}>SKUs actively stocked</div>
            </GlassCard>
            <GlassCard className={styles.statCard}>
              <div className={styles.statVal}>3</div>
              <div className={styles.statLbl}>Regional warehouses</div>
            </GlassCard>
            <GlassCard className={styles.statCard}>
              <div className={styles.statVal}>50+</div>
              <div className={styles.statLbl}>Cities served</div>
            </GlassCard>
          </div>
        </div>

        <div className={styles.valuesHead}>
          <span className={styles.kicker}>What we hold ourselves to</span>
          <h2>Our operating principles</h2>
        </div>
        <div className={styles.valuesGrid}>
          {values.map((v) => (
            <GlassCard key={v.title} className={styles.valueCard}>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
