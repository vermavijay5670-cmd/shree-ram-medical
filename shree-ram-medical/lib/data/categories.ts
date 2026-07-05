import type { Category } from "@/lib/types";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";

export const sampleCategories: Category[] = [
  { id: "cat-1", name: "Antibiotics", slug: "antibiotics" },
  { id: "cat-2", name: "Pain Relief", slug: "pain" },
  { id: "cat-3", name: "Diabetes", slug: "diabetes" },
  { id: "cat-4", name: "Cardiology", slug: "cardiology" },
  { id: "cat-5", name: "Vitamin Supplements", slug: "vitamins" },
  { id: "cat-6", name: "Respiratory", slug: "respiratory" },
];

// Kept for any code that still wants the plain sample list synchronously
// (e.g. client components rendering static filter chips).
export const categories = sampleCategories;

export async function getCategories(): Promise<Category[]> {
  if (!isDatabaseConfigured()) return sampleCategories;
  const rows = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return rows.map((r: { id: string; name: string; slug: string }) => ({ id: r.id, name: r.name, slug: r.slug }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isDatabaseConfigured()) {
    return sampleCategories.find((c) => c.slug === slug) ?? null;
  }
  const row = await prisma.category.findUnique({ where: { slug } });
  return row ? { id: row.id, name: row.name, slug: row.slug } : null;
}
