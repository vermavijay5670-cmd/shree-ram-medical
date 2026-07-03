import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Download } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { auth } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/data/orders";
import { formatINR } from "@/lib/utils";
import tableStyles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Invoices — Partner Portal" };

export default async function PortalInvoicesPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const invoices = getOrdersForUser(session.user.id).filter((o) => o.status === "DELIVERED");

  return (
    <PortalShell title="Invoices" subtitle="GST invoices are generated automatically once an order is delivered">
      <div className={tableStyles.panel}>
        <div className={tableStyles.panelHead}>
          <h3>Delivered order invoices</h3>
          <span className={tableStyles.tag}>{invoices.length} available</span>
        </div>
        {invoices.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 13.5 }}>No invoices yet — invoices appear here once an order is marked delivered.</p>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Order</th>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((o) => (
                <tr key={o.id}>
                  <td className={tableStyles.nm}>INV-{o.id.replace("SRM-", "")}</td>
                  <td className={tableStyles.cp}>{o.id}</td>
                  <td>{formatINR(o.totalAmount)}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td>
                    <button
                      type="button"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "1px solid var(--line)",
                        borderRadius: 999,
                        padding: "6px 12px",
                        color: "var(--text)",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      <Download size={13} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PortalShell>
  );
}
