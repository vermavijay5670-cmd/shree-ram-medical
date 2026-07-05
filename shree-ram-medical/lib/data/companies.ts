import type { Company } from "@/lib/types";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[.'()]/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(
      (w) =>
        !/^(pharma|pharmaceuticals?|laboratories|labs|lifesciences|limited|india|biologics|private)$/i.test(
          w
        )
    )
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// Base roster — mirrors shree-ram-medical-companies.html exactly (names, segment,
// country, founding year, product counts, tags, accent colors).
const roster: Omit<
  Company,
  | "id"
  | "slug"
  | "logoInitials"
  | "history"
  | "timeline"
  | "plants"
  | "categories"
  | "officeAddress"
  | "phone"
  | "email"
  | "website"
  | "countriesServed"
>[] = [
  { name: "Cipla", segment: "Respiratory & Cardiology", country: "India", foundedYear: 1935, productsListed: 1240, tags: ["domestic", "popular", "tablets", "prescription"], logoColors: ["#00d9a3", "#00b389"], isDomestic: true, isPopular: true, description: "Distributing respiratory & cardiology medicines through our verified retail and hospital network across India." },
  { name: "Sun Pharma", segment: "Multi-specialty Generics", country: "India", foundedYear: 1983, productsListed: 2100, tags: ["domestic", "popular", "tablets", "injectables"], logoColors: ["#3d5cff", "#243fb8"], isDomestic: true, isPopular: true, description: "Distributing multi-specialty generics through our verified retail and hospital network across India." },
  { name: "Dr. Reddy's Labs", segment: "Oncology & Generics", country: "India", foundedYear: 1984, productsListed: 980, tags: ["domestic", "popular", "injectables", "prescription"], logoColors: ["#6ee7f2", "#2a9fb0"], isDomestic: true, isPopular: true, description: "Distributing oncology & generic medicines through our verified retail and hospital network across India." },
  { name: "Zydus Lifesciences", segment: "Cardiology & Diabetes", country: "India", foundedYear: 1952, productsListed: 1560, tags: ["domestic", "tablets", "otc"], logoColors: ["#00d9a3", "#3d5cff"], isDomestic: true, isPopular: false, description: "Distributing cardiology & diabetes medicines through our verified retail and hospital network across India." },
  { name: "Mankind Pharma", segment: "Consumer Healthcare", country: "India", foundedYear: 1995, productsListed: 870, tags: ["domestic", "popular", "otc", "tablets"], logoColors: ["#3d5cff", "#6ee7f2"], isDomestic: true, isPopular: true, description: "Distributing consumer healthcare products through our verified retail and hospital network across India." },
  { name: "Alkem Laboratories", segment: "Anti-infectives", country: "India", foundedYear: 1973, productsListed: 640, tags: ["domestic", "tablets", "prescription"], logoColors: ["#00d9a3", "#243fb8"], isDomestic: true, isPopular: false, description: "Distributing anti-infective medicines through our verified retail and hospital network across India." },
  { name: "Lupin Limited", segment: "Respiratory & Anti-TB", country: "India", foundedYear: 1968, productsListed: 1120, tags: ["domestic", "popular", "injectables"], logoColors: ["#6ee7f2", "#00b389"], isDomestic: true, isPopular: true, description: "Distributing respiratory & anti-TB medicines through our verified retail and hospital network across India." },
  { name: "Torrent Pharmaceuticals", segment: "Cardiology & CNS", country: "India", foundedYear: 1959, productsListed: 540, tags: ["domestic", "tablets", "prescription"], logoColors: ["#3d5cff", "#00d9a3"], isDomestic: true, isPopular: false, description: "Distributing cardiology & CNS medicines through our verified retail and hospital network across India." },
  { name: "Intas Pharmaceuticals", segment: "Biosimilars & Oncology", country: "India", foundedYear: 1985, productsListed: 710, tags: ["domestic", "injectables", "prescription"], logoColors: ["#00d9a3", "#6ee7f2"], isDomestic: true, isPopular: false, description: "Distributing biosimilars & oncology medicines through our verified retail and hospital network across India." },
  { name: "Glenmark Pharmaceuticals", segment: "Dermatology & Respiratory", country: "India", foundedYear: 1977, productsListed: 480, tags: ["domestic", "tablets", "otc"], logoColors: ["#6ee7f2", "#3d5cff"], isDomestic: true, isPopular: false, description: "Distributing dermatology & respiratory medicines through our verified retail and hospital network across India." },
  { name: "Abbott India", segment: "Women's Health & Nutrition", country: "United States", foundedYear: 1944, productsListed: 390, tags: ["international", "popular", "otc"], logoColors: ["#3d5cff", "#6ee7f2"], isDomestic: false, isPopular: true, description: "Distributing women's health & nutrition products through our verified retail and hospital network across India." },
  { name: "GSK Pharmaceuticals", segment: "Vaccines & Respiratory", country: "United Kingdom", foundedYear: 1929, productsListed: 310, tags: ["international", "injectables", "prescription"], logoColors: ["#00d9a3", "#243fb8"], isDomestic: false, isPopular: false, description: "Distributing vaccines & respiratory medicines through our verified retail and hospital network across India." },
  { name: "Micro Labs", segment: "Cardiology & Ophthalmology", country: "India", foundedYear: 1973, productsListed: 520, tags: ["domestic", "tablets"], logoColors: ["#6ee7f2", "#00b389"], isDomestic: true, isPopular: false, description: "Distributing cardiology & ophthalmology medicines through our verified retail and hospital network across India." },
  { name: "USV Private Limited", segment: "Diabetes Care", country: "India", foundedYear: 1961, productsListed: 280, tags: ["domestic", "tablets", "prescription"], logoColors: ["#00d9a3", "#3d5cff"], isDomestic: true, isPopular: false, description: "Distributing diabetes care medicines through our verified retail and hospital network across India." },
  { name: "Ipca Laboratories", segment: "Antimalarials & Pain Management", country: "India", foundedYear: 1949, productsListed: 460, tags: ["domestic", "tablets", "otc"], logoColors: ["#3d5cff", "#00d9a3"], isDomestic: true, isPopular: false, description: "Distributing antimalarials & pain management medicines through our verified retail and hospital network across India." },
  { name: "Emcure Pharmaceuticals", segment: "Gynecology & Oncology", country: "India", foundedYear: 1981, productsListed: 610, tags: ["domestic", "injectables", "prescription"], logoColors: ["#6ee7f2", "#243fb8"], isDomestic: true, isPopular: false, description: "Distributing gynecology & oncology medicines through our verified retail and hospital network across India." },
  { name: "Biocon Biologics", segment: "Biosimilars & Diabetes", country: "India", foundedYear: 1978, productsListed: 190, tags: ["domestic", "injectables"], logoColors: ["#00d9a3", "#6ee7f2"], isDomestic: true, isPopular: false, description: "Distributing biosimilars & diabetes medicines through our verified retail and hospital network across India." },
  { name: "Macleods Pharmaceuticals", segment: "Anti-infectives & Cardiology", country: "India", foundedYear: 1989, productsListed: 730, tags: ["domestic", "popular", "tablets"], logoColors: ["#3d5cff", "#00b389"], isDomestic: true, isPopular: true, description: "Distributing anti-infectives & cardiology medicines through our verified retail and hospital network across India." },
  // Additional manufacturers carried in our medicines catalogue — not part of
  // the original 18-company "featured partners" set, but real, named
  // manufacturers whose products we stock (see lib/data/medicines.ts).
  { name: "Alembic Pharmaceuticals", segment: "Antibiotics & Anti-infectives", country: "India", foundedYear: 1907, productsListed: 410, tags: ["domestic", "tablets", "prescription"], logoColors: ["#00d9a3", "#00b389"], isDomestic: true, isPopular: false, description: "Distributing antibiotics & anti-infective medicines through our verified retail and hospital network across India." },
  { name: "Sanofi India", segment: "Pain Management & Consumer Health", country: "France", foundedYear: 1956, productsListed: 260, tags: ["international", "otc", "tablets"], logoColors: ["#ffb84d", "#c98328"], isDomestic: false, isPopular: false, description: "Distributing pain management & consumer health products through our verified retail and hospital network across India." },
  { name: "MSD Pharmaceuticals", segment: "Diabetology & Vaccines", country: "United States", foundedYear: 1891, productsListed: 220, tags: ["international", "tablets", "prescription"], logoColors: ["#3d5cff", "#6ee7f2"], isDomestic: false, isPopular: false, description: "Distributing diabetology & vaccine products through our verified retail and hospital network across India." },
  { name: "Pfizer Limited", segment: "Vitamin Supplements & Consumer Health", country: "United States", foundedYear: 1849, productsListed: 340, tags: ["international", "otc"], logoColors: ["#00d9a3", "#6ee7f2"], isDomestic: false, isPopular: false, description: "Distributing vitamin supplements & consumer health products through our verified retail and hospital network across India." },
  { name: "Procter & Gamble Health", segment: "Vitamin Supplements & OTC", country: "United States", foundedYear: 1837, productsListed: 190, tags: ["international", "otc"], logoColors: ["#6ee7f2", "#00b389"], isDomestic: false, isPopular: false, description: "Distributing vitamin supplements & OTC products through our verified retail and hospital network across India." },
];

// Full curated profile detail for flagship partners (matches / extends
// shree-ram-medical-company-profile.html for Cipla; others follow the same
// depth so their profile pages are equally real, not placeholders).
const profileDetail: Record<
  string,
  Pick<
    Company,
    | "history"
    | "timeline"
    | "plants"
    | "categories"
    | "officeAddress"
    | "phone"
    | "email"
    | "website"
    | "countriesServed"
  >
> = {
  cipla: {
    history:
      "Cipla Limited is one of India's most established pharmaceutical manufacturers, known globally for pioneering affordable access to essential medicines, particularly in respiratory and anti-infective care. We have partnered with Cipla for over a decade, distributing their respiratory and cardiology portfolio to retail pharmacies, hospitals, and clinics across our network. Their manufacturing facilities are certified by major international regulatory bodies, giving our retail and hospital partners confidence in every batch that ships through our warehouses.",
    timeline: [
      { year: "1935", description: "Founded in Mumbai as The Chemical, Industrial & Pharmaceutical Laboratories" },
      { year: "1994", description: "Became a leading global player in respiratory therapeutics" },
      { year: "2001", description: "Expanded into anti-retroviral and generic medicine access programs" },
      { year: "2015", description: "Became our exclusive respiratory-care distribution partner for the region" },
    ],
    plants: [
      { id: "cipla-p1", name: "Kurkumbh Plant", location: "Maharashtra, India", certs: ["WHO-GMP", "USFDA"] },
      { id: "cipla-p2", name: "Goa Formulations Unit", location: "Goa, India", certs: ["WHO-GMP", "EU-GMP"] },
      { id: "cipla-p3", name: "Indore SEZ Facility", location: "Madhya Pradesh, India", certs: ["USFDA", "TGA Australia"] },
    ],
    categories: ["Respiratory", "Cardiology", "Anti-infectives", "Urology", "Oncology", "Dermatology", "CNS & Neurology"],
    officeAddress: "Cipla House, Peninsula Business Park, Mumbai",
    phone: "+91 22 2482 6000",
    email: "partnerships@cipla-demo.example",
    website: "https://www.cipla.com",
    countriesServed: 80,
  },
  "sun-pharma": {
    history:
      "Sun Pharmaceutical Industries is India's largest pharmaceutical company by revenue, manufacturing across specialty and generic formulations spanning cardiology, psychiatry, neurology, diabetology and oncology. Our warehouses carry a wide slice of their generic tablet and injectable range, making them one of our highest-volume manufacturing partners.",
    timeline: [
      { year: "1983", description: "Founded in Vapi, Gujarat with five psychiatric drug brands" },
      { year: "1997", description: "Listed as one of India's fastest-growing pharmaceutical companies" },
      { year: "2014", description: "Became India's largest pharmaceutical company following the Ranbaxy merger" },
      { year: "2018", description: "Became a core generics and injectables distribution partner for our network" },
    ],
    plants: [
      { id: "sun-p1", name: "Halol Manufacturing Unit", location: "Gujarat, India", certs: ["USFDA", "WHO-GMP"] },
      { id: "sun-p2", name: "Dadra Formulations Plant", location: "Dadra & Nagar Haveli, India", certs: ["WHO-GMP"] },
      { id: "sun-p3", name: "Mohali Injectables Facility", location: "Punjab, India", certs: ["USFDA", "EU-GMP"] },
    ],
    categories: ["Cardiology", "Psychiatry", "Neurology", "Diabetology", "Oncology", "Ophthalmology"],
    officeAddress: "Sun House, CTS No. 201 B/1, Western Express Highway, Mumbai",
    phone: "+91 22 4324 4324",
    email: "partnerships@sunpharma-demo.example",
    website: "https://www.sunpharma.com",
    countriesServed: 100,
  },
  "dr-reddys-labs": {
    history:
      "Dr. Reddy's Laboratories built its reputation on affordable oncology generics and complex injectables, backed by one of India's most active in-house R&D pipelines. We distribute their oncology and generic injectable lines to hospital and nursing-home partners who need reliable, cold-chain-ready supply.",
    timeline: [
      { year: "1984", description: "Founded in Hyderabad by Dr. Anji Reddy" },
      { year: "1986", description: "Launched India's first indigenously developed bulk drug, norfloxacin" },
      { year: "2001", description: "Became the first Asia-Pacific pharma company listed on the NYSE" },
      { year: "2019", description: "Expanded our hospital-channel oncology distribution agreement" },
    ],
    plants: [
      { id: "drl-p1", name: "Bachupally Formulations Unit", location: "Telangana, India", certs: ["USFDA", "WHO-GMP"] },
      { id: "drl-p2", name: "Duvvada Oncology Facility", location: "Andhra Pradesh, India", certs: ["EU-GMP"] },
    ],
    categories: ["Oncology", "Generics", "Gastroenterology", "Pain Management", "Vaccines"],
    officeAddress: "8-2-337, Road No. 3, Banjara Hills, Hyderabad",
    phone: "+91 40 4900 2900",
    email: "partnerships@drreddys-demo.example",
    website: "https://www.drreddys.com",
    countriesServed: 66,
  },
  "mankind-pharma": {
    history:
      "Mankind Pharma grew rapidly on the strength of its consumer healthcare and OTC brands, becoming a household name in Indian retail pharmacies. Their fast-moving OTC and tablet range makes up a meaningful share of our retail-partner order volume, especially outside metro markets.",
    timeline: [
      { year: "1995", description: "Founded with a focus on affordable, mass-market formulations" },
      { year: "2007", description: "Manforce and Prega News became category-leading consumer brands" },
      { year: "2021", description: "Listed among India's top five pharmaceutical companies by domestic sales" },
      { year: "2022", description: "Became our leading OTC and consumer-healthcare distribution partner" },
    ],
    plants: [
      { id: "mkp-p1", name: "Paonta Sahib Unit", location: "Himachal Pradesh, India", certs: ["WHO-GMP"] },
      { id: "mkp-p2", name: "Sikkim Formulations Plant", location: "Sikkim, India", certs: ["WHO-GMP"] },
    ],
    categories: ["OTC & Consumer Health", "Anti-infectives", "Cardiology", "Gastroenterology"],
    officeAddress: "208, Okhla Industrial Estate Phase III, New Delhi",
    phone: "+91 11 4769 6999",
    email: "partnerships@mankind-demo.example",
    website: "https://www.mankindpharma.com",
    countriesServed: 25,
  },
};

function fallbackDetail(base: { name: string; segment: string; foundedYear: number; country: string; tags: string[] }): Pick<
  Company,
  "history" | "timeline" | "plants" | "categories" | "officeAddress" | "phone" | "email" | "website" | "countriesServed"
> {
  const slug = slugify(base.name);
  const categories = base.segment.split(" & ").flatMap((s) => s.split(" and "));
  return {
    history: `${base.name} has supplied ${base.segment.toLowerCase()} formulations to our distribution network since we onboarded them as a manufacturing partner. We stock their tablet, capsule and injectable lines across our regional warehouses and route orders to retail pharmacies, hospitals and nursing homes on a same-week fulfilment cycle.`,
    timeline: [
      { year: String(base.foundedYear), description: `${base.name} founded in ${base.country}` },
      { year: String(base.foundedYear + 40 > 2024 ? 2019 : base.foundedYear + 40), description: `Expanded into ${base.segment.toLowerCase()} as a core therapy area` },
      { year: "2020", description: "Onboarded as a verified manufacturing partner in our network" },
    ],
    plants: [
      { id: `${slug}-p1`, name: `${base.name.split(" ")[0]} Manufacturing Unit`, location: base.country === "India" ? "Gujarat, India" : base.country, certs: base.tags.includes("injectables") ? ["WHO-GMP", "EU-GMP"] : ["WHO-GMP"] },
    ],
    categories: categories.length ? categories : [base.segment],
    officeAddress: `Corporate Office, ${base.country}`,
    phone: "+91 22 4000 0000",
    email: `partnerships@${slug}-demo.example`,
    website: undefined,
    countriesServed: base.tags.includes("international") ? 30 : 12,
  };
}

export const sampleCompanies: Company[] = roster.map((c, i) => {
  const slug = slugify(c.name);
  const detail = profileDetail[slug] ?? fallbackDetail(c);
  return {
    id: `company-${i + 1}`,
    slug,
    logoInitials: initials(c.name),
    ...c,
    ...detail,
  };
});

// Kept for code not yet migrated to the async getters below (client
// components rendering the sample set synchronously).
export const companies = sampleCompanies;

function rowToCompany(row: {
  id: string;
  name: string;
  slug: string;
  description: string;
  history: string | null;
  website: string | null;
  country: string;
  foundedYear: number;
  segment: string;
  isDomestic: boolean;
  isPopular: boolean;
  logoColorFrom: string;
  logoColorTo: string;
  productsListed: number;
  countriesServed: number;
  tags: string[];
  categories: string[];
  timeline: unknown;
  officeAddress: string | null;
  phone: string | null;
  email: string | null;
  plants: { id: string; name: string; location: string; certs: string[] }[];
}): Company {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoInitials: initials(row.name),
    logoColors: [row.logoColorFrom, row.logoColorTo],
    description: row.description,
    history: row.history ?? "",
    timeline: Array.isArray(row.timeline) ? (row.timeline as { year: string; description: string }[]) : [],
    website: row.website ?? undefined,
    country: row.country,
    foundedYear: row.foundedYear,
    segment: row.segment,
    isDomestic: row.isDomestic,
    isPopular: row.isPopular,
    productsListed: row.productsListed,
    countriesServed: row.countriesServed,
    tags: row.tags,
    plants: row.plants,
    categories: row.categories,
    officeAddress: row.officeAddress ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
  };
}

export async function getCompanies(): Promise<Company[]> {
  if (!isDatabaseConfigured()) return sampleCompanies;
  const rows = await prisma.company.findMany({
    include: { plants: true },
    orderBy: { name: "asc" },
  });
  return rows.map(rowToCompany);
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  if (!isDatabaseConfigured()) {
    return sampleCompanies.find((c) => c.slug === slug) ?? null;
  }
  const row = await prisma.company.findUnique({
    where: { slug },
    include: { plants: true },
  });
  return row ? rowToCompany(row) : null;
}

export async function getPopularCompanies(limit = 6): Promise<Company[]> {
  if (!isDatabaseConfigured()) {
    return sampleCompanies.filter((c) => c.isPopular).slice(0, limit);
  }
  const rows = await prisma.company.findMany({
    where: { isPopular: true },
    include: { plants: true },
    orderBy: { name: "asc" },
    take: limit,
  });
  return rows.map(rowToCompany);
}
