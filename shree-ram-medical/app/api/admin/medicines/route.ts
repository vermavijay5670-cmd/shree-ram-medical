import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import { medicineFormSchema } from "@/lib/validations/medicine";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { error: "No database connected yet. Set DATABASE_URL and redeploy before adding medicines." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const parsed = medicineFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const data = parsed.data;
  const slug = slugify(data.name);

  const [existing, company, category] = await Promise.all([
    prisma.medicine.findUnique({ where: { slug } }),
    prisma.company.findUnique({ where: { slug: data.companySlug } }),
    prisma.category.findUnique({ where: { slug: data.categorySlug } }),
  ]);

  if (existing) {
    return NextResponse.json({ error: `A medicine with the slug "${slug}" already exists` }, { status: 409 });
  }
  if (!company) {
    return NextResponse.json({ error: "Selected manufacturer was not found" }, { status: 400 });
  }
  if (!category) {
    return NextResponse.json({ error: "Selected category was not found" }, { status: 400 });
  }

  const fallback = (value: string, text: string) => (value.trim() ? value : text);

  const medicine = await prisma.medicine.create({
    data: {
      name: data.name,
      slug,
      composition: data.composition,
      strength: data.strength,
      packaging: data.packaging,
      companyId: company.id,
      categoryId: category.id,
      mrp: data.mrp,
      sellingPrice: data.sellingPrice,
      gstRate: data.gstRate,
      prescriptionRequired: data.prescriptionRequired,
      description: fallback(data.description, "Details for this medicine will be added shortly."),
      uses: fallback(data.uses, "Consult your pharmacist or physician for usage guidance."),
      dosage: fallback(data.dosage, "As directed by the prescribing physician."),
      contraindications: fallback(data.contraindications, "Consult your physician before use if you have any pre-existing conditions."),
      warnings: [],
      sideEffects: fallback(data.sideEffects, "Consult your physician if you experience any adverse effects."),
      interactions: fallback(data.interactions, "Share a full medication list with the prescribing physician."),
      storage: fallback(data.storage, "Store below 25°C in a cool, dry place away from direct sunlight."),
    },
  });

  if (data.batchNumber && data.expiryDate) {
    await prisma.inventoryItem.create({
      data: {
        medicineId: medicine.id,
        warehouse: data.warehouse || "Patna Central",
        batchNumber: data.batchNumber,
        expiryDate: new Date(data.expiryDate),
        stockQty: data.stockQty,
        lowStockThreshold: data.lowStockThreshold,
      },
    });
  }

  return NextResponse.json({ ok: true, slug: medicine.slug }, { status: 201 });
}
