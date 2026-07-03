// Domain types mirroring prisma/schema.prisma.
// The mock data in lib/data/* is typed against these so that swapping
// lib/data calls for real Prisma queries later is a drop-in change.

export type Role = "ADMIN" | "RETAILER" | "HOSPITAL" | "DISTRIBUTOR";

export type EnquiryStatus = "PENDING" | "QUOTED" | "APPROVED" | "REJECTED";

export type OrderStatus = "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED";

export interface Plant {
  id: string;
  name: string;
  location: string;
  certs: string[];
}

export interface Certification {
  id: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoInitials: string;
  logoColors: [string, string];
  description: string;
  history: string;
  timeline: { year: string; description: string }[];
  website?: string;
  country: string;
  foundedYear: number;
  segment: string;
  isDomestic: boolean;
  isPopular: boolean;
  productsListed: number;
  countriesServed: number;
  tags: string[];
  plants: Plant[];
  categories: string[];
  officeAddress: string;
  phone: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Medicine {
  id: string;
  name: string;
  slug: string;
  composition: string;
  strength: string;
  packaging: string;
  colors: [string, string];
  companySlug: string;
  companyName: string;
  categorySlug: string;
  categoryName: string;
  mrp: number;
  sellingPrice: number;
  gstRate: number;
  prescriptionRequired: boolean;
  description: string;
  uses: string;
  dosage: string;
  contraindications: string;
  warnings: string[];
  sideEffects: string;
  interactions: string;
  storage: string;
}

export interface InventoryItem {
  id: string;
  medicineSlug: string;
  warehouse: string;
  batchNumber: string;
  expiryDate: string; // ISO date
  stockQty: number;
  lowStockThreshold: number;
}

export interface GalleryImage {
  id: string;
  companySlug?: string;
  gradient: [string, string];
  caption: string;
  section: "warehouse" | "office" | "packing" | "delivery" | "staff";
}
