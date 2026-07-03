import Link from "next/link";
import { BrandMark } from "@/components/shared/BrandMark";
import styles from "./Navbar.module.css";
import { cn } from "@/lib/utils";

const links = [
  { href: "/companies", label: "Companies" },
  { href: "/medicines", label: "Medicines" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export function Navbar({
  active,
  position = "sticky",
}: {
  active?: string;
  position?: "sticky" | "fixed";
}) {
  return (
    <nav className={cn(styles.nav, position === "fixed" && styles.fixed)}>
      <Link href="/" className={styles.brand}>
        <BrandMark size={28} />
        Shree Ram Medical
      </Link>
      <div className={styles.navlinks}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(styles.link, active === link.href && styles.active)}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <Link href="/login" className={styles.cta}>
        Partner Login
      </Link>
    </nav>
  );
}
