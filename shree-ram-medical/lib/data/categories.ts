import type { Category } from "@/lib/types";

export const categories: Category[] = [
  { id: "cat-1", name: "Antibiotics", slug: "antibiotics" },
  { id: "cat-2", name: "Pain Relief", slug: "pain" },
  { id: "cat-3", name: "Diabetes", slug: "diabetes" },
  { id: "cat-4", name: "Cardiology", slug: "cardiology" },
  { id: "cat-5", name: "Vitamin Supplements", slug: "vitamins" },
  { id: "cat-6", name: "Respiratory", slug: "respiratory" },
];

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug) ?? null;
}
