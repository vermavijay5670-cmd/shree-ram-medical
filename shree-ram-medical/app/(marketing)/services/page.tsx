import type { Metadata } from "next";
import { Truck, Snowflake, FileCheck2, Building2, Warehouse, HeadphonesIcon } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageHead } from "@/components/catalogue/PageHead";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/shared/Button";
import styles from "./services.module.css";

export const metadata: Metadata = { title: "Services" };

const services = [
  {
    icon: Truck,
    title: "Wholesale distribution",
    desc: "Bulk medicine supply to retail pharmacies, hospitals, clinics and nursing homes with case-quantity and box-quantity ordering.",
  },
  {
    icon: Snowflake,
    title: "Cold-chain logistics",
    desc: "Temperature-controlled transport for injectables and biologics, with logger data provided at handover for full chain-of-custody visibility.",
  },
  {
    icon: FileCheck2,
    title: "Quote & enquiry desk",
    desc: "Submit a quote request from any medicine or company page — our order desk confirms pricing and availability within one business day.",
  },
  {
    icon: Building2,
    title: "Hospital & institutional supply",
    desc: "Standing monthly orders, tender support and dedicated account management for hospitals and nursing homes with recurring volume.",
  },
  {
    icon: Warehouse,
    title: "Regional warehousing",
    desc: "Three warehouses across Patna, Gaya and Muzaffarpur keep fulfilment times short across a 50+ city delivery footprint.",
  },
  {
    icon: HeadphonesIcon,
    title: "Partner account management",
    desc: "Every registered partner gets a portal account to track orders, download invoices and manage quote requests in one place.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <div className="page-ambient" />
      <Navbar active="/services" />
      <PageHead
        kicker="What we do"
        title="Everything a pharmacy or hospital needs from a distributor"
        description="From first quote request to recurring monthly supply, here's how we support retail pharmacies, hospitals, clinics and nursing homes."
      />
      <div className={styles.grid}>
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <GlassCard key={s.title} className={styles.card}>
              <div className={styles.icon}>
                <Icon size={19} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </GlassCard>
          );
        })}
      </div>
      <div className={styles.ctaBand}>
        <div>
          <h2>Ready to place your first order?</h2>
          <p>Register your business or browse the catalogue to request a quote today.</p>
        </div>
        <div className={styles.ctaActions}>
          <Button href="/register" variant="primary">Register your business</Button>
          <Button href="/medicines" variant="ghost">Browse medicines</Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
