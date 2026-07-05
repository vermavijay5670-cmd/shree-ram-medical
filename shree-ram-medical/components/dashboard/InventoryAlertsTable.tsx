import type { InventoryItem } from "@/lib/types";
import { getMedicineBySlug } from "@/lib/data/medicines";
import { formatExpiry, isExpiringSoon, isLowStock } from "@/lib/data/inventory";
import styles from "./InventoryAlertsTable.module.css";

function statusFor(item: InventoryItem) {
  if (isExpiringSoon(item.expiryDate, 45)) return { label: "Expiring soon", cls: styles.exp };
  if (isLowStock(item)) return { label: "Low stock", cls: styles.low };
  return { label: "In stock", cls: styles.ok };
}

export async function InventoryAlertsTable({ items }: { items: InventoryItem[] }) {
  const medicines = await Promise.all(items.map((item) => getMedicineBySlug(item.medicineSlug)));

  return (
    <div className={styles.tablePanel}>
      <div className={styles.panelHead}>
        <h3>Inventory alerts</h3>
        <span className={styles.tag}>{items.length} items need attention</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Warehouse</th>
            <th>Batch</th>
            <th>Stock</th>
            <th>Expiry</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const medicine = medicines[i];
            const status = statusFor(item);
            return (
              <tr key={item.id}>
                <td>
                  <div className={styles.medCell}>
                    <div className={styles.medDot} style={{ background: medicine?.colors[0] ?? "#8a938f" }} />
                    <div>
                      <div className={styles.nm}>{medicine?.name ?? item.medicineSlug}</div>
                      <div className={styles.cp}>{medicine?.composition}</div>
                    </div>
                  </div>
                </td>
                <td>{item.warehouse}</td>
                <td>{item.batchNumber}</td>
                <td>{item.stockQty.toLocaleString("en-IN")} units</td>
                <td>{formatExpiry(item.expiryDate)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${status.cls}`}>
                    <span className={styles.d} />
                    {status.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
