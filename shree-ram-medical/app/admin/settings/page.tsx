import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { GlassCard } from "@/components/shared/GlassCard";

export const metadata: Metadata = { title: "Settings — Admin" };

export default function AdminSettingsPage() {
  return (
    <AdminShell title="Settings" subtitle="Account, warehouse and notification preferences">
      <GlassCard style={{ padding: 28, maxWidth: 640 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
          Coming soon
        </h3>
        <p style={{ color: "var(--muted)", fontSize: 13.5, lineHeight: 1.7 }}>
          Warehouse configuration, low-stock threshold defaults, notification routing and admin role
          management will live here once authentication and the database are wired up (see
          BUILD_BRIEF.md milestone 5–6).
        </p>
      </GlassCard>
    </AdminShell>
  );
}
