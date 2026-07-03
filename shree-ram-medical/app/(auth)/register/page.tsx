"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/shared/Button";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "RETAILER" },
  });

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    setSubmitting(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      setServerError(json.error ?? "Something went wrong");
      setSubmitting(false);
      return;
    }
    await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    setSubmitting(false);
    router.push("/portal/dashboard");
    router.refresh();
  }

  return (
    <>
      <Navbar />
      <div className={styles.wrap}>
        <GlassCard className={styles.card}>
          <div className={styles.head}>
            <h1>Register your business</h1>
            <p>Create a partner account to request quotes, track orders and view invoices.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <label className={styles.field}>
              <span>Your name</span>
              <input {...register("name")} placeholder="Full name" />
              {errors.name && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.name.message}</span>}
            </label>
            <label className={styles.field}>
              <span>Business name</span>
              <input {...register("businessName")} placeholder="Sanjeevani Pharmacy" />
              {errors.businessName && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.businessName.message}</span>}
            </label>
            <div className={styles.row2}>
              <label className={styles.field}>
                <span>Account type</span>
                <select {...register("role")}>
                  <option value="RETAILER">Retail pharmacy</option>
                  <option value="HOSPITAL">Hospital / clinic</option>
                  <option value="DISTRIBUTOR">Sub-distributor</option>
                </select>
              </label>
              <label className={styles.field}>
                <span>City</span>
                <input {...register("city")} placeholder="Patna" />
                {errors.city && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.city.message}</span>}
              </label>
            </div>
            <label className={styles.field}>
              <span>GST number</span>
              <input {...register("gstNumber")} placeholder="10ABCDE1234F1Z5" style={{ textTransform: "uppercase" }} />
              {errors.gstNumber && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.gstNumber.message}</span>}
            </label>
            <label className={styles.field}>
              <span>Email address</span>
              <input type="email" {...register("email")} placeholder="you@yourpharmacy.com" />
              {errors.email && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.email.message}</span>}
            </label>
            <label className={styles.field}>
              <span>Password</span>
              <input type="password" {...register("password")} placeholder="At least 6 characters" />
              {errors.password && <span style={{ color: "var(--red)", fontSize: 12 }}>{errors.password.message}</span>}
            </label>
            {serverError && <div className={styles.error}>{serverError}</div>}
            <Button variant="primary" type="submit" className={styles.submit}>
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <div className={styles.foot}>
            Already a partner? <Link href="/login">Sign in</Link>
          </div>
        </GlassCard>
      </div>
      <Footer />
    </>
  );
}
