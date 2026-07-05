"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shared/Button";
import { medicineFormSchema, type MedicineFormInput } from "@/lib/validations/medicine";
import type { Company, Category } from "@/lib/types";
import styles from "@/components/dashboard/AdminForm.module.css";

export function MedicineForm({ companies, categories }: { companies: Company[]; categories: Category[] }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicineFormInput>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: {
      gstRate: 12,
      prescriptionRequired: false,
      stockQty: 200,
      lowStockThreshold: 50,
      warehouse: "Patna Central",
    },
  });

  async function onSubmit(data: MedicineFormInput) {
    setServerError(null);
    setSuccess(false);
    const res = await fetch("/api/admin/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setServerError(json.error ?? "Something went wrong");
      return;
    }
    setSuccess(true);
    reset();
    router.refresh();
  }

  return (
    <div className={styles.panel}>
      {success && (
        <div className={styles.success}>Medicine added. It now shows up on /admin/medicines and the public catalogue.</div>
      )}
      {serverError && <div className={styles.error}>{serverError}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Basic details</div>
          <label className={styles.field}>
            <span>Medicine name</span>
            <input {...register("name")} placeholder="e.g. Pantocid DSR" />
            {errors.name && <em>{errors.name.message}</em>}
          </label>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>Composition / salt</span>
              <input {...register("composition")} placeholder="e.g. Pantoprazole + Domperidone" />
              {errors.composition && <em>{errors.composition.message}</em>}
            </label>
            <label className={styles.field}>
              <span>Strength</span>
              <input {...register("strength")} placeholder="e.g. 40mg + 30mg" />
              {errors.strength && <em>{errors.strength.message}</em>}
            </label>
          </div>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>Packaging</span>
              <input {...register("packaging")} placeholder="e.g. Strip of 10 capsules" />
              {errors.packaging && <em>{errors.packaging.message}</em>}
            </label>
            <label className={styles.field}>
              <span>Prescription required?</span>
              <select {...register("prescriptionRequired")}>
                <option value="false">No — OTC</option>
                <option value="true">Yes — Rx</option>
              </select>
            </label>
          </div>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>Manufacturer</span>
              <select {...register("companySlug")} defaultValue="">
                <option value="" disabled>Select a company…</option>
                {companies.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
              {errors.companySlug && <em>{errors.companySlug.message}</em>}
              {companies.length === 0 && (
                <em style={{ color: "var(--amber)" }}>
                  No companies yet — add one on /admin/companies/new first.
                </em>
              )}
            </label>
            <label className={styles.field}>
              <span>Category</span>
              <select {...register("categorySlug")} defaultValue="">
                <option value="" disabled>Select a category…</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
              {errors.categorySlug && <em>{errors.categorySlug.message}</em>}
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Pricing</div>
          <div className={styles.grid3}>
            <label className={styles.field}>
              <span>MRP (₹)</span>
              <input type="number" step="0.01" {...register("mrp")} placeholder="118" />
              {errors.mrp && <em>{errors.mrp.message}</em>}
            </label>
            <label className={styles.field}>
              <span>Selling price (₹)</span>
              <input type="number" step="0.01" {...register("sellingPrice")} placeholder="96" />
              {errors.sellingPrice && <em>{errors.sellingPrice.message}</em>}
            </label>
            <label className={styles.field}>
              <span>GST rate (%)</span>
              <select {...register("gstRate")}>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
              </select>
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Clinical information (optional — sensible defaults are used if left blank)</div>
          <label className={styles.field}>
            <span>Description / uses</span>
            <textarea rows={2} {...register("uses")} placeholder="What this medicine treats…" />
          </label>
          <label className={styles.field}>
            <span>Dosage</span>
            <textarea rows={2} {...register("dosage")} placeholder="Typical dosage instructions…" />
          </label>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>Contraindications</span>
              <textarea rows={2} {...register("contraindications")} />
            </label>
            <label className={styles.field}>
              <span>Side effects</span>
              <textarea rows={2} {...register("sideEffects")} />
            </label>
          </div>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>Interactions</span>
              <textarea rows={2} {...register("interactions")} />
            </label>
            <label className={styles.field}>
              <span>Storage</span>
              <textarea rows={2} {...register("storage")} />
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Initial stock batch (optional — add or edit batches later from Inventory)</div>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>Warehouse</span>
              <select {...register("warehouse")}>
                <option value="Patna Central">Patna Central</option>
                <option value="Gaya Depot">Gaya Depot</option>
                <option value="Muzaffarpur Hub">Muzaffarpur Hub</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Batch number</span>
              <input {...register("batchNumber")} placeholder="e.g. AGX-2291" />
            </label>
          </div>
          <div className={styles.grid3}>
            <label className={styles.field}>
              <span>Expiry date</span>
              <input type="date" {...register("expiryDate")} />
            </label>
            <label className={styles.field}>
              <span>Stock quantity</span>
              <input type="number" {...register("stockQty")} />
            </label>
            <label className={styles.field}>
              <span>Low-stock threshold</span>
              <input type="number" {...register("lowStockThreshold")} />
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="primary" type="submit">
            {isSubmitting ? "Adding…" : "Add medicine"}
          </Button>
          <Button variant="ghost" type="button" onClick={() => router.push("/admin/medicines")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
