import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageHead } from "@/components/catalogue/PageHead";
import { MedicineCard } from "@/components/catalogue/MedicineCard";
import { getCategoryBySlug, categories } from "@/lib/data/categories";
import { getMedicinesByCategory } from "@/lib/data/medicines";
import { getInventoryForMedicine, isLowStock } from "@/lib/data/inventory";
import styles from "@/app/medicines/medicines.module.css";

export function generateStaticParams() {
  return categories.map((c) => ({ categorySlug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};
  return { title: category.name };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const medicines = await getMedicinesByCategory(category.slug);
  const stockFlags = await Promise.all(
    medicines.map(async (m) => {
      const item = await getInventoryForMedicine(m.slug);
      return item ? isLowStock(item) : false;
    })
  );

  return (
    <>
      <div className="page-ambient" />
      <Navbar active="/medicines" />
      <PageHead
        kicker="Category"
        title={category.name}
        description={`${medicines.length} medicine${medicines.length === 1 ? "" : "s"} listed under ${category.name.toLowerCase()}, sourced from our verified manufacturing partners.`}
      />
      <div className={styles.grid}>
        {medicines.length === 0 ? (
          <div className={styles.empty}>
            <h3>No medicines listed yet</h3>
            <p>Check back soon, or browse the full catalogue.</p>
          </div>
        ) : (
          medicines.map((m, i) => <MedicineCard medicine={m} index={i} lowStock={stockFlags[i]} key={m.id} />)
        )}
      </div>
      <Footer />
    </>
  );
}
