import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMedicines, getMedicineBySlug, getRelatedMedicines } from "@/lib/data/medicines";
import { getInventoryForMedicine } from "@/lib/data/inventory";
import { MedicineDetailClient } from "@/components/catalogue/MedicineDetailClient";

export async function generateStaticParams() {
  const medicines = await getMedicines();
  return medicines.map((m) => ({ medicineSlug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ medicineSlug: string }>;
}): Promise<Metadata> {
  const { medicineSlug } = await params;
  const medicine = await getMedicineBySlug(medicineSlug);
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
  const medicine = await getMedicineBySlug(medicineSlug);
  if (!medicine) notFound();

  const inventoryItem = await getInventoryForMedicine(medicine.slug);
  const related = await getRelatedMedicines(medicine);

  return (
    <MedicineDetailClient medicine={medicine} inventoryItem={inventoryItem} related={related} />
  );
}
