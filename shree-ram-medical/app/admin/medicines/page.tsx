import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { Button } from "@/components/shared/Button";
import { getMedicines } from "@/lib/data/medicines";
import { getInventoryForMedicine, isLowStock } from "@/lib/data/inventory";
import { isDatabaseConfigured } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";
import styles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Medicines — Admin" };

export default async function AdminMedicinesPage() {
  const medicines = await getMedicines();
  const stockFlags = await Promise.all(
    medicines.map(async (m) => {
      const inv = await getInventoryForMedicine(m.slug);
      return inv ? isLowStock(inv) : false;
    })
  );

  return (
    <AdminShell title="Medicines" subtitle={`${medicines.length} SKUs across the catalogue`}>
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h3>All medicines</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className={styles.tag}>{medicines.length} total</span>
            <Button href="/admin/medicines/new" variant="primary">
              <Plus size={14} style={{ marginRight: 6 }} />
              Add Medicine
            </Button>
          </div>
        </div>
        {!isDatabaseConfigured() && (
          <p style={{ color: "var(--amber)", fontSize: 12.5, marginBottom: 16 }}>
            No database connected yet — showing sample data. Medicines added below won&rsquo;t be
            saved until <code>DATABASE_URL</code> is set.
          </p>
        )}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Manufacturer</th>
              <th>Category</th>
              <th>MRP</th>
              <th>Selling price</th>
              <th>Rx</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m, i) => {
              const low = stockFlags[i];
              return (
                <tr key={m.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <div className={styles.dot} style={{ background: m.colors[0] }} />
                      <div>
                        <Link href={`/medicines/${m.slug}`} className={styles.nm} style={{ textDecoration: "none", color: "inherit" }}>
                          {m.name}
                        </Link>
                        <div className={styles.cp}>{m.composition}</div>
                      </div>
                    </div>
                  </td>
                  <td>{m.companyName}</td>
                  <td>{m.categoryName}</td>
                  <td>{formatINR(m.mrp)}</td>
                  <td>{formatINR(m.sellingPrice)}</td>
                  <td>
                    <span className={`${styles.badge} ${m.prescriptionRequired ? styles.badgeRed : styles.badgeGreen}`}>
                      {m.prescriptionRequired ? "RX" : "OTC"}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${low ? styles.badgeAmber : styles.badgeGreen}`}>
                      {low ? "Low stock" : "In stock"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
