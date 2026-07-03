import type { InventoryItem } from "@/lib/types";
import { medicines } from "@/lib/data/medicines";

const warehouses = ["Patna Central", "Gaya Depot", "Muzaffarpur Hub"];

// Curated batch records for the demo's flagged inventory-alert rows —
// kept verbatim so the admin dashboard table matches the reference design.
const curated: Record<string, Omit<InventoryItem, "id" | "medicineSlug">> = {
  "augpen-625": { warehouse: "Patna Central", batchNumber: "AGX-2291", expiryDate: "2026-08-18", stockQty: 320, lowStockThreshold: 400 },
  "foracort-200": { warehouse: "Patna Central", batchNumber: "FCT-1187", expiryDate: "2026-09-05", stockQty: 95, lowStockThreshold: 150 },
  "januvia-100": { warehouse: "Gaya Depot", batchNumber: "JNV-0432", expiryDate: "2026-07-22", stockQty: 40, lowStockThreshold: 60 },
  "montair-lc": { warehouse: "Patna Central", batchNumber: "MLC-3390", expiryDate: "2026-07-30", stockQty: 60, lowStockThreshold: 80 },
  "combiflam": { warehouse: "Muzaffarpur Hub", batchNumber: "CBF-7712", expiryDate: "2026-12-14", stockQty: 210, lowStockThreshold: 300 },
  "neurobion-forte": { warehouse: "Gaya Depot", batchNumber: "NBF-5521", expiryDate: "2026-08-09", stockQty: 85, lowStockThreshold: 120 },
  "rosuvas-10": { warehouse: "Patna Central", batchNumber: "RSV-9083", expiryDate: "2027-03-11", stockQty: 1240, lowStockThreshold: 200 },
};

function hashSeed(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function batchFor(slug: string, seed: number) {
  const code = slug
    .split("-")[0]
    .slice(0, 3)
    .toUpperCase();
  return `${code}-${1000 + (seed % 9000)}`;
}

export const inventory: InventoryItem[] = medicines.map((m, i) => {
  const c = curated[m.slug];
  if (c) {
    return { id: `inv-${i + 1}`, medicineSlug: m.slug, ...c };
  }
  const seed = hashSeed(m.slug);
  const warehouse = warehouses[seed % warehouses.length];
  const stockQty = 200 + (seed % 1400);
  const lowStockThreshold = 250;
  const monthsOut = 3 + (seed % 14);
  const expiry = new Date(2026, 6 + monthsOut, 1 + (seed % 27));
  return {
    id: `inv-${i + 1}`,
    medicineSlug: m.slug,
    warehouse,
    batchNumber: batchFor(m.slug, seed),
    expiryDate: expiry.toISOString().slice(0, 10),
    stockQty,
    lowStockThreshold,
  };
});

export function getInventoryForMedicine(medicineSlug: string) {
  return inventory.find((i) => i.medicineSlug === medicineSlug) ?? null;
}

export function formatExpiry(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function isExpiringSoon(iso: string, withinDays = 60) {
  const diff = (new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diff <= withinDays;
}

export function isLowStock(item: InventoryItem) {
  return item.stockQty < item.lowStockThreshold;
}

export function getInventoryAlerts() {
  return inventory
    .filter((item) => isLowStock(item) || isExpiringSoon(item.expiryDate))
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
}
