import Link from "next/link";
import { LayoutDashboard, Package, Receipt, Heart, MessageSquareText, LogOut } from "lucide-react";
import { BrandMark } from "@/components/shared/BrandMark";
import { auth, signOut } from "@/lib/auth";
import styles from "./PortalShell.module.css";

const navItems = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/orders", label: "Orders", icon: Package },
  { href: "/portal/invoices", label: "Invoices", icon: Receipt },
  { href: "/portal/wishlist", label: "Wishlist", icon: Heart },
  { href: "/portal/requests", label: "Quote Requests", icon: MessageSquareText },
];

export async function PortalShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/portal/dashboard" className={styles.brand}>
          <BrandMark size={28} />
          <span>Partner Portal</span>
        </Link>
        <div className={styles.profile}>
          <div className={styles.avatar}>
            {(session?.user?.businessName ?? session?.user?.name ?? "P").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className={styles.bizName}>{session?.user?.businessName ?? session?.user?.name}</div>
            <div className={styles.role}>{session?.user?.role}</div>
          </div>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={styles.navitem}>
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className={styles.signout}>
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </aside>
      <main className={styles.main}>
        <div className={styles.topbar}>
          <h1>{title}</h1>
          <div className={styles.sub}>{subtitle}</div>
        </div>
        {children}
      </main>
    </div>
  );
}
