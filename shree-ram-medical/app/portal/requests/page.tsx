import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MessageSquareText } from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { auth } from "@/lib/auth";
import { Button } from "@/components/shared/Button";
import tableStyles from "@/components/dashboard/AdminTable.module.css";

export const metadata: Metadata = { title: "Quote Requests — Partner Portal" };

export default async function PortalRequestsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <PortalShell title="Quote Requests" subtitle="Track enquiries you've sent for pricing and availability">
      <div className={tableStyles.panel} style={{ textAlign: "center", padding: "56px 24px" }}>
        <MessageSquareText size={28} color="var(--muted)" style={{ margin: "0 auto 16px" }} />
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
          No quote requests yet
        </h3>
        <p style={{ color: "var(--muted)", fontSize: 13.5, maxWidth: 420, margin: "0 auto 22px" }}>
          Browse the medicines catalogue and use &ldquo;Request Quote&rdquo; on any product to start
          building an enquiry. Your requests and their status will appear here.
        </p>
        <Button href="/medicines" variant="primary">
          Browse medicines
        </Button>
      </div>
    </PortalShell>
  );
}
