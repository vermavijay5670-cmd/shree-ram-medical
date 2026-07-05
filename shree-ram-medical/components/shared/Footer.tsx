import Link from "next/link";
import { BrandMark } from "@/components/shared/BrandMark";
import styles from "./Footer.module.css";

const columns = [
  {
    title: "Catalogue",
    links: [
      { href: "/companies", label: "Companies" },
      { href: "/medicines", label: "Medicines" },
      { href: "/categories", label: "Categories" },
      { href: "/gallery", label: "Gallery" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/services", label: "Services" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Partners",
    links: [
      { href: "/login", label: "Partner login" },
      { href: "/register", label: "Register your pharmacy" },
      { href: "/faq", label: "FAQ" },
      { href: "/portal/dashboard", label: "Client portal" },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandCol}>
          <div className={styles.brand}>
            <BrandMark size={28} />
            Shree Ram Medical
          </div>
          <p className={styles.tagline}>
            Wholesale pharmaceutical distribution connecting manufacturers to
            retail pharmacies, hospitals, clinics and nursing homes.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title} className={styles.col}>
            <div className={styles.colTitle}>{col.title}</div>
            {col.links.map((link) => (
              <Link key={link.href} href={link.href} className={styles.colLink}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.bottom}>
        © {new Date().getFullYear()} Shree Ram Medical Agency — Wholesale
        Pharmaceutical Distribution.
      </div>
    </footer>
  );
}
