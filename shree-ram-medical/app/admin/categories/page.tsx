import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { categories } from "@/lib/data/categories";
import { getMedicinesByCategory } from "@/lib/data/medicines";
import styles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Categories — Admin" };

export default function AdminCategoriesPage() {
  return (
    <AdminShell title="Categories" subtitle={`${categories.length} therapy areas organizing the catalogue`}>
      <div className={styles.grid}>
        {categories.map((cat) => {
          const count = getMedicinesByCategory(cat.slug).length;
          return (
            <div className={styles.tile} key={cat.id}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 15 }}>{cat.name}</div>
              <div style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 6 }}>/{cat.slug}</div>
              <div style={{ marginTop: 14, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22 }}>
                {count}
              </div>
              <div style={{ color: "var(--muted)", fontSize: 12 }}>medicines listed</div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
