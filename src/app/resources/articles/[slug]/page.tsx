import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { promises as fsPromises } from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import CTABanner from "@/components/components/CTABanner";
import ScrollProgressBar from "@/components/components/ScrollProgressBar";
import ArticleTableOfContents from "@/components/components/ArticleTableOfContents";
import AuthorBio from "@/components/components/AuthorBio";
import RelatedArticles from "@/components/components/RelatedArticles";
import type { RelatedArticleItem } from "@/components/components/RelatedArticles/RelatedArticles";
import { getAuthor } from "@/lib/authors";
import { calculateReadingTime } from "@/lib/reading-time";
import { extractHeadings, extractText, slugify } from "@/lib/extract-headings";

interface PageParams {
  slug: string;
}

interface PostData {
  title: string;
  date: string;
  description?: string;
  featuredImage?: string;
  author?: string;
  category?: string;
  body: string;
}

/**
 * Read a post directly from the filesystem.
 * This bypasses TinaCMS GraphQL which can fail on category reference resolution.
 */
async function getPost(slug: string): Promise<PostData | null> {
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "posts",
      `${slug}.md`
    );
    const raw = await fsPromises.readFile(filePath, "utf-8");

    // Parse frontmatter
    const fmEnd = raw.indexOf("---", 3);
    if (fmEnd === -1) return null;
    const frontmatter = raw.slice(3, fmEnd).trim();
    const body = raw.slice(fmEnd + 3).trim();

    const get = (key: string): string | undefined => {
      const match = frontmatter.match(
        new RegExp(`^${key}:\\s*['"]?(.+?)['"]?\\s*$`, "m")
      );
      return match?.[1] ?? undefined;
    };

    // Handle quoted titles (may span special chars)
    const titleMatch = frontmatter.match(
      /^title:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m
    );
    const title =
      titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3] ?? slug;

    return {
      title,
      date: get("date") ?? "",
      description: get("description"),
      featuredImage: get("featuredImage"),
      author: get("author"),
      category: get("category"),
      body,
    };
  } catch {
    return null;
  }
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

        posts.push({
          slug: file.replace(/\.md$/, ""),
          title:
            titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3] ?? file,
          date: get("date") ?? "",
          featuredImage: get("featuredImage"),
          category: get("category"),
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
  category?: string
): Promise<RelatedArticleItem[]> {
  const allPosts = await getAllPostSummaries();

  // Exclude current article and sort by date (newest first)
  const others = allPosts
    .filter((p) => p.slug !== currentSlug)
    .slice();

  others.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Try same category first
  if (category) {
    const sameCategory = others.filter((p) => p.category === category);
    if (sameCategory.length >= 3) return sameCategory.slice(0, 3);
    if (sameCategory.length > 0) {
      // Fill remaining with recent articles from other categories
      const remaining = others.filter((p) => p.category !== category);
      return [...sameCategory, ...remaining].slice(0, 3);
    }
  }

  // Fallback: most recent articles
  return others.slice(0, 3);
}

export async function generateStaticParams() {
  try {
    const dir = path.join(process.cwd(), "content", "posts");
    const files = await fsPromises.readdir(dir);
    return files
      .filter((f) => f.endsWith(".md"))
      .map((f) => ({ slug: f.replace(/\.md$/, "") }));
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
  const post = await getPost(slug);
  if (!post) return {};

  const readingTime = calculateReadingTime(post.body);

  return {
    title: `${post.title} | Grounded World`,
    description: post.description ?? undefined,
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      type: "article",
      publishedTime: post.date || undefined,
      authors: post.author
        ? [getAuthor(post.author)?.name ?? post.author]
        : undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description ?? `${readingTime} min read`,
    },
  };
}

/* Custom heading renderers that add id attributes for TOC anchor links */
function createHeadingRenderer(level: number) {
  const HeadingRenderer = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => {
    const text = extractText(children);
    const id = slugify(text);
    const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
    return <Tag id={id}>{children}</Tag>;
  };
  HeadingRenderer.displayName = `H${level}Renderer`;
  return HeadingRenderer;
}

const markdownComponents = {
  h2: createHeadingRenderer(2),
  h3: createHeadingRenderer(3),
};

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const authorData = post.author ? getAuthor(post.author) : undefined;
  const authorName = authorData?.name ?? post.author;
  const readingTime = calculateReadingTime(post.body);
  const headings = extractHeadings(post.body);
  const relatedArticles = await getRelatedArticles(slug, post.category);
  const hasHeadings = headings.length > 0;

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

  // JSON-LD structured data
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
    wordCount: post.body.trim().split(/\s+/).length,
    timeRequired: `PT${readingTime}M`,
  };

  return (
    <>
      <ScrollProgressBar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero area — contained with rounded corners, matching HeroBanner pattern */}
      {post.featuredImage && (
        <div className="relative w-full p-4 md:p-6 xl:p-8">
          <div className="relative overflow-hidden rounded-3xl h-[40vh] min-h-[320px] max-h-[480px]">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        </div>
      )}

      {/* Article content */}
      <Section>
        <Container className="px-[var(--layout-section-padding-x)] max-w-[1200px]">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/resources/articles"
              className="text-sm text-[color:var(--font-color-tertiary)] hover:text-[color:var(--color-cyan)] transition-colors"
            >
              &larr; Back to Articles
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-12 max-w-[800px]">
            <Heading level={1} size="h1" color="primary" className="mb-6">
              {post.title}
            </Heading>

            <div className="flex flex-wrap items-center gap-3">
              {formattedDate && (
                <Text size="body-sm" color="tertiary">
                  {formattedDate}
                </Text>
              )}
              {formattedDate && authorName && (
                <span className="text-[color:var(--font-color-tertiary)]">
                  &middot;
                </span>
              )}
              {authorName && (
                <Text size="body-sm" color="tertiary">
                  {authorName}
                </Text>
              )}
              {(formattedDate || authorName) && (
                <span className="text-[color:var(--font-color-tertiary)]">
                  &middot;
                </span>
              )}
              <Text size="body-sm" color="tertiary">
                {readingTime} min read
              </Text>
            </div>

            {post.description && (
              <Text
                size="body-lg"
                color="secondary"
                className="mt-6 leading-relaxed"
              >
                {post.description}
              </Text>
            )}
          </header>

          {/* Three-column layout: TOC | Content | Author sidebar */}
          {/* No items-start — columns stretch to full row height so sticky works */}
          <div className="xl:grid xl:grid-cols-[200px_1fr_260px] xl:gap-8 lg:grid lg:grid-cols-[200px_1fr] lg:gap-10">
            {/* Left: TOC (sticky, desktop only) */}
            {hasHeadings ? (
              <ArticleTableOfContents headings={headings} />
            ) : (
              <div className="hidden lg:block" />
            )}

            {/* Center: Article body */}
            <div>
              {/* Mobile TOC appears within article flow (handled inside TOC component) */}
              <article className="prose prose-invert prose-lg max-w-[65ch] prose-headings:text-[color:var(--font-color-primary)] prose-headings:font-bold prose-p:text-[color:var(--font-color-secondary)] prose-a:text-[color:var(--color-cyan)] prose-strong:text-[color:var(--font-color-primary)] prose-li:text-[color:var(--font-color-secondary)] prose-img:rounded-2xl">
                <ReactMarkdown components={markdownComponents}>
                  {post.body}
                </ReactMarkdown>
              </article>
            </div>

            {/* Right: Author bio sidebar (sticky on xl, below article on smaller) */}
            {authorData && (
              <aside className="mt-12 xl:mt-0">
                <div className="xl:sticky xl:top-24">
                  <AuthorBio author={authorData} />
                </div>
              </aside>
            )}
          </div>

          {/* Author bio for non-xl screens (when no sidebar) — shown below article */}
          {authorData && (
            <div className="xl:hidden mt-12 pt-8 border-t border-white/[0.08]">
              <div className="max-w-[65ch]">
                <AuthorBio author={authorData} />
              </div>
            </div>
          )}
        </Container>
      </Section>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <Section>
          <Container className="px-[var(--layout-section-padding-x)]">
            <RelatedArticles articles={relatedArticles} />
          </Container>
        </Section>
      )}

      {/* CTA */}
      <CTABanner
        backgroundSrc="/images/services/banner-bg.jpg"
        heading="It's time to get grounded"
        subtext="Ready to activate your brand purpose and accelerate your impact? Let's talk."
        primaryLabel="Contact Us"
        primaryHref="/contact"
        overlayOpacity="heavy"
      />
    </>
  );
}
