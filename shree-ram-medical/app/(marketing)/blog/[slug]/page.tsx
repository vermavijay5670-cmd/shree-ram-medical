import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { blogPosts, getBlogPostBySlug } from "@/lib/data/blog";
import styles from "./post.module.css";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <div className="page-ambient" />
      <Navbar />
      <div className={styles.wrap}>
        <div className={styles.breadcrumb}>
          <Link href="/blog">Blog</Link>
          <span>/</span>
          <span className={styles.cur}>{post.category}</span>
        </div>
        <div
          className={styles.hero}
          style={{ background: `linear-gradient(150deg, ${post.gradient[0]}, ${post.gradient[1]})` }}
        />
        <div className={styles.meta}>
          <span className={styles.cat}>{post.category}</span>
          <span>
            {post.author} · {new Date(post.date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })} · {post.readTime}
          </span>
        </div>
        <h1>{post.title}</h1>
        <div className={styles.body}>
          {post.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
