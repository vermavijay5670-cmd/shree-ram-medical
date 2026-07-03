import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageHead } from "@/components/catalogue/PageHead";
import { companies } from "@/lib/data/companies";
import styles from "./gallery.module.css";

export const metadata: Metadata = { title: "Gallery" };

const gradientPairs: [string, string][] = [
  ["#00d9a333", "#00b38933"],
  ["#3d5cff33", "#243fb833"],
  ["#6ee7f233", "#2a9fb033"],
  ["#00d9a333", "#3d5cff33"],
  ["#ffb84d33", "#c9832833"],
  ["#6ee7f233", "#00b38933"],
];

const sections = ["Warehouse", "Office", "Packing", "Delivery", "Staff"];

export default function GalleryPage() {
  const tiles = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    gradient: gradientPairs[i % gradientPairs.length],
    section: sections[i % sections.length],
    company: companies[i % companies.length].name,
  }));

  return (
    <>
      <div className="page-ambient" />
      <Navbar />
      <PageHead
        kicker="Behind the operation"
        title="Warehouse & facility gallery"
        description="A look at how orders move from our warehouses to your shelves — packing, dispatch, and the manufacturing facilities behind the brands we distribute."
      />
      <div className={styles.grid}>
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={styles.tile}
            style={{ background: `linear-gradient(150deg, ${tile.gradient[0]}, ${tile.gradient[1]})` }}
          >
            <div className={styles.caption}>
              <div className={styles.company}>{tile.company}</div>
              <div className={styles.section}>{tile.section}</div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}
