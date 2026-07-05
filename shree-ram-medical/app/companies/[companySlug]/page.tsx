import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/shared/Button";
import { getCompanies, getCompanyBySlug } from "@/lib/data/companies";
import { getMedicinesByCompany } from "@/lib/data/medicines";
import styles from "./profile.module.css";

export async function generateStaticParams() {
  const companies = await getCompanies();
  return companies.map((c) => ({ companySlug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}): Promise<Metadata> {
  const { companySlug } = await params;
  const company = await getCompanyBySlug(companySlug);
  if (!company) return {};
  return {
    title: company.name,
    description: company.description,
  };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = await params;
  const company = await getCompanyBySlug(companySlug);
  if (!company) notFound();

  const brands = (await getMedicinesByCompany(company.slug)).slice(0, 8);
  const gradients: [string, string][] = [
    ["#00d9a333", "#00b38933"],
    ["#3d5cff33", "#243fb833"],
    ["#6ee7f233", "#2a9fb033"],
    ["#00d9a333", "#3d5cff33"],
  ];

  return (
    <>
      <div className="page-ambient" />
      <Navbar active="/companies" />
      <div className={styles.wrap}>
        <div className={styles.breadcrumb}>
          <Link href="/companies">Companies</Link>
          <span>/</span>
          <span className={styles.cur}>{company.name}</span>
        </div>

        <div className={styles.heroBanner}>
          <div className={styles.heroLeft}>
            <div
              className={styles.logoBig}
              style={{
                background: `linear-gradient(145deg, ${company.logoColors[0]}, ${company.logoColors[1]})`,
              }}
            >
              {company.logoInitials}
            </div>
            <div>
              <h1>{company.name}</h1>
              <div className={styles.tag}>
                {company.country} · {company.segment}
              </div>
            </div>
          </div>
          <div className={styles.heroActions}>
            <Button variant="primary" href={`/contact?company=${company.slug}`}>
              Download Catalogue
            </Button>
            <Button variant="ghost" href={`/contact?company=${company.slug}`}>
              Contact Company
            </Button>
          </div>
        </div>

        <div className={styles.quickStats}>
          <div className={styles.qsItem}>
            <div className={styles.v}>{company.foundedYear}</div>
            <div className={styles.k}>Founded</div>
          </div>
          <div className={styles.qsItem}>
            <div className={styles.v}>{company.productsListed.toLocaleString("en-IN")}</div>
            <div className={styles.k}>Products listed with us</div>
          </div>
          <div className={styles.qsItem}>
            <div className={styles.v}>{company.plants.length}</div>
            <div className={styles.k}>Manufacturing plants</div>
          </div>
          <div className={styles.qsItem}>
            <div className={styles.v}>{company.countriesServed}+</div>
            <div className={styles.k}>Countries served globally</div>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.secHead}>
            <span className={styles.kicker}>History &amp; Overview</span>
            <h2>Nine decades of pharmaceutical manufacturing</h2>
          </div>
          <div className={styles.overviewGrid}>
            <div className={styles.overviewText}>
              <p>{company.history}</p>
            </div>
            <div className={styles.timeline}>
              {company.timeline.map((t) => (
                <div className={styles.tItem} key={t.year}>
                  <div className={styles.yr}>{t.year}</div>
                  <div className={styles.desc}>{t.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.secHead}>
            <span className={styles.kicker}>Manufacturing</span>
            <h2>Manufacturing plants &amp; certifications</h2>
          </div>
          <div className={styles.plantGrid}>
            {company.plants.map((plant) => (
              <div className={styles.plantCard} key={plant.id}>
                <h3>{plant.name}</h3>
                <div className={styles.loc}>{plant.location}</div>
                <div className={styles.certs}>
                  {plant.certs.map((c) => (
                    <span className={styles.certTag} key={c}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.secHead}>
            <span className={styles.kicker}>Portfolio</span>
            <h2>Medicine categories</h2>
          </div>
          <div className={styles.catChips}>
            {company.categories.map((c) => (
              <span className={styles.catChip} key={c}>
                {c}
              </span>
            ))}
          </div>
        </section>

        {brands.length > 0 && (
          <section className={styles.section}>
            <div className={styles.secHead}>
              <span className={styles.kicker}>Brands</span>
              <h2>Popular brands we stock</h2>
            </div>
            <div className={styles.brandGrid}>
              {brands.map((m) => (
                <Link href={`/medicines/${m.slug}`} className={styles.brandCard} key={m.id}>
                  <div className={styles.bn}>{m.name}</div>
                  <div className={styles.bc}>{m.composition}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <div className={styles.secHead}>
            <span className={styles.kicker}>Gallery</span>
            <h2>Facility &amp; warehouse gallery</h2>
          </div>
          <div className={styles.galleryGrid}>
            {gradients.map(([a, b], i) => (
              <div
                className={styles.gTile}
                key={i}
                style={{ background: `linear-gradient(150deg, ${a}, ${b})` }}
              />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.contactCard}>
            <div className={styles.contactInfo}>
              <div>
                <b>Regional Office</b>
                {company.officeAddress}
              </div>
              <div>
                <b>Phone</b>
                {company.phone}
              </div>
              <div>
                <b>Email</b>
                {company.email}
              </div>
            </div>
            <Button variant="primary" href={`/contact?company=${company.slug}`}>
              Send Enquiry
            </Button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
