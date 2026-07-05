import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { auth } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/data/orders";
import { medicines } from "@/lib/data/medicines";
import { formatINR } from "@/lib/utils";
import tableStyles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Orders — Partner Portal" };

const statusBadge: Record<string, string> = {
  DELIVERED: "badgeGreen",
  PROCESSING: "badgeBlue",
  PENDING: "badgeAmber",
  CANCELLED: "badgeRed",
};

export default async function PortalOrdersPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const orders = getOrdersForUser(session.user.id);

  return (
    <PortalShell title="Orders" subtitle={`${orders.length} orders placed with your account`}>
      <div className={tableStyles.panel}>
        <div className={tableStyles.panelHead}>
          <h3>Order history</h3>
          <span className={tableStyles.tag}>{orders.length} total</span>
        </div>
        {orders.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 13.5 }}>No orders yet.</p>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Medicines</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className={tableStyles.nm}>{o.id}</td>
                  <td className={tableStyles.cp}>
                    {o.items
                      .map((i) => medicines.find((m) => m.slug === i.medicineSlug)?.name ?? i.medicineSlug)
                      .join(", ")}
                  </td>
                  <td>{formatINR(o.totalAmount)}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td>
                    <span className={`${tableStyles.badge} ${tableStyles[statusBadge[o.status]]}`}>
                      {o.status.charAt(0) + o.status.slice(1).toLowerCase()}
                    </span>
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
