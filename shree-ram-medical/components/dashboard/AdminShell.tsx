import { Bell } from "lucide-react";
import { AdminSidebar } from "@/components/dashboard/AdminSidebar";
import styles from "./AdminShell.module.css";

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.shell}>
      <AdminSidebar />
      <main className={styles.main}>
        <div className={styles.topbar}>
          <div>
            <h1>{title}</h1>
            <div className={styles.sub}>{subtitle}</div>
          </div>
          <div className={styles.topActions}>
            <div className={styles.searchMini}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input type="text" placeholder="Search medicines, orders…" />
            </div>
            <button type="button" className={styles.iconBtn} aria-label="Notifications">
              <span className={styles.dot} />
              <Bell size={17} />
            </button>
            <div className={styles.avatar}>SR</div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
