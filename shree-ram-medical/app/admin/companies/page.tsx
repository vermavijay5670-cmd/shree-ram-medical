import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { Button } from "@/components/shared/Button";
import { getCompanies } from "@/lib/data/companies";
import { isDatabaseConfigured } from "@/lib/prisma";
import styles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Companies — Admin" };

export default async function AdminCompaniesPage() {
  const companies = await getCompanies();

  return (
    <AdminShell title="Companies" subtitle={`${companies.length} manufacturing partners in the network`}>
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <h3>All companies</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className={styles.tag}>{companies.length} total</span>
            <Button href="/admin/companies/new" variant="primary">
              <Plus size={14} style={{ marginRight: 6 }} />
              Add Company
            </Button>
          </div>
        </div>
        {!isDatabaseConfigured() && (
          <p style={{ color: "var(--amber)", fontSize: 12.5, marginBottom: 16 }}>
            No database connected yet — showing sample data. Companies added below won&rsquo;t be saved
            until <code>DATABASE_URL</code> is set.
          </p>
        )}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Company</th>
              <th>Segment</th>
              <th>Country</th>
              <th>Founded</th>
              <th>Products</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id}>
                <td>
                  <div className={styles.nameCell}>
                    <div className={styles.dot} style={{ background: c.logoColors[0] }} />
                    <div>
                      <Link href={`/companies/${c.slug}`} className={styles.nm} style={{ textDecoration: "none", color: "inherit" }}>
                        {c.name}
                      </Link>
                      <div className={styles.cp}>{c.isDomestic ? "Domestic" : "International"}</div>
                    </div>
                  </div>
                </td>
                <td>{c.segment}</td>
                <td>{c.country}</td>
                <td>{c.foundedYear}</td>
                <td>{c.productsListed.toLocaleString("en-IN")}</td>
                <td>
                  <span className={`${styles.badge} ${c.isPopular ? styles.badgeGreen : styles.badgeMuted}`}>
                    {c.isPopular ? "Popular partner" : "Active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
