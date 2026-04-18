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

async function getPosts(): Promise<BlogPost[]> {
  const dataDir = path.join(process.cwd(), "data", "blog");
  try {
    const files = await readdir(dataDir);
    const jsonFiles = files
      .filter((f) => f.endsWith(".json"))
      .sort()
      .reverse(); // newest first

    const posts = await Promise.all(
      jsonFiles.map(async (f) => {
        const content = await readFile(path.join(dataDir, f), "utf-8");
        return JSON.parse(content) as BlogPost;
      })
    );
    return posts;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  const allPosts = posts.length > 0 ? posts : FALLBACK_POSTS;

  return <BlogClient initialPosts={allPosts} />;
}
