import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  businessName: z.string().min(2, "Enter your business name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["RETAILER", "HOSPITAL", "DISTRIBUTOR"]),
  gstNumber: z.string().min(15, "Enter a valid 15-character GST number").max(15),
  city: z.string().min(2, "Enter your city"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const enquirySchema = z.object({
  name: z.string().min(2, "Enter your name"),
  businessName: z.string().min(2, "Enter your business name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(8, "Enter a valid phone number"),
  message: z.string().min(10, "Tell us a little more about what you need"),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
