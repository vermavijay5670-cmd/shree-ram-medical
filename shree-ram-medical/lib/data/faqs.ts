export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: "Ordering" | "Delivery" | "Partnership" | "Compliance";
}

export const faqs: Faq[] = [
  {
    id: "faq-1",
    category: "Ordering",
    question: "How do I place a bulk order with Shree Ram Medical Agency?",
    answer:
      "Browse our companies or medicines catalogue, add the items you need to a quote request, and submit it through the enquiry form. Our order desk responds with confirmed pricing and availability within one business day.",
  },
  {
    id: "faq-2",
    category: "Ordering",
    question: "Is there a minimum order quantity?",
    answer:
      "Most SKUs ship in standard strip, box or case units. Retail pharmacies can order in small case quantities; hospitals and nursing homes placing recurring bulk orders get preferential case pricing.",
  },
  {
    id: "faq-3",
    category: "Delivery",
    question: "Which cities and regions do you currently serve?",
    answer:
      "We operate warehouses in Patna, Gaya and Muzaffarpur and deliver to retail pharmacies, hospitals and clinics across 50+ cities in the region, with same-week fulfilment on most in-stock items.",
  },
  {
    id: "faq-4",
    category: "Delivery",
    question: "How is cold-chain and temperature-sensitive stock handled?",
    answer:
      "Injectables and biologics requiring cold storage are packed and dispatched through a dedicated cold-chain route with insulated packaging and temperature logging until handover at your premises.",
  },
  {
    id: "faq-5",
    category: "Partnership",
    question: "How do I register my pharmacy or hospital as a partner?",
    answer:
      "Use the Register link in the footer to create a partner account. You'll need your GST number and business registration details; our onboarding team verifies new accounts within 1–2 business days.",
  },
  {
    id: "faq-6",
    category: "Partnership",
    question: "Can manufacturers apply to distribute through your network?",
    answer:
      "Yes — we're always evaluating new manufacturing partners. Reach out through the Contact page with your product portfolio and manufacturing certifications and our procurement team will follow up.",
  },
  {
    id: "faq-7",
    category: "Compliance",
    question: "Are your suppliers WHO-GMP or equivalent certified?",
    answer:
      "Every manufacturing partner listed in our companies directory holds WHO-GMP certification at minimum, with many plants additionally certified by USFDA, EU-GMP or TGA Australia — visible on each company's profile page.",
  },
  {
    id: "faq-8",
    category: "Compliance",
    question: "How do you handle batch recalls or expiry management?",
    answer:
      "Every batch is tracked from warehouse receipt to dispatch with batch number and expiry date. Our inventory system flags stock expiring within 60 days, and recall notices from manufacturers are actioned within 24 hours.",
  },
];

export function getFaqsByCategory(category: Faq["category"]) {
  return faqs.filter((f) => f.category === category);
}
