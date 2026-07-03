import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { orders } from "@/lib/data/orders";
import { users } from "@/lib/data/users";
import { formatINR } from "@/lib/utils";
import styles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Orders — Admin" };

const statusBadge: Record<string, string> = {
  DELIVERED: "badgeGreen",
  PROCESSING: "badgeBlue",
  PENDING: "badgeAmber",
  CANCELLED: "badgeRed",
};

export default function AdminOrdersPage() {
  const recent = [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, 40);

  return (
    <AdminShell title="Orders" subtitle={`${orders.length} orders placed across all retail and hospital partners`}>
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h3>Recent orders</h3>
          <span className={styles.tag}>Showing latest {recent.length} of {orders.length}</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Partner</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((o) => {
              const user = users.find((u) => u.id === o.userId);
              return (
                <tr key={o.id}>
                  <td className={styles.nm}>{o.id}</td>
                  <td>
                    <div className={styles.nm}>{user?.businessName ?? user?.name}</div>
                    <div className={styles.cp}>{user?.city}</div>
                  </td>
                  <td>{o.items.reduce((sum, i) => sum + i.quantity, 0).toLocaleString("en-IN")} units</td>
                  <td>{formatINR(o.totalAmount)}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[statusBadge[o.status]]}`}>
                      {o.status.charAt(0) + o.status.slice(1).toLowerCase()}
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
