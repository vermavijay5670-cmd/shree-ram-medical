"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/shared/Button";
import styles from "../auth.module.css";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password. Try one of the demo accounts below.");
      return;
    }

    if (callbackUrl) {
      router.push(callbackUrl);
      return;
    }

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    router.push(session?.user?.role === "ADMIN" ? "/admin/dashboard" : "/portal/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.field}>
        <span>Email address</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourpharmacy.com"
        />
      </label>
      <label className={styles.field}>
        <span>Password</span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </label>
      {error && <div className={styles.error}>{error}</div>}
      <Button variant="primary" type="submit" className={styles.submit}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
      <div className={styles.demoBox}>
        <div className={styles.demoTitle}>Demo accounts</div>
        <div className={styles.demoRow}><span>Admin</span><code>admin@shreerammedical.example / admin123</code></div>
        <div className={styles.demoRow}><span>Retailer</span><code>anita@sanjeevanipharmacy.example / retailer123</code></div>
        <div className={styles.demoRow}><span>Hospital</span><code>manoj@ashanursinghome.example / hospital123</code></div>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className={styles.wrap}>
        <GlassCard className={styles.card}>
          <div className={styles.head}>
            <h1>Partner login</h1>
            <p>Sign in to manage orders, invoices and quote requests.</p>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
          <div className={styles.foot}>
            New partner? <Link href="/register">Register your business</Link>
          </div>
        </GlassCard>
      </div>
      <Footer />
    </>
  );
}
