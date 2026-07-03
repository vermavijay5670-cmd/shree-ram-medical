import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { getContactRequests } from "@/lib/data/enquiries";
import styles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Contact Requests — Admin" };

const statusBadge: Record<string, string> = {
  PENDING: "badgeAmber",
  QUOTED: "badgeBlue",
  APPROVED: "badgeGreen",
  REJECTED: "badgeRed",
};

export default function AdminContactRequestsPage() {
  const requests = getContactRequests();

  return (
    <AdminShell title="Contact Requests" subtitle={`${requests.length} enquiries from the contact form and quote requests`}>
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h3>All requests</h3>
          <span className={styles.tag}>{requests.length} total</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Contact</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className={styles.nm}>{r.businessName}</div>
                  <div className={styles.cp}>{r.name} · {r.email}</div>
                </td>
                <td className={styles.cp} style={{ maxWidth: 380 }}>{r.message}</td>
                <td>{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td>
                  <span className={`${styles.badge} ${styles[statusBadge[r.status]]}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
