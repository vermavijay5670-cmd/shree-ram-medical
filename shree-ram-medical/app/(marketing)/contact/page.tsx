"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageHead } from "@/components/catalogue/PageHead";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/shared/Button";
import { enquirySchema, type EnquiryInput } from "@/lib/validations/auth";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryInput>({ resolver: zodResolver(enquirySchema) });

  async function onSubmit(data: EnquiryInput) {
    setServerError(null);
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      setServerError(json.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSubmitted(true);
    reset();
  }

  return (
    <>
      <div className="page-ambient" />
      <Navbar />
      <PageHead
        kicker="Get in touch"
        title="Talk to our order desk"
        description="Whether you're placing your first order or setting up a standing monthly supply, our team responds to every enquiry within one business day."
      />
      <div className={styles.wrap}>
        <div className={styles.grid}>
          <GlassCard className={styles.formCard}>
            {submitted ? (
              <div className={styles.success}>
                <h3>Thanks — we&rsquo;ve got your message.</h3>
                <p>Our order desk will reach out within one business day.</p>
                <Button variant="ghost" onClick={() => setSubmitted(false)} type="button">
                  Send another enquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.row2}>
                  <label className={styles.field}>
                    <span>Your name</span>
                    <input {...register("name")} placeholder="Full name" />
                    {errors.name && <em>{errors.name.message}</em>}
                  </label>
                  <label className={styles.field}>
                    <span>Business name</span>
                    <input {...register("businessName")} placeholder="Pharmacy / hospital name" />
                    {errors.businessName && <em>{errors.businessName.message}</em>}
                  </label>
                </div>
                <div className={styles.row2}>
                  <label className={styles.field}>
                    <span>Email address</span>
                    <input type="email" {...register("email")} placeholder="you@yourpharmacy.com" />
                    {errors.email && <em>{errors.email.message}</em>}
                  </label>
                  <label className={styles.field}>
                    <span>Phone number</span>
                    <input {...register("phone")} placeholder="+91 98765 43210" />
                    {errors.phone && <em>{errors.phone.message}</em>}
                  </label>
                </div>
                <label className={styles.field}>
                  <span>How can we help?</span>
                  <textarea rows={5} {...register("message")} placeholder="Tell us what you're looking for…" />
                  {errors.message && <em>{errors.message.message}</em>}
                </label>
                {serverError && <div className={styles.error}>{serverError}</div>}
                <Button variant="primary" type="submit" className={styles.submit}>
                  {isSubmitting ? "Sending…" : "Send enquiry"}
                </Button>
              </form>
            )}
          </GlassCard>

          <div className={styles.infoCol}>
            <GlassCard className={styles.infoCard}>
              <MapPin size={18} color="var(--green)" />
              <div>
                <div className={styles.infoTitle}>Regional Office</div>
                <div className={styles.infoText}>Shree Ram Medical Agency, Boring Road, Patna, Bihar 800001</div>
              </div>
            </GlassCard>
            <GlassCard className={styles.infoCard}>
              <Phone size={18} color="var(--green)" />
              <div>
                <div className={styles.infoTitle}>Phone</div>
                <div className={styles.infoText}>+91 612 456 7890</div>
              </div>
            </GlassCard>
            <GlassCard className={styles.infoCard}>
              <Mail size={18} color="var(--green)" />
              <div>
                <div className={styles.infoTitle}>Email</div>
                <div className={styles.infoText}>orders@shreerammedical.example</div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
