import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { PageHead } from "@/components/catalogue/PageHead";
import { GlassCard } from "@/components/shared/GlassCard";
import { blogPosts } from "@/lib/data/blog";
import styles from "./blog.module.css";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <>
      <div className="page-ambient" />
      <Navbar />
      <PageHead
        kicker="Insights"
        title="Notes from the distribution desk"
        description="Practical guidance on compliance, logistics and partnership for retail pharmacies, hospitals and clinics."
      />
      <div className={styles.grid}>
        {blogPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className={styles.link}>
            <GlassCard className={styles.card}>
              <div
                className={styles.thumb}
                style={{ background: `linear-gradient(150deg, ${post.gradient[0]}, ${post.gradient[1]})` }}
              />
              <div className={styles.body}>
                <div className={styles.meta}>
                  <span className={styles.cat}>{post.category}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className={styles.author}>
                  {post.author} · {new Date(post.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </div>
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
      <Footer />
    </>
  );
}
