import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { auth } from "@/lib/auth";
import { medicines } from "@/lib/data/medicines";
import { MedicineCard } from "@/components/catalogue/MedicineCard";

export const metadata: Metadata = { title: "Wishlist — Partner Portal" };

export default async function PortalWishlistPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Demo data — a real build persists this per-user via a WishlistItem model
  // and toggles it from the heart icon on MedicineCard.
  const saved = medicines.slice(0, 4);

  return (
    <PortalShell title="Wishlist" subtitle="Medicines you've saved for quick reordering">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {saved.map((m) => (
          <MedicineCard key={m.id} medicine={m} />
        ))}
      </div>
    </PortalShell>
  );
}
