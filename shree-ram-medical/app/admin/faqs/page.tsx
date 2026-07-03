import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { faqs } from "@/lib/data/faqs";
import styles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "FAQs — Admin" };

export default function AdminFaqsPage() {
  return (
    <AdminShell title="FAQs" subtitle={`${faqs.length} published questions across 4 categories`}>
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h3>All FAQs</h3>
          <span className={styles.tag}>{faqs.length} total</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Question</th>
              <th>Category</th>
              <th>Answer preview</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((f) => (
              <tr key={f.id}>
                <td className={styles.nm} style={{ maxWidth: 260 }}>{f.question}</td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeBlue}`}>{f.category}</span>
                </td>
                <td className={styles.cp} style={{ maxWidth: 380 }}>{f.answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
