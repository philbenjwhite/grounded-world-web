import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { promises as fsPromises } from "fs";
import path from "path";
import serverClient from "../../../../../tina/server-client";
import ArticleDetailClientPage from "./client-page";
import type { RelatedArticleItem } from "@/components/components/RelatedArticles/RelatedArticles";
import type { AuthorData } from "@/lib/authors";
import { calculateReadingTime } from "@/lib/reading-time";
import { extractHeadingsFromTinaContent } from "@/lib/extract-headings";

interface PageParams {
  slug: string;
}

/** Recursively extract plain text from TinaCMS rich-text JSON AST */
function extractPlainText(node: { type?: string; text?: string; children?: unknown[] }): string {
  if (node.text) return node.text;
  if (!node.children) return "";
  return (node.children as { type?: string; text?: string; children?: unknown[] }[])
    .map(extractPlainText)
    .join("");
}

function bodyToPlainText(body: unknown): string {
  if (!body) return "";
  const node = body as { children?: unknown[] };
  if (!node.children) return "";
  return (node.children as { type?: string; text?: string; children?: unknown[] }[])
    .map(extractPlainText)
    .join(" ");
}

type PostSummary = RelatedArticleItem & { category?: string };

/** Module-level cache to avoid re-reading all posts for each article during static build */
let cachedPostSummaries: Promise<PostSummary[]> | null = null;

function getAllPostSummaries(): Promise<PostSummary[]> {
  if (!cachedPostSummaries) {
    cachedPostSummaries = loadAllPostSummaries();
  }
  return cachedPostSummaries;
}

async function loadAllPostSummaries(): Promise<PostSummary[]> {
  try {
    const dir = path.join(process.cwd(), "content", "posts");
    const files = await fsPromises.readdir(dir);
    const posts: PostSummary[] = [];

    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      try {
        const raw = await fsPromises.readFile(path.join(dir, file), "utf-8");
        const fmEnd = raw.indexOf("---", 3);
        if (fmEnd === -1) continue;
        const fm = raw.slice(3, fmEnd).trim();

        const get = (key: string): string | undefined => {
          const match = fm.match(
            new RegExp(`^${key}:\\s*['"]?(.+?)['"]?\\s*$`, "m")
          );
          return match?.[1] ?? undefined;
        };

        const titleMatch = fm.match(
          /^title:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m
        );

        // Category may be a TinaCMS reference path — normalize to slug
        const categoryRaw = get("category");
        const categorySlug = categoryRaw
          ?.replace(/^content\/categories\//, "")
          .replace(/\.json$/, "");

        posts.push({
          slug: file.replace(/\.md$/, ""),
          title:
            titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3] ?? file,
          date: get("date") ?? "",
          featuredImage: get("featuredImage"),
          category: categorySlug,
        });
      } catch {
        continue;
      }
    }

    return posts;
  } catch {
    return [];
  }
}

/** Get related articles: same category (excluding current), fallback to recent */
async function getRelatedArticles(
  currentSlug: string,
  categoryPath?: string
): Promise<RelatedArticleItem[]> {
  const allPosts = await getAllPostSummaries();

  // Extract category slug from reference path (e.g. "content/categories/brand-purpose.json" → "brand-purpose")
  const categorySlug = categoryPath
    ?.replace(/^content\/categories\//, "")
    .replace(/\.json$/, "");

  // Exclude current article and sort by date (newest first)
  const others = allPosts
    .filter((p) => p.slug !== currentSlug)
    .slice();

  others.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Try same category first
  if (categorySlug) {
    const sameCategory = others.filter(
      (p) => p.category === categorySlug
    );
    if (sameCategory.length >= 3) return sameCategory.slice(0, 3);
    if (sameCategory.length > 0) {
      const remaining = others.filter(
        (p) => p.category !== categorySlug
      );
      return [...sameCategory, ...remaining].slice(0, 3);
    }
  }

  // Fallback: most recent articles
  return others.slice(0, 3);
}

export async function generateStaticParams() {
  try {
    const response = await serverClient.queries.postConnection();
    return (
      response.data.postConnection.edges
        ?.map((edge) => ({
          slug: edge?.node?._sys.filename,
        }))
        .filter((p) => p.slug) ?? []
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await serverClient.queries.post({
      relativePath: `${slug}.md`,
    });
    const post = response.data.post;
    const plainText = bodyToPlainText(post.body);
    const readingTime = calculateReadingTime(plainText);

    return {
      title: `${post.title} | Grounded World`,
      description: post.description ?? undefined,
      openGraph: {
        title: post.title,
        description: post.description ?? undefined,
        type: "article",
        publishedTime: post.date || undefined,
        authors: post.author?.name
          ? [post.author.name]
          : undefined,
        images: post.featuredImage ? [post.featuredImage] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description ?? `${readingTime} min read`,
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;

  let result;
  try {
    result = await serverClient.queries.post({
      relativePath: `${slug}.md`,
    });
  } catch {
    notFound();
  }

  const post = result.data.post;
  const authorData: AuthorData | undefined = post.author
    ? {
        slug: post.author._sys.filename,
        name: post.author.name,
        role: post.author.role ?? "",
        bio: post.author.shortBio ?? "",
        photoUrl: post.author.photoUrl ?? "",
        linkedinUrl: post.author.linkedinUrl ?? undefined,
      }
    : undefined;
  const plainText = bodyToPlainText(post.body);
  const readingTime = calculateReadingTime(plainText);
  const headings = extractHeadingsFromTinaContent(post.body);

  // Category slug for related articles matching
  const categoryRef = post.category?._sys?.relativePath;
  const relatedArticles = await getRelatedArticles(slug, categoryRef);

  // JSON-LD structured data
  const wordCount = plainText.trim().split(/\s+/).length;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description ?? undefined,
    image: post.featuredImage
      ? `https://grounded.world${post.featuredImage}`
      : undefined,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    author: authorData
      ? {
          "@type": "Person",
          name: authorData.name,
          url: authorData.linkedinUrl ?? undefined,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Grounded World",
      url: "https://grounded.world",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://grounded.world/resources/articles/${slug}`,
    },
    wordCount,
    timeRequired: `PT${readingTime}M`,
  };

  return (
    <ArticleDetailClientPage
      query={result.query}
      variables={result.variables as { relativePath: string }}
      data={result.data}
      headings={headings}
      authorData={authorData}
      readingTime={readingTime}
      relatedArticles={relatedArticles}
      slug={slug}
      jsonLd={jsonLd}
    />
  );
}
