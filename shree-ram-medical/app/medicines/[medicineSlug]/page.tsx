import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { medicines, getMedicineBySlug, getRelatedMedicines } from "@/lib/data/medicines";
import { getInventoryForMedicine } from "@/lib/data/inventory";
import { MedicineDetailClient } from "@/components/catalogue/MedicineDetailClient";

export function generateStaticParams() {
  return medicines.map((m) => ({ medicineSlug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ medicineSlug: string }>;
}): Promise<Metadata> {
  const { medicineSlug } = await params;
  const medicine = getMedicineBySlug(medicineSlug);
  if (!medicine) return {};
  return {
    title: medicine.name,
    description: medicine.description,
  };
}

export default async function MedicineDetailPage({
  params,
}: {
  params: Promise<{ medicineSlug: string }>;
}) {
  const { medicineSlug } = await params;
  const medicine = getMedicineBySlug(medicineSlug);
  if (!medicine) notFound();

  const inventoryItem = getInventoryForMedicine(medicine.slug);
  const related = getRelatedMedicines(medicine);

  return (
    <MedicineDetailClient medicine={medicine} inventoryItem={inventoryItem} related={related} />
  );
}
