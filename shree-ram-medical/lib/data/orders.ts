import { medicines } from "@/lib/data/medicines";
import { companies } from "@/lib/data/companies";
import { users } from "@/lib/data/users";
import type { OrderStatus } from "@/lib/types";

export interface OrderItemRecord {
  medicineSlug: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRecord {
  id: string;
  userId: string;
  status: OrderStatus;
  createdAt: string; // ISO date
  items: OrderItemRecord[];
  totalAmount: number;
}

// Deterministic PRNG (mulberry32) so the dataset is identical on every
// server render and on the client — using Math.random() here would cause
// hydration mismatches and a different dashboard on every refresh.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(88123);
const retailerUsers = users.filter((u) => u.role !== "ADMIN");

const MONTHS = 8;
const now = new Date(2026, 6, 2); // Wed, 2 Jul 2026 — matches the admin demo's "today"

function monthLabel(offset: number) {
  const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
  return d.toLocaleDateString("en-US", { month: "short" });
}

const statusPool: OrderStatus[] = [
  ...Array(58).fill("DELIVERED"),
  ...Array(24).fill("PROCESSING"),
  ...Array(13).fill("PENDING"),
  ...Array(5).fill("CANCELLED"),
];

function pick<T>(arr: T[]) {
  return arr[Math.floor(rand() * arr.length)];
}

export const orders: OrderRecord[] = (() => {
  const list: OrderRecord[] = [];
  let counter = 1;
  // Roughly rising order volume month over month, matching the demo's
  // upward sales trend, tailing off to "today" for the current month.
  const monthlyOrderCounts = [26, 29, 28, 33, 31, 36, 39, 41];

  for (let m = MONTHS - 1; m >= 0; m--) {
    const count = monthlyOrderCounts[MONTHS - 1 - m];
    for (let i = 0; i < count; i++) {
      const day = 1 + Math.floor(rand() * 27);
      const createdAt = new Date(now.getFullYear(), now.getMonth() - m, day);
      const itemCount = 1 + Math.floor(rand() * 3);
      const items: OrderItemRecord[] = [];
      for (let k = 0; k < itemCount; k++) {
        const med = pick(medicines);
        items.push({
          medicineSlug: med.slug,
          quantity: 10 + Math.floor(rand() * 90),
          unitPrice: med.sellingPrice,
        });
      }
      const totalAmount = items.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);
      const status: OrderStatus = m === 0 && day > 20 ? pick(["PENDING", "PROCESSING", "PROCESSING"]) : pick(statusPool);
      list.push({
        id: `SRM-${String(1000 + counter).padStart(5, "0")}`,
        userId: pick(retailerUsers).id,
        status,
        createdAt: createdAt.toISOString(),
        items,
        totalAmount,
      });
      counter++;
    }
  }
  return list;
})();

export function getOrdersForUser(userId: string) {
  return orders.filter((o) => o.userId === userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getMonthlyRevenueTrend() {
  const buckets: { label: string; revenueLakh: number }[] = [];
  for (let m = MONTHS - 1; m >= 0; m--) {
    const label = monthLabel(m);
    const start = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - m + 1, 1);
    const total = orders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d >= start && d < end && o.status !== "CANCELLED";
      })
      .reduce((sum, o) => sum + o.totalAmount, 0);
    buckets.push({ label, revenueLakh: Math.round((total / 100000) * 10) / 10 });
  }
  return buckets;
}

export function getRevenueThisMonth() {
  return getMonthlyRevenueTrend().at(-1)?.revenueLakh ?? 0;
}

export function getRevenueDeltaPct() {
  const trend = getMonthlyRevenueTrend();
  const current = trend.at(-1)?.revenueLakh ?? 0;
  const prev = trend.at(-2)?.revenueLakh ?? current;
  if (prev === 0) return 0;
  return Math.round(((current - prev) / prev) * 1000) / 10;
}

export function getOrdersThisMonth() {
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  return orders.filter((o) => new Date(o.createdAt) >= start).length;
}

export function getOrdersToday() {
  return orders.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  }).length;
}

export function getOrdersByStatus() {
  const counts: Record<OrderStatus, number> = { DELIVERED: 0, PROCESSING: 0, PENDING: 0, CANCELLED: 0 };
  for (const o of orders) counts[o.status]++;
  return counts;
}

export function getRevenueByCompany(limit = 4) {
  const byCompany = new Map<string, number>();
  for (const o of orders) {
    if (o.status === "CANCELLED") continue;
    for (const item of o.items) {
      const med = medicines.find((m) => m.slug === item.medicineSlug);
      if (!med) continue;
      const revenue = item.quantity * item.unitPrice;
      byCompany.set(med.companySlug, (byCompany.get(med.companySlug) ?? 0) + revenue);
    }
  }
  const sorted = [...byCompany.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, limit);
  const othersTotal = sorted.slice(limit).reduce((sum, [, v]) => sum + v, 0);
  const grandTotal = sorted.reduce((sum, [, v]) => sum + v, 0) || 1;
  const rows = top.map(([slug, value]) => ({
    name: companies.find((c) => c.slug === slug)?.name ?? slug,
    value: Math.round((value / grandTotal) * 1000) / 10,
  }));
  if (othersTotal > 0) {
    rows.push({ name: "Others", value: Math.round((othersTotal / grandTotal) * 1000) / 10 });
  }
  return rows;
}

export function getTopMedicinesByVolume(limit = 5) {
  const byMedicine = new Map<string, number>();
  for (const o of orders) {
    if (o.status === "CANCELLED") continue;
    for (const item of o.items) {
      byMedicine.set(item.medicineSlug, (byMedicine.get(item.medicineSlug) ?? 0) + item.quantity);
    }
  }
  return [...byMedicine.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug, qty]) => ({
      name: medicines.find((m) => m.slug === slug)?.name ?? slug,
      units: qty,
    }));
}
