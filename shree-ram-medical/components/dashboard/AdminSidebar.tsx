"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  PackageOpen,
  Boxes,
  ClipboardList,
  Users,
  BarChart3,
  Images,
  HelpCircle,
  Mail,
  Settings,
  Tag,
} from "lucide-react";
import { BrandMark } from "@/components/shared/BrandMark";
import styles from "./AdminShell.module.css";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AdminSidebar({
  inventoryAlertCount = 0,
  activeOrderCount = 0,
}: {
  inventoryAlertCount?: number;
  activeOrderCount?: number;
}) {
  const pathname = usePathname();

  const sections: NavSection[] = [
    {
      title: "Overview",
      items: [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/companies", label: "Companies", icon: Building2 },
        { href: "/admin/medicines", label: "Medicines", icon: PackageOpen },
        { href: "/admin/categories", label: "Categories", icon: Tag },
      ],
    },
    {
      title: "Operations",
      items: [
        { href: "/admin/inventory", label: "Inventory", icon: Boxes, badge: inventoryAlertCount },
        { href: "/admin/orders", label: "Orders", icon: ClipboardList, badge: activeOrderCount },
        { href: "/admin/retailers", label: "Retailers", icon: Users },
      ],
    },
    {
      title: "Content",
      items: [
        { href: "/admin/gallery", label: "Gallery", icon: Images },
        { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
        { href: "/admin/contact-requests", label: "Contact Requests", icon: Mail },
      ],
    },
    {
      title: "Insights",
      items: [
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
        { href: "/admin/settings", label: "Settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <Link href="/admin/dashboard" className={styles.brand}>
        <BrandMark size={30} />
        <span>Shree Ram Admin</span>
      </Link>

      {sections.map((section) => (
        <div key={section.title}>
          <div className={styles.navsec}>{section.title}</div>
          {section.items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navitem} ${active ? styles.active : ""}`}
              >
                <Icon size={17} />
                <span className={styles.lbl}>{item.label}</span>
                {!!item.badge && <span className={styles.badge}>{item.badge}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
