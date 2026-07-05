import { z } from "zod";

export const companyFormSchema = z.object({
  name: z.string().min(2, "Enter the company name"),
  segment: z.string().min(2, "Enter the therapy segment, e.g. Respiratory & Cardiology"),
  country: z.string().min(2, "Enter the country"),
  foundedYear: z.coerce.number().min(1800).max(new Date().getFullYear()),
  description: z.string().min(10, "Enter a short description"),
  website: z.string().optional().default(""),
  isDomestic: z.coerce.boolean().default(true),
  isPopular: z.coerce.boolean().default(false),
  officeAddress: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
});

export type CompanyFormInput = z.input<typeof companyFormSchema>;
