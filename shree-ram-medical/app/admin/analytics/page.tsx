import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { SalesTrendChart } from "@/components/dashboard/charts/SalesTrendChart";
import { RevenueByCompanyChart } from "@/components/dashboard/charts/RevenueByCompanyChart";
import { TopMedicinesChart } from "@/components/dashboard/charts/TopMedicinesChart";
import { OrdersByStatusChart } from "@/components/dashboard/charts/OrdersByStatusChart";
import {
  getMonthlyRevenueTrend,
  getRevenueByCompany,
  getTopMedicinesByVolume,
  getOrdersByStatus,
  orders,
} from "@/lib/data/orders";
import { formatINR } from "@/lib/utils";
import panelStyles from "@/components/dashboard/Panel.module.css";

export const metadata: Metadata = { title: "Analytics — Admin" };

export default function AdminAnalyticsPage() {
  const salesTrend = getMonthlyRevenueTrend();
  const revenueByCompany = getRevenueByCompany(6);
  const topMedicines = getTopMedicinesByVolume(8);
  const statusCounts = getOrdersByStatus();
  const ordersByStatus = [
    { name: "Delivered", value: statusCounts.DELIVERED },
    { name: "Processing", value: statusCounts.PROCESSING },
    { name: "Pending", value: statusCounts.PENDING },
    { name: "Cancelled", value: statusCounts.CANCELLED },
  ];
  const totalRevenue = salesTrend.reduce((s, m) => s + m.revenueLakh, 0);
  const avgOrderValue = orders.length ? orders.reduce((s, o) => s + o.totalAmount, 0) / orders.length : 0;

  return (
    <AdminShell title="Analytics" subtitle="8-month performance across the distribution network">
      <div className={panelStyles.statGrid} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <div className={panelStyles.panel}>
          <div style={{ color: "var(--muted)", fontSize: 12.5 }}>Total revenue (8mo)</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 8 }}>
            ₹{totalRevenue.toFixed(1)}L
          </div>
        </div>
        <div className={panelStyles.panel}>
          <div style={{ color: "var(--muted)", fontSize: 12.5 }}>Total orders (8mo)</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 8 }}>
            {orders.length.toLocaleString("en-IN")}
          </div>
        </div>
        <div className={panelStyles.panel}>
          <div style={{ color: "var(--muted)", fontSize: 12.5 }}>Average order value</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 8 }}>
            {formatINR(Math.round(avgOrderValue))}
          </div>
        </div>
        <div className={panelStyles.panel}>
          <div style={{ color: "var(--muted)", fontSize: 12.5 }}>Fulfilment rate</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, marginTop: 8 }}>
            {Math.round(((statusCounts.DELIVERED + statusCounts.PROCESSING) / orders.length) * 100)}%
          </div>
        </div>
      </div>

      <div className={panelStyles.chartGrid}>
        <div className={panelStyles.panel}>
          <div className={panelStyles.panelHead}>
            <h3>Revenue trend</h3>
            <span className={panelStyles.tag}>Last 8 months</span>
          </div>
          <div className={panelStyles.chartWrap}>
            <SalesTrendChart data={salesTrend} />
          </div>
        </div>
        <div className={panelStyles.panel}>
          <div className={panelStyles.panelHead}>
            <h3>Revenue by company</h3>
            <span className={panelStyles.tag}>Top 6</span>
          </div>
          <div className={panelStyles.chartWrap}>
            <RevenueByCompanyChart data={revenueByCompany} />
          </div>
        </div>
      </div>

      <div className={panelStyles.chartGrid2}>
        <div className={panelStyles.panel}>
          <div className={panelStyles.panelHead}>
            <h3>Top medicines by volume</h3>
            <span className={panelStyles.tag}>Top 8</span>
          </div>
          <div className={panelStyles.chartWrap}>
            <TopMedicinesChart data={topMedicines} />
          </div>
        </div>
        <div className={panelStyles.panel}>
          <div className={panelStyles.panelHead}>
            <h3>Orders by status</h3>
            <span className={panelStyles.tag}>8-month total</span>
          </div>
          <div className={panelStyles.chartWrap}>
            <OrdersByStatusChart data={ordersByStatus} />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
