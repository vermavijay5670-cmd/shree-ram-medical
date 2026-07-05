import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { isDatabaseConfigured } from "@/lib/prisma";
import { CompanyForm } from "./CompanyForm";
import styles from "@/components/dashboard/AdminForm.module.css";

export const metadata: Metadata = { title: "Add Company — Admin" };

export default function AdminNewCompanyPage() {
  return (
    <AdminShell title="Add Company" subtitle="Add a new manufacturing partner to the network">
      {!isDatabaseConfigured() && (
        <p className={styles.warn}>
          No database connected yet. You can fill out this form, but submitting will show an error
          until <code>DATABASE_URL</code> is set on your deployment — see the README for the
          Supabase connection steps.
        </p>
      )}
      <CompanyForm />
    </AdminShell>
  );
}
