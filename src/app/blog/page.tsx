import type { Metadata } from "next";
import { readdir, readFile } from "fs/promises";
import path from "path";
import BlogClient from "./BlogClient";
import { FALLBACK_POSTS } from "./BlogFallback";

export const metadata: Metadata = {
  title: "Insurance Tips & Guides | Ativa Insurance Blog",
  description:
    "Expert insurance tips for Florida families and businesses — auto, home, flood, commercial, and more. Available in English, Portuguese, and Spanish.",
  alternates: { canonical: "https://ativainsurance.com/blog" },
  openGraph: {
    title: "Insurance Tips & Guides | Ativa Insurance Blog",
    description:
      "Expert insurance tips for Florida families and businesses — auto, home, flood, commercial, and more.",
    url: "https://ativainsurance.com/blog",
    siteName: "Ativa Insurance",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "Ativa Insurance Blog" }],
  },
  twitter: { card: "summary_large_image" },
};

export interface BlogPost {
  slug:     string;
  date:     string;
  category: string;
  en:       { title: string; excerpt: string; body: string; readTime: string };
  pt:       { title: string; excerpt: string; body: string; readTime: string };
  es:       { title: string; excerpt: string; body: string; readTime: string };
}

// Shape written by /api/generate-blog
interface FlatPost {
  title:           string;
  slug:            string;
  category:        string;
  readTime:        string;
  excerpt:         string;
  content:         string;
  metaDescription: string;
  publishedAt:     string;
  author:          string;
  id:              string;
}

function flatToBlogPost(flat: FlatPost): BlogPost {
  const lang = {
    title:    flat.title,
    excerpt:  flat.excerpt,
    body:     flat.content,
    readTime: flat.readTime,
  };
  // Normalize ALL-CAPS category: 'HOME' → 'Home'
  const category =
    flat.category.charAt(0).toUpperCase() + flat.category.slice(1).toLowerCase();
  return {
    slug:     flat.slug,
    date:     flat.publishedAt,
    category,
    en: lang,
    pt: lang,
    es: lang,
  };
}

async function getPosts(): Promise<BlogPost[]> {
  const dataDir = path.join(process.cwd(), "data", "blog");
  try {
    const files = await readdir(dataDir);
    const jsonFiles = files.filter((f) => f.endsWith(".json")).sort().reverse();
    return await Promise.all(
      jsonFiles.map(async (f) => {
        const content = await readFile(path.join(dataDir, f), "utf-8");
        return JSON.parse(content) as BlogPost;
      })
    );
  } catch {
    return [];
  }
}

async function getFlatPosts(): Promise<BlogPost[]> {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "blog-posts.json");
    const content = await readFile(filePath, "utf-8");
    const flat = JSON.parse(content) as FlatPost[];
    return flat.map(flatToBlogPost);
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const [multilingual, flat] = await Promise.all([getPosts(), getFlatPosts()]);

  // Merge: flat posts first (newest), then multilingual; dedupe by slug
  const seen = new Set<string>();
  const merged: BlogPost[] = [];
  for (const p of [...flat, ...multilingual]) {
    if (!seen.has(p.slug)) { seen.add(p.slug); merged.push(p); }
  }

  const allPosts = merged.length > 0 ? merged : FALLBACK_POSTS;
  return <BlogClient initialPosts={allPosts} />;
}
