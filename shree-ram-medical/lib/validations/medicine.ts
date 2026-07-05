import { z } from "zod";

export const medicineFormSchema = z.object({
  name: z.string().min(2, "Enter the medicine name"),
  composition: z.string().min(2, "Enter the composition / salt"),
  strength: z.string().min(1, "Enter the strength, e.g. 500mg"),
  packaging: z.string().min(2, "Enter the packaging, e.g. Strip of 10 tablets"),
  companySlug: z.string().min(1, "Select a manufacturer"),
  categorySlug: z.string().min(1, "Select a category"),
  mrp: z.coerce.number().positive("Enter a valid MRP"),
  sellingPrice: z.coerce.number().positive("Enter a valid selling price"),
  gstRate: z.coerce.number().min(0).max(28),
  prescriptionRequired: z.coerce.boolean().default(false),
  description: z.string().optional().default(""),
  uses: z.string().optional().default(""),
  dosage: z.string().optional().default(""),
  contraindications: z.string().optional().default(""),
  sideEffects: z.string().optional().default(""),
  interactions: z.string().optional().default(""),
  storage: z.string().optional().default(""),
  // Initial inventory batch — optional, but if any field is filled all are needed
  warehouse: z.string().optional().default(""),
  batchNumber: z.string().optional().default(""),
  expiryDate: z.string().optional().default(""),
  stockQty: z.coerce.number().optional().default(0),
  lowStockThreshold: z.coerce.number().optional().default(50),
});

export type MedicineFormInput = z.input<typeof medicineFormSchema>;
