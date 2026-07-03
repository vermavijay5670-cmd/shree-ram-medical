import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { medicines } from "@/lib/data/medicines";
import { getInventoryForMedicine, isLowStock } from "@/lib/data/inventory";
import { formatINR } from "@/lib/utils";
import styles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Medicines — Admin" };

export default function AdminMedicinesPage() {
  return (
    <AdminShell title="Medicines" subtitle={`${medicines.length} SKUs across the catalogue`}>
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h3>All medicines</h3>
          <span className={styles.tag}>{medicines.length} total</span>
        </div>
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
            {medicines.map((m) => {
              const inv = getInventoryForMedicine(m.slug);
              const low = inv ? isLowStock(inv) : false;
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
