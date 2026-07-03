import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Receipt, TrendingUp, MessageSquareText } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { auth } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/data/orders";
import { formatINR } from "@/lib/utils";
import panelStyles from "@/components/dashboard/Panel.module.css";
import tableStyles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Dashboard — Partner Portal" };

const statusBadge: Record<string, string> = {
  DELIVERED: "badgeGreen",
  PROCESSING: "badgeBlue",
  PENDING: "badgeAmber",
  CANCELLED: "badgeRed",
};

export default async function PortalDashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const orders = getOrdersForUser(session.user.id);
  const totalSpend = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrders = orders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING").length;
  const recent = orders.slice(0, 6);

  return (
    <PortalShell title={`Welcome back, ${session.user.name?.split(" ")[0]}`} subtitle="Here's what's happening with your account">
      <div className={panelStyles.statGrid}>
        <div className={panelStyles.panel}>
          <TrendingUp size={17} color="#00d9a3" />
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 14 }}>
            {formatINR(totalSpend)}
          </div>
          <div style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 4 }}>Lifetime order value</div>
        </div>
        <div className={panelStyles.panel}>
          <Package size={17} color="#3d5cff" />
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 14 }}>
            {orders.length}
          </div>
          <div style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 4 }}>Total orders placed</div>
        </div>
        <div className={panelStyles.panel}>
          <Receipt size={17} color="#ffb84d" />
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 14 }}>
            {activeOrders}
          </div>
          <div style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 4 }}>Active orders</div>
        </div>
        <div className={panelStyles.panel}>
          <MessageSquareText size={17} color="#6ee7f2" />
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 14 }}>0</div>
          <div style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 4 }}>Pending quote requests</div>
        </div>
      </div>

      <div className={tableStyles.panel}>
        <div className={tableStyles.panelHead}>
          <h3>Recent orders</h3>
          <Link href="/portal/orders" style={{ color: "var(--green)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 13.5 }}>No orders yet. Browse the medicines catalogue to request your first quote.</p>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id}>
                  <td className={tableStyles.nm}>{o.id}</td>
                  <td>{o.items.reduce((s, i) => s + i.quantity, 0)} units</td>
                  <td>{formatINR(o.totalAmount)}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
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
