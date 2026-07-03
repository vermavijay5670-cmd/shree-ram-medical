import type { EnquiryStatus } from "@/lib/types";

export interface ContactRequest {
  id: string;
  name: string;
  businessName: string;
  email: string;
  phone: string;
  message: string;
  companySlug?: string;
  status: EnquiryStatus;
  createdAt: string;
}

export const contactRequests: ContactRequest[] = [
  {
    id: "cr-1",
    name: "Anita Kumari",
    businessName: "Sanjeevani Pharmacy",
    email: "anita@sanjeevanipharmacy.example",
    phone: "+91 98765 43210",
    message: "Need a quote for 200 strips of Augpen 625 and 100 strips of Dolo 650 for next week's restock.",
    companySlug: "alkem-laboratories",
    status: "QUOTED",
    createdAt: "2026-06-28",
  },
  {
    id: "cr-2",
    name: "Dr. Manoj Singh",
    businessName: "Asha Nursing Home",
    email: "manoj@ashanursinghome.example",
    phone: "+91 91234 56780",
    message: "Looking to set up a standing monthly order for respiratory and cardiology medicines from Cipla.",
    companySlug: "cipla",
    status: "PENDING",
    createdAt: "2026-06-30",
  },
  {
    id: "cr-3",
    name: "Suresh Kumar",
    businessName: "Suresh Distribution Co.",
    email: "suresh@sureshdistribution.example",
    phone: "+91 99887 76655",
    message: "Interested in becoming a sub-distributor for Muzaffarpur district — please share partnership terms.",
    status: "PENDING",
    createdAt: "2026-07-01",
  },
  {
    id: "cr-4",
    name: "Priya Sharma",
    businessName: "Sharma Medical Store",
    email: "priya@sharmamedical.example",
    phone: "+91 90123 45678",
    message: "Requesting catalogue and pricing for diabetes-care medicines from USV Private Limited.",
    companySlug: "usv-private-limited",
    status: "APPROVED",
    createdAt: "2026-06-20",
  },
  {
    id: "cr-5",
    name: "Vikas Enterprises",
    businessName: "Vikas Enterprises",
    email: "vikas@vikasenterprises.example",
    phone: "+91 98123 45670",
    message: "Bulk enquiry for OTC vitamin supplements ahead of the monsoon season stocking cycle.",
    status: "REJECTED",
    createdAt: "2026-06-15",
  },
];

export function getContactRequests() {
  return contactRequests;
}
