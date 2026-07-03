export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  date: string;
  readTime: string;
  gradient: [string, string];
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-1",
    slug: "cold-chain-logistics-for-injectable-medicines",
    title: "Cold-chain logistics for injectable medicines: what retailers should ask their distributor",
    excerpt:
      "Temperature excursions during transit are one of the most common — and most preventable — causes of spoiled biologics and injectables. Here's what a properly run cold chain looks like.",
    content: [
      "Injectable biologics, insulin, and several vaccine lines require unbroken 2–8°C storage from the manufacturer's plant all the way to the retail counter. A single gap in that chain, even for a few hours during transit, can silently degrade a batch without any visible change in the packaging.",
      "When evaluating a distributor's cold-chain capability, ask three questions: do they use insulated, validated shipping containers with temperature loggers; do they have a documented excursion protocol that flags and quarantines affected stock automatically; and can they show you real logger data on request, not just a compliance certificate.",
      "At Shree Ram Medical Agency, every cold-chain shipment is dispatched with a temperature logger and handed over with a printed excursion report at delivery, so retail and hospital partners can verify chain-of-custody before the stock ever reaches the shelf.",
    ],
    category: "Operations",
    author: "Distribution Team",
    date: "2026-06-18",
    readTime: "5 min read",
    gradient: ["#00d9a333", "#00b38933"],
  },
  {
    id: "blog-2",
    slug: "understanding-gst-slabs-for-pharmaceutical-products",
    title: "Understanding GST slabs for pharmaceutical products: a quick reference for retail pharmacies",
    excerpt:
      "GST rates on medicines aren't uniform — life-saving drugs, formulations, and nutritional supplements each sit in different slabs. A wrong assumption here shows up directly in your margins.",
    content: [
      "Most branded formulations attract 12% GST, but a meaningful subset of life-saving and essential medicines are taxed at 5%, and several nutritional and wellness products fall under the standard 18% slab used for general consumer goods.",
      "The distinction matters most at the point of pricing and invoicing — a retailer who assumes a flat rate across their entire inventory will either under-collect tax on standard-rated items or over-price essential medicines relative to competitors.",
      "Every medicine listing in our catalogue displays its applicable GST rate alongside MRP and selling price, so retail partners can reconcile invoices without cross-checking a separate tax table.",
    ],
    category: "Compliance",
    author: "Compliance Desk",
    date: "2026-06-05",
    readTime: "4 min read",
    gradient: ["#3d5cff33", "#243fb833"],
  },
  {
    id: "blog-3",
    slug: "how-to-read-a-batch-certificate-of-analysis",
    title: "How to read a batch Certificate of Analysis before it reaches your shelf",
    excerpt:
      "A Certificate of Analysis (CoA) tells you far more than an expiry date — assay purity, dissolution rate, and microbial limits are all documented per batch. Here's what to check.",
    content: [
      "Every manufactured batch ships with a CoA confirming it meets the pharmacopeial specification it was tested against — typically IP, BP, or USP depending on the product and export market.",
      "The fields worth checking first are assay percentage (should sit within the specified range, not just 'pass'), dissolution or disintegration time for oral solids, and microbial limit results for any liquid or topical formulation.",
      "We retain the CoA for every batch we distribute and can share it on request for any hospital or institutional order — a standard part of due diligence for nursing home and hospital procurement teams.",
    ],
    category: "Quality",
    author: "Quality Assurance",
    date: "2026-05-22",
    readTime: "6 min read",
    gradient: ["#6ee7f233", "#2a9fb033"],
  },
  {
    id: "blog-4",
    slug: "onboarding-checklist-for-new-retail-pharmacy-partners",
    title: "The 5-step onboarding checklist for new retail pharmacy partners",
    excerpt:
      "From GST verification to your first order, here's exactly what happens between registering an account and receiving your first delivery.",
    content: [
      "Step one is document verification — a valid drug license, GST registration, and business PAN are checked against public registries before an account is activated.",
      "Step two is a short onboarding call to understand your typical order volume, preferred delivery window, and any cold-chain requirements specific to your pharmacy.",
      "From there, account activation, a starter catalogue tailored to your city's demand patterns, and your first order confirmation typically happen within 2 business days of submitting your registration.",
    ],
    category: "Partnership",
    author: "Partner Success",
    date: "2026-05-10",
    readTime: "3 min read",
    gradient: ["#00d9a333", "#3d5cff33"],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}
