import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { users } from "@/lib/data/users";
import { getOrdersForUser } from "@/lib/data/orders";
import { formatINR } from "@/lib/utils";
import styles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Retailers — Admin" };

const roleBadge: Record<string, string> = {
  RETAILER: "badgeGreen",
  HOSPITAL: "badgeBlue",
  DISTRIBUTOR: "badgeAmber",
  ADMIN: "badgeMuted",
};

export default function AdminRetailersPage() {
  const partners = users.filter((u) => u.role !== "ADMIN");

  return (
    <AdminShell title="Retailers" subtitle={`${partners.length} registered partner accounts`}>
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h3>Partner accounts</h3>
          <span className={styles.tag}>{partners.length} total</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Business</th>
              <th>Contact</th>
              <th>City</th>
              <th>GST</th>
              <th>Type</th>
              <th>Lifetime orders</th>
              <th>Lifetime value</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((u) => {
              const userOrders = getOrdersForUser(u.id);
              const ltv = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);
              return (
                <tr key={u.id}>
                  <td className={styles.nm}>{u.businessName}</td>
                  <td>
                    <div className={styles.nm}>{u.name}</div>
                    <div className={styles.cp}>{u.email}</div>
                  </td>
                  <td>{u.city}</td>
                  <td>{u.gstNumber ?? "—"}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[roleBadge[u.role]]}`}>{u.role}</span>
                  </td>
                  <td>{userOrders.length}</td>
                  <td>{formatINR(ltv)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
