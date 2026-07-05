import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { getCompanies } from "@/lib/data/companies";
import { getCategories } from "@/lib/data/categories";
import { isDatabaseConfigured } from "@/lib/prisma";
import { MedicineForm } from "./MedicineForm";
import styles from "@/components/dashboard/AdminForm.module.css";

export const metadata: Metadata = { title: "Add Medicine — Admin" };

export default async function AdminNewMedicinePage() {
  const [companies, categories] = await Promise.all([getCompanies(), getCategories()]);

  return (
    <AdminShell title="Add Medicine" subtitle="Add a new SKU to the catalogue">
      {!isDatabaseConfigured() && (
        <p className={styles.warn}>
          No database connected yet. You can fill out this form, but submitting will show an error
          until <code>DATABASE_URL</code> is set on your deployment — see the README for the
          Supabase connection steps.
        </p>
      )}
      <MedicineForm companies={companies} categories={categories} />
    </AdminShell>
  );
}
