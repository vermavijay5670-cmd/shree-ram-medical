import type { Role } from "@/lib/types";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  // Plaintext only because this is seed/demo data with no real credentials
  // behind it. A real build stores a bcrypt hash and never plaintext.
  password: string;
  role: Role;
  businessName?: string;
  gstNumber?: string;
  city: string;
}

export const users: MockUser[] = [
  { id: "user-1", name: "Ravi Shankar", email: "admin@shreerammedical.example", password: "admin123", role: "ADMIN", businessName: "Shree Ram Medical Agency", city: "Patna" },
  { id: "user-2", name: "Anita Kumari", email: "anita@sanjeevanipharmacy.example", password: "retailer123", role: "RETAILER", businessName: "Sanjeevani Pharmacy", gstNumber: "10ABCDE1234F1Z5", city: "Patna" },
  { id: "user-3", name: "Dr. Manoj Singh", email: "manoj@ashanursinghome.example", password: "hospital123", role: "HOSPITAL", businessName: "Asha Nursing Home", gstNumber: "10FGHIJ5678K1Z2", city: "Gaya" },
  { id: "user-4", name: "Suresh Distribution Co.", email: "suresh@sureshdistribution.example", password: "distributor123", role: "DISTRIBUTOR", businessName: "Suresh Distribution Co.", gstNumber: "10KLMNO9012P1Z8", city: "Muzaffarpur" },
];

export function getUserByEmail(email: string) {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}
