import { PrismaClient } from "@prisma/client";
import { companies } from "../lib/data/companies";
import { categories } from "../lib/data/categories";
import { medicines } from "../lib/data/medicines";
import { inventory } from "../lib/data/inventory";
import { users } from "../lib/data/users";
import { orders } from "../lib/data/orders";
import { faqs } from "../lib/data/faqs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");

  // --- Categories ---
  const categoryIdBySlug = new Map<string, string>();
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    categoryIdBySlug.set(cat.slug, record.id);
  }

  // --- Companies (+ plants + certifications) ---
  const companyIdBySlug = new Map<string, string>();
  for (const co of companies) {
    const companyFields = {
      name: co.name,
      description: co.description,
      history: co.history,
      website: co.website,
      country: co.country,
      foundedYear: co.foundedYear,
      segment: co.segment,
      isDomestic: co.isDomestic,
      isPopular: co.isPopular,
      logoColorFrom: co.logoColors[0],
      logoColorTo: co.logoColors[1],
      productsListed: co.productsListed,
      countriesServed: co.countriesServed,
      tags: co.tags,
      categories: co.categories,
      timeline: co.timeline,
      officeAddress: co.officeAddress,
      phone: co.phone,
      email: co.email,
    };
    const record = await prisma.company.upsert({
      where: { slug: co.slug },
      update: companyFields,
      create: { slug: co.slug, ...companyFields },
    });
    companyIdBySlug.set(co.slug, record.id);

    for (const plant of co.plants) {
      await prisma.plant.create({
        data: {
          companyId: record.id,
          name: plant.name,
          location: plant.location,
          certs: plant.certs,
        },
      });
    }
  }

  // --- Medicines (+ inventory) ---
  const medicineIdBySlug = new Map<string, string>();
  for (const med of medicines) {
    const companyId = companyIdBySlug.get(med.companySlug);
    const categoryId = categoryIdBySlug.get(med.categorySlug);
    if (!companyId || !categoryId) continue;

    const record = await prisma.medicine.upsert({
      where: { slug: med.slug },
      update: {},
      create: {
        name: med.name,
        slug: med.slug,
        composition: med.composition,
        strength: med.strength,
        packaging: med.packaging,
        colorFrom: med.colors[0],
        colorTo: med.colors[1],
        companyId,
        categoryId,
        mrp: med.mrp,
        sellingPrice: med.sellingPrice,
        gstRate: med.gstRate,
        prescriptionRequired: med.prescriptionRequired,
        description: med.description,
        uses: med.uses,
        dosage: med.dosage,
        contraindications: med.contraindications,
        warnings: med.warnings,
        sideEffects: med.sideEffects,
        interactions: med.interactions,
        storage: med.storage,
      },
    });
    medicineIdBySlug.set(med.slug, record.id);
  }

  for (const item of inventory) {
    const medicineId = medicineIdBySlug.get(item.medicineSlug);
    if (!medicineId) continue;
    await prisma.inventoryItem.create({
      data: {
        medicineId,
        warehouse: item.warehouse,
        batchNumber: item.batchNumber,
        expiryDate: new Date(item.expiryDate),
        stockQty: item.stockQty,
        lowStockThreshold: item.lowStockThreshold,
      },
    });
  }

  // --- Users ---
  const userIdByMockId = new Map<string, string>();
  for (const u of users) {
    const record = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        // NOTE: plaintext here only because this is demo/seed data. A real
        // build hashes with bcrypt before insert.
        password: u.password,
        role: u.role,
        businessName: u.businessName,
        gstNumber: u.gstNumber,
      },
    });
    userIdByMockId.set(u.id, record.id);
  }

  // --- Orders (+ items) ---
  for (const o of orders) {
    const userId = userIdByMockId.get(o.userId);
    if (!userId) continue;
    await prisma.order.create({
      data: {
        userId,
        status: o.status,
        totalAmount: o.totalAmount,
        createdAt: new Date(o.createdAt),
        items: {
          create: o.items
            .map((item) => {
              const medicineId = medicineIdBySlug.get(item.medicineSlug);
              if (!medicineId) return null;
              return { medicineId, quantity: item.quantity, unitPrice: item.unitPrice };
            })
            .filter((x): x is NonNullable<typeof x> => x !== null),
        },
      },
    });
  }

  console.log(
    `Seeded ${companies.length} companies, ${medicines.length} medicines, ${inventory.length} inventory batches, ${users.length} users, ${orders.length} orders, ${faqs.length} FAQs (FAQs are not yet modeled in schema.prisma — add an Faq model if you want them DB-backed).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
