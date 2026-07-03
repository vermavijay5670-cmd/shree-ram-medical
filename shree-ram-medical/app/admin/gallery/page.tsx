import type { Metadata } from "next";
import { UploadCloud } from "lucide-react";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { companies } from "@/lib/data/companies";
import { Button } from "@/components/shared/Button";
import styles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Gallery — Admin" };

const sections = ["warehouse", "office", "packing", "delivery", "staff"] as const;

const gradientPairs: [string, string][] = [
  ["#00d9a333", "#00b38933"],
  ["#3d5cff33", "#243fb833"],
  ["#6ee7f233", "#2a9fb033"],
  ["#00d9a333", "#3d5cff33"],
  ["#ffb84d33", "#c9832833"],
  ["#6ee7f233", "#00b38933"],
];

export default function AdminGalleryPage() {
  const tiles = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    gradient: gradientPairs[i % gradientPairs.length],
    section: sections[i % sections.length],
    company: companies[i % companies.length].name,
  }));

  return (
    <AdminShell title="Gallery" subtitle="Facility, warehouse and staff photography shown on company profile pages">
      <div className={styles.panelHead} style={{ marginBottom: 18 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 600 }}>
          {tiles.length} images
        </h3>
        <Button variant="primary">
          <UploadCloud size={15} style={{ marginRight: 6 }} />
          Upload to Cloudinary
        </Button>
      </div>
      <div className={styles.grid}>
        {tiles.map((tile) => (
          <div
            key={tile.id}
            className={styles.tile}
            style={{ background: `linear-gradient(150deg, ${tile.gradient[0]}, ${tile.gradient[1]})`, minHeight: 140, display: "flex", alignItems: "flex-end" }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{tile.company}</div>
              <div style={{ color: "var(--muted)", fontSize: 11.5, textTransform: "capitalize" }}>{tile.section}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: "var(--muted)", fontSize: 12.5, marginTop: 18 }}>
        Image uploads are wired to Cloudinary in production — connect a Cloudinary account and set
        <code style={{ margin: "0 4px" }}>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> to enable direct uploads here.
      </p>
    </AdminShell>
  );
}
