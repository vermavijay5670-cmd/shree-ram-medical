"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/shared/Button";
import { companyFormSchema, type CompanyFormInput } from "@/lib/validations/company";
import styles from "@/components/dashboard/AdminForm.module.css";

export function CompanyForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormInput>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: { isDomestic: true, isPopular: false },
  });

  async function onSubmit(data: CompanyFormInput) {
    setServerError(null);
    setSuccess(false);
    const res = await fetch("/api/admin/companies", {
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
        <div className={styles.success}>Company added. It now shows up on /admin/companies and the public site.</div>
      )}
      {serverError && <div className={styles.error}>{serverError}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Company details</div>
          <label className={styles.field}>
            <span>Company name</span>
            <input {...register("name")} placeholder="e.g. Aristo Pharmaceuticals" />
            {errors.name && <em>{errors.name.message}</em>}
          </label>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>Segment / therapy area</span>
              <input {...register("segment")} placeholder="e.g. Respiratory & Cardiology" />
              {errors.segment && <em>{errors.segment.message}</em>}
            </label>
            <label className={styles.field}>
              <span>Country</span>
              <input {...register("country")} placeholder="India" />
              {errors.country && <em>{errors.country.message}</em>}
            </label>
          </div>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>Founded year</span>
              <input type="number" {...register("foundedYear")} placeholder="1990" />
              {errors.foundedYear && <em>{errors.foundedYear.message}</em>}
            </label>
            <label className={styles.field}>
              <span>Website (optional)</span>
              <input {...register("website")} placeholder="https://" />
            </label>
          </div>
          <label className={styles.field}>
            <span>Description</span>
            <textarea rows={3} {...register("description")} placeholder="What this company manufactures and distributes through your network…" />
            {errors.description && <em>{errors.description.message}</em>}
          </label>
          <label className={styles.checkboxRow}>
            <input type="checkbox" {...register("isDomestic")} />
            Domestic (India-based) manufacturer
          </label>
          <label className={styles.checkboxRow}>
            <input type="checkbox" {...register("isPopular")} />
            Feature as a &ldquo;popular partner&rdquo;
          </label>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Contact (optional)</div>
          <div className={styles.grid3}>
            <label className={styles.field}>
              <span>Office address</span>
              <input {...register("officeAddress")} placeholder="City, state" />
            </label>
            <label className={styles.field}>
              <span>Phone</span>
              <input {...register("phone")} placeholder="+91 …" />
            </label>
            <label className={styles.field}>
              <span>Email</span>
              <input type="email" {...register("email")} placeholder="partnerships@…" />
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="primary" type="submit">
            {isSubmitting ? "Adding…" : "Add company"}
          </Button>
          <Button variant="ghost" type="button" onClick={() => router.push("/admin/companies")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
