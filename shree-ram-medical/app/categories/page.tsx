import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageHead } from "@/components/catalogue/PageHead";
import { GlassCard } from "@/components/shared/GlassCard";
import { getCategories } from "@/lib/data/categories";
import { getMedicinesByCategory } from "@/lib/data/medicines";
import styles from "./categories.module.css";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const categories = await getCategories();
  const counts = await Promise.all(categories.map((cat) => getMedicinesByCategory(cat.slug)));

  return (
    <>
      <div className="page-ambient" />
      <Navbar />
      <PageHead
        kicker="Browse by therapy area"
        title="Medicine categories"
        description="Every SKU in our catalogue is organized into a therapy area, from antibiotics to vitamin supplements, so retail and hospital partners can find what they need fast."
      />
      <div className={styles.grid}>
        {categories.map((cat, i) => {
          const count = counts[i].length;
          return (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className={styles.link}>
              <GlassCard className={styles.tile}>
                <div className={styles.name}>{cat.name}</div>
                <div className={styles.count}>{count} medicines</div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
      <Footer />
    </>
  );
}
