import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { inventory, isExpiringSoon, isLowStock, formatExpiry } from "@/lib/data/inventory";
import { getMedicineBySlug } from "@/lib/data/medicines";
import styles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Inventory — Admin" };

export default function AdminInventoryPage() {
  const sorted = [...inventory].sort((a, b) => (a.expiryDate < b.expiryDate ? -1 : 1));

  return (
    <AdminShell title="Inventory" subtitle={`${inventory.length} batches across 3 warehouses`}>
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h3>All batches</h3>
          <span className={styles.tag}>{inventory.length} total</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Warehouse</th>
              <th>Batch</th>
              <th>Stock</th>
              <th>Threshold</th>
              <th>Expiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => {
              const medicine = getMedicineBySlug(item.medicineSlug);
              const low = isLowStock(item);
              const expiring = isExpiringSoon(item.expiryDate, 60);
              const badgeClass = expiring ? styles.badgeRed : low ? styles.badgeAmber : styles.badgeGreen;
              const label = expiring ? "Expiring soon" : low ? "Low stock" : "In stock";
              return (
                <tr key={item.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <div className={styles.dot} style={{ background: medicine?.colors[0] ?? "#8a938f" }} />
                      <div>
                        <div className={styles.nm}>{medicine?.name ?? item.medicineSlug}</div>
                        <div className={styles.cp}>{medicine?.composition}</div>
                      </div>
                    </div>
                  </td>
                  <td>{item.warehouse}</td>
                  <td>{item.batchNumber}</td>
                  <td>{item.stockQty.toLocaleString("en-IN")}</td>
                  <td>{item.lowStockThreshold.toLocaleString("en-IN")}</td>
                  <td>{formatExpiry(item.expiryDate)}</td>
                  <td>
                    <span className={`${styles.badge} ${badgeClass}`}>{label}</span>
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
