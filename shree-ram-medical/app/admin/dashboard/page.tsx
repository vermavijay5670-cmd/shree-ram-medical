import type { Metadata } from "next";
import { IndianRupee, Package, AlertTriangle, Clock } from "lucide-react";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesTrendChart } from "@/components/dashboard/charts/SalesTrendChart";
import { RevenueByCompanyChart } from "@/components/dashboard/charts/RevenueByCompanyChart";
import { TopMedicinesChart } from "@/components/dashboard/charts/TopMedicinesChart";
import { OrdersByStatusChart } from "@/components/dashboard/charts/OrdersByStatusChart";
import { InventoryAlertsTable } from "@/components/dashboard/InventoryAlertsTable";
import { getInventoryAlerts, isExpiringSoon, isLowStock } from "@/lib/data/inventory";
import {
  getMonthlyRevenueTrend,
  getRevenueThisMonth,
  getRevenueDeltaPct,
  getOrdersThisMonth,
  getOrdersToday,
  getRevenueByCompany,
  getTopMedicinesByVolume,
  getOrdersByStatus,
} from "@/lib/data/orders";
import panelStyles from "@/components/dashboard/Panel.module.css";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const alerts = await getInventoryAlerts();
  const lowStockCount = alerts.filter((a) => isLowStock(a)).length;
  const expiringCount = alerts.filter((a) => isExpiringSoon(a.expiryDate, 60)).length;

  const revenueThisMonth = getRevenueThisMonth();
  const revenueDelta = getRevenueDeltaPct();
  const ordersThisMonth = getOrdersThisMonth();
  const ordersToday = getOrdersToday();

  const salesTrend = getMonthlyRevenueTrend();
  const revenueByCompany = getRevenueByCompany();
  const topMedicines = getTopMedicinesByVolume();
  const statusCounts = getOrdersByStatus();
  const ordersByStatus = [
    { name: "Delivered", value: statusCounts.DELIVERED },
    { name: "Processing", value: statusCounts.PROCESSING },
    { name: "Pending", value: statusCounts.PENDING },
    { name: "Cancelled", value: statusCounts.CANCELLED },
  ];

  const today = new Date(2026, 6, 3);
  const todayLabel = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <AdminShell title="Dashboard" subtitle={`${todayLabel} · Here's what's happening today`}>
      <div className={panelStyles.statGrid}>
        <StatCard
          icon={<IndianRupee size={17} color="#00d9a3" />}
          iconBg="var(--green-dim)"
          delta={`${revenueDelta >= 0 ? "+" : ""}${revenueDelta}%`}
          direction={revenueDelta >= 0 ? "up" : "down"}
          value={`₹${revenueThisMonth}L`}
          label="Revenue this month"
        />
        <StatCard
          icon={<Package size={17} color="#3d5cff" />}
          iconBg="var(--blue-dim)"
          delta={`+${ordersToday} today`}
          direction="up"
          value={String(ordersThisMonth)}
          label="Orders this month"
        />
        <StatCard
          icon={<AlertTriangle size={17} color="#ffb84d" />}
          iconBg="rgba(255,184,77,0.14)"
          delta="Needs action"
          direction="down"
          value={String(lowStockCount)}
          label="Low stock items"
        />
        <StatCard
          icon={<Clock size={17} color="#ff6b6b" />}
          iconBg="rgba(255,107,107,0.14)"
          delta="Within 60 days"
          direction="down"
          value={String(expiringCount)}
          label="Batches expiring soon"
        />
      </div>

      <div className={panelStyles.chartGrid}>
        <div className={panelStyles.panel}>
          <div className={panelStyles.panelHead}>
            <h3>Monthly sales trend</h3>
            <span className={panelStyles.tag}>Last 8 months</span>
          </div>
          <div className={panelStyles.chartWrap}>
            <SalesTrendChart data={salesTrend} />
          </div>
        </div>
        <div className={panelStyles.panel}>
          <div className={panelStyles.panelHead}>
            <h3>Revenue by company</h3>
            <span className={panelStyles.tag}>This month</span>
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
            <span className={panelStyles.tag}>This month</span>
          </div>
          <div className={panelStyles.chartWrap}>
            <TopMedicinesChart data={topMedicines} />
          </div>
        </div>
        <div className={panelStyles.panel}>
          <div className={panelStyles.panelHead}>
            <h3>Orders by status</h3>
            <span className={panelStyles.tag}>This month</span>
          </div>
          <div className={panelStyles.chartWrap}>
            <OrdersByStatusChart data={ordersByStatus} />
          </div>
        </div>
      </div>

      <InventoryAlertsTable items={alerts} />
    </AdminShell>
  );
}
