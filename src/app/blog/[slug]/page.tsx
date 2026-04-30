import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readFile, readdir } from "fs/promises";
import path from "path";
import type { BlogPost } from "../page";
import BlogPostClient from "./BlogPostClient";

interface Props {
  params: Promise<{ slug: string }>;
}

interface FlatPost {
  title: string; slug: string; category: string; readTime: string;
  excerpt: string; content: string; publishedAt: string; id: string;
}

function flatToBlogPost(flat: FlatPost): BlogPost {
  const lang = { title: flat.title, excerpt: flat.excerpt, body: flat.content, readTime: flat.readTime };
  const category = flat.category.charAt(0).toUpperCase() + flat.category.slice(1).toLowerCase();
  return { slug: flat.slug, date: flat.publishedAt, category, en: lang, pt: lang, es: lang };
}

async function getPost(slug: string): Promise<BlogPost | null> {
  // 1. Individual file (written by /api/generate-blog-post)
  try {
    const filePath = path.join(process.cwd(), "data", "blog", `${slug}.json`);
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as BlogPost;
  } catch { /* not found there */ }

  // 2. Flat array (written by /api/generate-blog)
  try {
    const filePath = path.join(process.cwd(), "src", "data", "blog-posts.json");
    const content = await readFile(filePath, "utf-8");
    const posts = JSON.parse(content) as FlatPost[];
    const found = posts.find((p) => p.slug === slug);
    if (found) return flatToBlogPost(found);
  } catch { /* not found there */ }

  return null;
}

export async function generateStaticParams() {
  try {
    const dataDir = path.join(process.cwd(), "data", "blog");
    const files = await readdir(dataDir);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => ({ slug: f.replace(".json", "") }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };
  const canonical = `https://ativainsurance.com/blog/${slug}`;
  const description = post.en.excerpt.slice(0, 155);
  return {
    title:       `${post.en.title} | Ativa Insurance Blog`,
    description,
    alternates:  { canonical },
    openGraph: {
      title:       post.en.title,
      description,
      url:         canonical,
      siteName:    "Ativa Insurance",
      type:        "article",
      images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: post.en.title }],
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Try dynamic data files first, then fallback to static posts
  let post = await getPost(slug);

  if (!post) {
    const { FALLBACK_POSTS } = await import("../BlogFallback");
    const found = FALLBACK_POSTS.find((p: BlogPost) => p.slug === slug);
    if (!found) notFound();
    post = found;
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post!.en.title,
    description: post!.en.excerpt,
    datePublished: post!.date,
    author: { "@type": "Organization", name: "Ativa Insurance" },
    publisher: {
      "@type": "Organization",
      name: "Ativa Insurance",
      logo: {
        "@type": "ImageObject",
        url: "https://ativainsurance.com/logos/Personal Logo.png",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://ativainsurance.com/blog/${slug}` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogPostClient post={post!} />
    </>
  );
}
