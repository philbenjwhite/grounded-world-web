import { promises as fs } from "fs";
import path from "path";
import { getAuthorName } from "@/lib/authors";
import serverClient from "../../../../tina/server-client";
import ArticlesClientPage from "./client-page";

export const metadata = {
  title: "Articles & Blogs | Grounded World",
  description:
    "An ever-evolving library of insights, provocations, and points of view from the Grounded team on brand purpose, sustainability, and social impact.",
};

export interface ArticleItem {
  slug: string;
  title: string;
  date: string;
  description?: string;
  featuredImage?: string;
  author?: string;
  authorName?: string;
  categoryName?: string;
  categorySlug?: string;
}

/* Category slug → display name mapping */
const CATEGORY_NAMES: Record<string, string> = {
  "brand-purpose": "Brand Purpose",
  "brand-activism": "Brand Activism",
  "social-impact": "Social Impact",
  partnerships: "Partnerships",
  "retail-shopper": "Retail & Shopper",
  strategy: "Strategy",
  sustainability: "Sustainability",
};

/** Extract the first image path from markdown body content */
const MD_IMAGE_RE = /!\[[^\]]*\]\(([^)]+)\)/;
function extractFirstImage(markdown: string): string | undefined {
  const match = markdown.match(MD_IMAGE_RE);
  return match?.[1] ?? undefined;
}

/**
 * Read all posts directly from the filesystem.
 * This bypasses TinaCMS GraphQL for reliable access to frontmatter values
 * including featuredImage, which may not be returned correctly via GraphQL.
 */
async function fetchPosts(): Promise<ArticleItem[]> {
  const dir = path.join(process.cwd(), "content", "posts");
  let files: string[];

  try {
    files = await fs.readdir(dir);
  } catch {
    return [];
  }

  const articles: ArticleItem[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    try {
      const raw = await fs.readFile(path.join(dir, file), "utf-8");
      const fmEnd = raw.indexOf("---", 3);
      if (fmEnd === -1) continue;
      const frontmatter = raw.slice(3, fmEnd).trim();
      const body = raw.slice(fmEnd + 3).trim();

      const get = (key: string): string | undefined => {
        const match = frontmatter.match(
          new RegExp(`^${key}:\\s*['"]?(.+?)['"]?\\s*$`, "m")
        );
        return match?.[1] ?? undefined;
      };

      // Handle quoted titles
      const titleMatch = frontmatter.match(
        /^title:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m
      );
      const title =
        titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3] ?? file;

      const categoryRaw = get("category");
      // Category may be a TinaCMS reference path (content/categories/brand-purpose.json)
      // or a plain slug (brand-purpose) — normalize to just the slug
      const categorySlug = categoryRaw
        ?.replace(/^content\/categories\//, "")
        .replace(/\.json$/, "");
      let featuredImage = get("featuredImage");

      // Fallback: extract first image from markdown body
      if (!featuredImage) {
        featuredImage = extractFirstImage(body);
      }

      const authorSlug = get("author");
      articles.push({
        slug: file.replace(/\.md$/, ""),
        title,
        date: get("date") ?? "",
        description: get("description"),
        featuredImage,
        author: authorSlug,
        authorName: authorSlug ? getAuthorName(authorSlug) : undefined,
        categoryName: categorySlug
          ? (CATEGORY_NAMES[categorySlug] ?? categorySlug)
          : undefined,
        categorySlug: categorySlug ?? undefined,
      });
    } catch {
      continue;
    }
  }

  // Sort newest first
  articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return articles;
}

export default async function ArticlesPage() {
  const [articles, pageResult] = await Promise.all([
    fetchPosts(),
    serverClient.queries.page({ relativePath: "resources-articles.json" }),
  ]);

  return (
    <ArticlesClientPage
      articles={articles}
      query={pageResult.query}
      variables={pageResult.variables as { relativePath: string }}
      data={pageResult.data}
    />
  );
}
