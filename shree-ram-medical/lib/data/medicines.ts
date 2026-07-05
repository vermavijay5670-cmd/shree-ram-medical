import type { Medicine } from "@/lib/types";
import { companies } from "@/lib/data/companies";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[.'()]/g, "")
    .replace(/\+/g, "and")
    .replace(/\s+/g, "-");
}

function companyFor(name: string) {
  const match = companies.find((c) => name.toLowerCase().includes(c.name.toLowerCase().split(" ")[0].toLowerCase()));
  return match?.slug ?? "cipla";
}

interface RawMedicine {
  name: string;
  comp: string;
  strength: string;
  pack: string;
  manufacturer: string;
  category: string;
  categoryName: string;
  rx: boolean;
  mrp: number;
  price: number;
  colors: [string, string];
  description: string;
  uses: string;
  dosage: string;
  contraindications: string;
  warnings: string[];
  sideEffects: string;
  interactions: string;
  storage: string;
}

const raw: RawMedicine[] = [
  {
    name: "Azithral 500",
    comp: "Azithromycin 500mg",
    strength: "500mg",
    pack: "Strip of 5 tablets",
    manufacturer: "Alembic Pharmaceuticals",
    category: "antibiotics",
    categoryName: "Antibiotics",
    rx: true,
    mrp: 118,
    price: 96,
    colors: ["#00d9a3", "#00b389"],
    description: "A macrolide antibiotic used against a broad range of bacterial infections, favoured for its short once-daily course.",
    uses: "Treats bacterial infections of the respiratory tract, ear, throat, skin and soft tissue, including community-acquired pneumonia and sinusitis.",
    dosage: "Typically one 500mg tablet once daily for 3 days, taken at least one hour before or two hours after food. Course length depends on the infection being treated.",
    contraindications: "Should not be used by patients with a known hypersensitivity to azithromycin or other macrolide antibiotics, or a history of cholestatic jaundice linked to prior use.",
    warnings: [
      "Use with caution in patients with existing liver or kidney impairment",
      "May prolong the QT interval in patients with existing heart rhythm conditions",
      "Complete the full course even if symptoms improve early",
    ],
    sideEffects: "Commonly reported effects include nausea, abdominal pain and diarrhoea. Rare but serious reactions such as severe allergic response should prompt immediate medical attention.",
    interactions: "May interact with antacids (reduced absorption if taken together), warfarin (increased bleeding risk) and certain antiarrhythmic medicines. Share a full medication list with the prescribing physician.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Augpen 625",
    comp: "Amoxicillin + Clavulanic Acid",
    strength: "625mg",
    pack: "Strip of 10 tablets",
    manufacturer: "Alkem Laboratories",
    category: "antibiotics",
    categoryName: "Antibiotics",
    rx: true,
    mrp: 210,
    price: 178,
    colors: ["#3d5cff", "#243fb8"],
    description: "A combination antibiotic used to treat bacterial infections of the respiratory tract, ear, sinus, skin, and urinary tract. The clavulanic acid component helps overcome certain forms of bacterial resistance to amoxicillin, widening the range of infections it can treat.",
    uses: "Treats bacterial infections of the respiratory tract, ear, sinus, skin, and urinary tract, including infections resistant to amoxicillin alone.",
    dosage: "Typically taken as one tablet every 12 hours, with a meal to reduce stomach upset. Course length and exact dosage should always follow the prescribing doctor's instructions.",
    contraindications: "Should not be used by patients with a known allergy to penicillin-class antibiotics, or with a history of liver problems linked to previous amoxicillin-clavulanate use.",
    warnings: ["Use with caution in patients with reduced kidney function","May affect the reliability of certain diabetic urine tests","Complete the full course even if symptoms improve early",],
    sideEffects: "Most commonly reported effects include nausea, diarrhoea, and mild skin rash. Rare but serious reactions such as severe allergic response or liver enzyme changes should prompt immediate medical attention.",
    interactions: "May interact with blood-thinning medication (increased bleeding risk) and allopurinol (higher chance of skin rash). Always share a full medication list with the prescribing physician.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Dolo 650",
    comp: "Paracetamol 650mg",
    strength: "650mg",
    pack: "Strip of 15 tablets",
    manufacturer: "Micro Labs",
    category: "pain",
    categoryName: "Pain Relief",
    rx: false,
    mrp: 35,
    price: 29,
    colors: ["#6ee7f2", "#2a9fb0"],
    description: "India's most widely stocked paracetamol brand, used for fever and mild-to-moderate pain across every retail counter in our network.",
    uses: "Relieves fever and mild-to-moderate pain including headache, body ache, toothache and post-vaccination discomfort.",
    dosage: "One tablet every 4–6 hours as needed, not exceeding 4 tablets (2600mg) in 24 hours, with or without food.",
    contraindications: "Should not be used by patients with severe liver disease or a known hypersensitivity to paracetamol.",
    warnings: [
      "Do not exceed the recommended dose — overdose can cause serious liver damage",
      "Avoid alcohol while taking this medicine",
      "Check other medicines for paracetamol content to avoid accidental double-dosing",
    ],
    sideEffects: "Generally well tolerated at recommended doses. Rare reactions include skin rash or blood disorders with prolonged high-dose use.",
    interactions: "May increase the effect of blood thinners like warfarin with prolonged regular use at high doses.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Combiflam",
    comp: "Ibuprofen + Paracetamol",
    strength: "400mg + 325mg",
    pack: "Strip of 20 tablets",
    manufacturer: "Sanofi India",
    category: "pain",
    categoryName: "Pain Relief",
    rx: false,
    mrp: 42,
    price: 37,
    colors: ["#ffb84d", "#c98328"],
    description: "A combination analgesic pairing an anti-inflammatory with paracetamol for stronger relief of moderate pain and fever.",
    uses: "Relieves moderate pain and inflammation including muscular pain, dental pain, menstrual cramps and post-operative pain.",
    dosage: "One tablet up to three times a day after food, not exceeding the course length advised by the prescriber.",
    contraindications: "Should not be used by patients with active peptic ulcer disease, severe heart failure, or known NSAID hypersensitivity.",
    warnings: [
      "Take with food to reduce the risk of stomach irritation",
      "Use with caution in patients with a history of asthma or kidney impairment",
      "Not recommended for extended use without medical supervision",
    ],
    sideEffects: "Commonly reported effects include heartburn, nausea and dizziness. Prolonged use can increase the risk of gastrointestinal bleeding.",
    interactions: "May interact with blood thinners, other NSAIDs, and certain blood pressure medicines.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Glycomet GP 1",
    comp: "Metformin + Glimepiride",
    strength: "500mg + 1mg",
    pack: "Strip of 10 tablets",
    manufacturer: "USV Private Limited",
    category: "diabetes",
    categoryName: "Diabetes",
    rx: true,
    mrp: 96,
    price: 82,
    colors: ["#00d9a3", "#3d5cff"],
    description: "A fixed-dose combination for type 2 diabetes, pairing an insulin-sensitiser with a sulfonylurea for tighter glucose control.",
    uses: "Manages blood sugar levels in type 2 diabetes when diet, exercise and single-agent therapy are not sufficient on their own.",
    dosage: "Typically one tablet daily with the first main meal, adjusted by the prescribing doctor based on blood sugar response.",
    contraindications: "Should not be used by patients with type 1 diabetes, diabetic ketoacidosis, or significant kidney or liver impairment.",
    warnings: [
      "Carries a risk of hypoglycemia — carry a fast-acting sugar source at all times",
      "Avoid alcohol, which increases the risk of low blood sugar",
      "Requires periodic kidney function monitoring",
    ],
    sideEffects: "Commonly reported effects include mild gastrointestinal upset, low blood sugar episodes, and metallic taste.",
    interactions: "May interact with other diabetes medicines, certain antibiotics, and alcohol.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Januvia 100",
    comp: "Sitagliptin 100mg",
    strength: "100mg",
    pack: "Strip of 10 tablets",
    manufacturer: "MSD Pharmaceuticals",
    category: "diabetes",
    categoryName: "Diabetes",
    rx: true,
    mrp: 645,
    price: 589,
    colors: ["#3d5cff", "#6ee7f2"],
    description: "A DPP-4 inhibitor used to manage type 2 diabetes with a low risk of hypoglycemia compared to older agents.",
    uses: "Manages blood sugar levels in type 2 diabetes, often prescribed alongside metformin.",
    dosage: "One 100mg tablet once daily, with or without food, as directed by the prescriber.",
    contraindications: "Should not be used by patients with type 1 diabetes or a history of pancreatitis.",
    warnings: [
      "Report persistent severe abdominal pain immediately — may indicate pancreatitis",
      "Dose adjustment required in patients with kidney impairment",
    ],
    sideEffects: "Commonly reported effects include upper respiratory infection symptoms, headache and mild nausea.",
    interactions: "May interact with other diabetes medicines, increasing the risk of low blood sugar when combined with sulfonylureas.",
    storage: "Store below 30°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Ecosprin 75",
    comp: "Aspirin 75mg",
    strength: "75mg",
    pack: "Strip of 14 tablets",
    manufacturer: "USV Private Limited",
    category: "cardiology",
    categoryName: "Cardiology",
    rx: false,
    mrp: 18,
    price: 15,
    colors: ["#00d9a3", "#243fb8"],
    description: "A low-dose aspirin widely prescribed for long-term cardiovascular protection.",
    uses: "Reduces the risk of heart attack and stroke in patients with existing cardiovascular disease, as directed by a physician.",
    dosage: "One 75mg tablet once daily, typically after food, as part of long-term cardiovascular therapy.",
    contraindications: "Should not be used by patients with active peptic ulcer disease, bleeding disorders, or known aspirin hypersensitivity.",
    warnings: [
      "Increases bleeding risk — inform any surgeon or dentist before a procedure",
      "Avoid combining with other NSAIDs without medical advice",
    ],
    sideEffects: "Commonly reported effects include mild stomach upset. Long-term use carries a small increased risk of gastrointestinal bleeding.",
    interactions: "May interact with blood thinners, other NSAIDs, and certain blood pressure medicines.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Telma 40",
    comp: "Telmisartan 40mg",
    strength: "40mg",
    pack: "Strip of 15 tablets",
    manufacturer: "Glenmark Pharmaceuticals",
    category: "cardiology",
    categoryName: "Cardiology",
    rx: true,
    mrp: 158,
    price: 134,
    colors: ["#6ee7f2", "#3d5cff"],
    description: "An angiotensin receptor blocker used for long-term management of high blood pressure.",
    uses: "Manages high blood pressure and reduces cardiovascular risk in patients with existing heart disease.",
    dosage: "One 40mg tablet once daily, with or without food, adjusted by the prescriber based on blood pressure response.",
    contraindications: "Should not be used during pregnancy or by patients with severe liver impairment.",
    warnings: [
      "Monitor blood pressure and kidney function periodically during treatment",
      "May cause dizziness — use caution when driving or operating machinery",
    ],
    sideEffects: "Commonly reported effects include dizziness, mild fatigue and back pain.",
    interactions: "May interact with potassium supplements, other blood pressure medicines, and lithium.",
    storage: "Store below 30°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Rosuvas 10",
    comp: "Rosuvastatin 10mg",
    strength: "10mg",
    pack: "Strip of 10 tablets",
    manufacturer: "Sun Pharma",
    category: "cardiology",
    categoryName: "Cardiology",
    rx: true,
    mrp: 112,
    price: 97,
    colors: ["#00d9a3", "#00b389"],
    description: "A statin used to lower LDL cholesterol and reduce long-term cardiovascular risk.",
    uses: "Manages high cholesterol and reduces the risk of heart attack and stroke in at-risk patients.",
    dosage: "One 10mg tablet once daily, at the same time each day, with or without food.",
    contraindications: "Should not be used by patients with active liver disease or during pregnancy.",
    warnings: [
      "Report unexplained muscle pain, tenderness or weakness immediately",
      "Periodic liver function monitoring is recommended",
    ],
    sideEffects: "Commonly reported effects include mild headache, muscle aches and gastrointestinal upset.",
    interactions: "May interact with certain antifungal medicines, cyclosporine, and grapefruit juice in large quantities.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Shelcal 500",
    comp: "Calcium + Vitamin D3",
    strength: "500mg",
    pack: "Strip of 15 tablets",
    manufacturer: "Torrent Pharmaceuticals",
    category: "vitamins",
    categoryName: "Vitamin Supplements",
    rx: false,
    mrp: 98,
    price: 84,
    colors: ["#3d5cff", "#00d9a3"],
    description: "A calcium and vitamin D3 supplement supporting bone health, one of the highest-volume OTC lines in our vitamins category.",
    uses: "Supports bone health and helps prevent calcium deficiency, particularly in older adults and during pregnancy or lactation.",
    dosage: "One tablet once or twice daily after food, or as advised by a physician.",
    contraindications: "Should not be used by patients with hypercalcemia or a history of calcium-containing kidney stones without medical advice.",
    warnings: [
      "Avoid taking alongside other calcium or vitamin D supplements without medical guidance",
      "Space dosing away from iron supplements and certain antibiotics",
    ],
    sideEffects: "Generally well tolerated. Mild constipation or bloating can occur.",
    interactions: "May reduce the absorption of tetracycline and quinolone antibiotics if taken at the same time.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Becosules Z",
    comp: "B-Complex + Zinc",
    strength: "—",
    pack: "Bottle of 20 capsules",
    manufacturer: "Pfizer Limited",
    category: "vitamins",
    categoryName: "Vitamin Supplements",
    rx: false,
    mrp: 45,
    price: 39,
    colors: ["#00d9a3", "#6ee7f2"],
    description: "A B-complex and zinc supplement used to address common dietary deficiencies and support immune function.",
    uses: "Supports general nutritional health and helps address B-vitamin and zinc deficiencies.",
    dosage: "One capsule daily after food, or as advised by a physician.",
    contraindications: "No significant contraindications for the general population at recommended doses.",
    warnings: ["May cause bright yellow urine — a harmless effect of riboflavin content"],
    sideEffects: "Generally well tolerated. Mild stomach upset can occur if taken on an empty stomach.",
    interactions: "Minimal known interactions at standard supplement doses.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Neurobion Forte",
    comp: "Vitamin B1, B6, B12",
    strength: "—",
    pack: "Strip of 30 tablets",
    manufacturer: "Procter & Gamble Health",
    category: "vitamins",
    categoryName: "Vitamin Supplements",
    rx: false,
    mrp: 52,
    price: 45,
    colors: ["#6ee7f2", "#00b389"],
    description: "A high-strength neurotropic vitamin B combination widely used to support nerve health.",
    uses: "Supports nerve health and helps address vitamin B1, B6 and B12 deficiencies, including in diabetic neuropathy.",
    dosage: "One tablet daily after food, or as advised by a physician.",
    contraindications: "No significant contraindications for the general population at recommended doses.",
    warnings: ["Long-term high-dose B6 use should be medically supervised"],
    sideEffects: "Generally well tolerated. Rare mild allergic skin reactions have been reported.",
    interactions: "May reduce the effectiveness of levodopa when taken without a decarboxylase inhibitor.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Asthalin Inhaler",
    comp: "Salbutamol 100mcg",
    strength: "100mcg",
    pack: "Inhaler, 200 doses",
    manufacturer: "Cipla",
    category: "respiratory",
    categoryName: "Respiratory",
    rx: true,
    mrp: 135,
    price: 118,
    colors: ["#00d9a3", "#3d5cff"],
    description: "A fast-acting bronchodilator inhaler used for immediate relief of asthma and COPD symptoms.",
    uses: "Provides quick relief from wheezing, breathlessness and chest tightness in asthma and COPD.",
    dosage: "One to two puffs as needed for symptom relief, or before exercise, not exceeding the maximum daily doses advised by the prescriber.",
    contraindications: "Should not be used by patients with a known hypersensitivity to salbutamol.",
    warnings: [
      "Overuse may indicate poorly controlled asthma — consult a doctor if relief is needed more than usual",
      "Use with caution in patients with existing heart rhythm conditions",
    ],
    sideEffects: "Commonly reported effects include mild tremor, fast heartbeat and headache.",
    interactions: "May interact with beta-blockers, which can reduce its effectiveness.",
    storage: "Store below 30°C, away from direct heat and sunlight. Do not puncture or burn the canister.",
  },
  {
    name: "Foracort 200",
    comp: "Budesonide + Formoterol",
    strength: "200mcg",
    pack: "Rotacaps, 10 caps",
    manufacturer: "Cipla",
    category: "respiratory",
    categoryName: "Respiratory",
    rx: true,
    mrp: 245,
    price: 212,
    colors: ["#3d5cff", "#00b389"],
    description: "A combination inhaled corticosteroid and long-acting bronchodilator for daily asthma and COPD control.",
    uses: "Provides maintenance control of asthma and COPD symptoms, reducing inflammation and keeping airways open.",
    dosage: "One rotacap inhaled twice daily using the rotahaler device, or as directed by the prescriber. Not intended for acute symptom relief.",
    contraindications: "Should not be used as a rescue inhaler for sudden breathlessness — a fast-acting bronchodilator should be used instead.",
    warnings: [
      "Rinse the mouth after use to reduce the risk of oral thrush",
      "Do not stop use abruptly without medical guidance",
    ],
    sideEffects: "Commonly reported effects include throat irritation, hoarseness and mild headache.",
    interactions: "May interact with beta-blockers and certain antifungal medicines.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Montair LC",
    comp: "Montelukast + Levocetirizine",
    strength: "10mg + 5mg",
    pack: "Strip of 10 tablets",
    manufacturer: "Cipla",
    category: "respiratory",
    categoryName: "Respiratory",
    rx: true,
    mrp: 168,
    price: 143,
    colors: ["#6ee7f2", "#243fb8"],
    description: "A combination allergy and asthma-support tablet pairing a leukotriene receptor antagonist with an antihistamine.",
    uses: "Manages allergic rhinitis symptoms and provides adjunct control of mild asthma.",
    dosage: "One tablet once daily in the evening, with or without food.",
    contraindications: "Should not be used by patients with a known hypersensitivity to montelukast or levocetirizine.",
    warnings: [
      "May cause drowsiness — use caution when driving or operating machinery",
      "Report any mood or behavioural changes to the prescriber",
    ],
    sideEffects: "Commonly reported effects include drowsiness, dry mouth and mild headache.",
    interactions: "May enhance the sedative effect of alcohol and other CNS depressants.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
  {
    name: "Zerodol-SP",
    comp: "Aceclofenac + Paracetamol + Serratiopeptidase",
    strength: "100mg + 325mg + 15mg",
    pack: "Strip of 10 tablets",
    manufacturer: "Ipca Laboratories",
    category: "pain",
    categoryName: "Pain Relief",
    rx: true,
    mrp: 88,
    price: 75,
    colors: ["#00d9a3", "#00b389"],
    description: "A triple-action anti-inflammatory, analgesic and anti-swelling combination used for moderate pain with inflammation.",
    uses: "Relieves pain, inflammation and swelling in musculoskeletal conditions, post-operative pain and orthopedic injuries.",
    dosage: "One tablet twice daily after food, for the duration advised by the prescriber.",
    contraindications: "Should not be used by patients with active peptic ulcer disease or known NSAID hypersensitivity.",
    warnings: [
      "Take with food to reduce the risk of stomach irritation",
      "Not recommended for extended use without medical supervision",
    ],
    sideEffects: "Commonly reported effects include heartburn, nausea and mild dizziness.",
    interactions: "May interact with blood thinners, other NSAIDs, and certain blood pressure medicines.",
    storage: "Store below 25°C in a cool, dry place away from direct sunlight. Keep out of reach of children.",
  },
];

export const sampleMedicines: Medicine[] = raw.map((m, i) => ({
  id: `medicine-${i + 1}`,
  slug: slugify(m.name),
  name: m.name,
  composition: m.comp,
  strength: m.strength,
  packaging: m.pack,
  colors: m.colors,
  companySlug: companyFor(m.manufacturer),
  companyName: m.manufacturer,
  categorySlug: m.category,
  categoryName: m.categoryName,
  mrp: m.mrp,
  sellingPrice: m.price,
  gstRate: 12,
  prescriptionRequired: m.rx,
  description: m.description,
  uses: m.uses,
  dosage: m.dosage,
  contraindications: m.contraindications,
  warnings: m.warnings,
  sideEffects: m.sideEffects,
  interactions: m.interactions,
  storage: m.storage,
}));

// Kept for code not yet migrated to the async getters below.
export const medicines = sampleMedicines;

function rowToMedicine(row: {
  id: string;
  name: string;
  slug: string;
  composition: string;
  strength: string;
  packaging: string;
  colorFrom: string;
  colorTo: string;
  company: { slug: string; name: string };
  category: { slug: string; name: string };
  mrp: unknown;
  sellingPrice: unknown;
  gstRate: unknown;
  prescriptionRequired: boolean;
  description: string;
  uses: string;
  dosage: string;
  contraindications: string;
  warnings: string[];
  sideEffects: string;
  interactions: string;
  storage: string;
}): Medicine {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    composition: row.composition,
    strength: row.strength,
    packaging: row.packaging,
    colors: [row.colorFrom, row.colorTo],
    companySlug: row.company.slug,
    companyName: row.company.name,
    categorySlug: row.category.slug,
    categoryName: row.category.name,
    mrp: Number(row.mrp),
    sellingPrice: Number(row.sellingPrice),
    gstRate: Number(row.gstRate),
    prescriptionRequired: row.prescriptionRequired,
    description: row.description,
    uses: row.uses,
    dosage: row.dosage,
    contraindications: row.contraindications,
    warnings: row.warnings,
    sideEffects: row.sideEffects,
    interactions: row.interactions,
    storage: row.storage,
  };
}

const medicineInclude = { company: true, category: true } as const;

export async function getMedicines(): Promise<Medicine[]> {
  if (!isDatabaseConfigured()) return sampleMedicines;
  const rows = await prisma.medicine.findMany({ include: medicineInclude, orderBy: { name: "asc" } });
  return rows.map(rowToMedicine);
}

export async function getMedicineBySlug(slug: string): Promise<Medicine | null> {
  if (!isDatabaseConfigured()) {
    return sampleMedicines.find((m) => m.slug === slug) ?? null;
  }
  const row = await prisma.medicine.findUnique({ where: { slug }, include: medicineInclude });
  return row ? rowToMedicine(row) : null;
}

export async function getRelatedMedicines(medicine: Medicine, limit = 4): Promise<Medicine[]> {
  if (!isDatabaseConfigured()) {
    return sampleMedicines
      .filter(
        (m) =>
          m.slug !== medicine.slug &&
          (m.categorySlug === medicine.categorySlug || m.companySlug === medicine.companySlug)
      )
      .slice(0, limit);
  }
  const rows = await prisma.medicine.findMany({
    where: {
      slug: { not: medicine.slug },
      OR: [{ category: { slug: medicine.categorySlug } }, { company: { slug: medicine.companySlug } }],
    },
    include: medicineInclude,
    take: limit,
  });
  return rows.map(rowToMedicine);
}

export async function getMedicinesByCompany(companySlug: string): Promise<Medicine[]> {
  if (!isDatabaseConfigured()) {
    return sampleMedicines.filter((m) => m.companySlug === companySlug);
  }
  const rows = await prisma.medicine.findMany({
    where: { company: { slug: companySlug } },
    include: medicineInclude,
  });
  return rows.map(rowToMedicine);
}

export async function getMedicinesByCategory(categorySlug: string): Promise<Medicine[]> {
  if (!isDatabaseConfigured()) {
    return sampleMedicines.filter((m) => m.categorySlug === categorySlug);
  }
  const rows = await prisma.medicine.findMany({
    where: { category: { slug: categorySlug } },
    include: medicineInclude,
  });
  return rows.map(rowToMedicine);
}
