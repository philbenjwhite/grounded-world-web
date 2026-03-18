"use client";

import Image from "next/image";
import Link from "next/link";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { TinaMarkdownContent } from "tinacms/dist/rich-text";
import type { PostQuery } from "../../../../../tina/__generated__/types";
import type { TocHeading } from "@/lib/extract-headings";
import { slugify, extractText } from "@/lib/extract-headings";
import type { AuthorData } from "@/lib/authors";
import type { RelatedArticleItem } from "@/components/components/RelatedArticles/RelatedArticles";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Split from "@/components/layout/Split";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import CTABanner from "@/components/components/CTABanner";
import ScrollProgressBar from "@/components/components/ScrollProgressBar";
import ArticleTableOfContents from "@/components/components/ArticleTableOfContents";
import AuthorBio from "@/components/components/AuthorBio";
import RelatedArticles from "@/components/components/RelatedArticles";
import detailStyles from "./article-detail.module.css";

/* Custom heading component that adds id attributes for TOC anchor links */
function createHeadingComponent(level: number) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  const HeadingComponent = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => {
    const text = extractText(children);
    const id = slugify(text);
    return <Tag id={id}>{children}</Tag>;
  };
  HeadingComponent.displayName = `H${level}TinaRenderer`;
  return HeadingComponent;
}

/* ── Embedded block renderers for rich-text templates ── */

function EmbeddedCtaBanner(props: {
  backgroundSrc: string;
  heading: string;
  subtext?: string;
  primaryLabel: string;
  primaryHref: string;
  primaryExternal?: boolean;
  overlayOpacity?: string;
}) {
  return (
    <div className="not-prose my-12">
      <CTABanner
        backgroundSrc={props.backgroundSrc}
        heading={props.heading}
        subtext={props.subtext}
        primaryLabel={props.primaryLabel}
        primaryHref={props.primaryHref}
        primaryExternal={props.primaryExternal}
        overlayOpacity={
          (props.overlayOpacity as "light" | "medium" | "heavy") ?? "medium"
        }
      />
    </div>
  );
}

function EmbeddedSplitLayout(props: {
  imageSrc: string;
  imageAlt?: string;
  content?: TinaMarkdownContent;
  imagePosition?: string;
  ratio?: string;
}) {
  const imageElement = (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
      <Image
        src={props.imageSrc}
        alt={props.imageAlt ?? ""}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );

  const contentElement = (
    <div className="prose prose-invert prose-lg max-w-none prose-headings:text-[color:var(--font-color-primary)] prose-p:text-[color:var(--font-color-secondary)] prose-a:text-[color:var(--color-cyan)] prose-strong:text-[color:var(--font-color-primary)]">
      {props.content && <TinaMarkdown content={props.content} />}
    </div>
  );

  const isImageRight = props.imagePosition === "right";

  return (
    <div className="not-prose my-12">
      <Split
        left={isImageRight ? contentElement : imageElement}
        right={isImageRight ? imageElement : contentElement}
        ratio={(props.ratio as "50/50" | "40/60" | "60/40") ?? "50/50"}
        gap="lg"
        align="center"
        reverseOnMobile
      />
    </div>
  );
}

function EmbeddedImageGallery(props: {
  layout?: string;
  images?: Array<{
    src: string;
    alt?: string;
    caption?: string;
  }>;
}) {
  if (!props.images?.length) return null;

  const cols = props.layout === "grid-3" ? 3 : 2;

  return (
    <div className="not-prose my-12">
      <div
        className={`grid gap-4 ${
          cols === 3
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {props.images.map((image, index) => (
          <figure key={index} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white/5">
              <Image
                src={image.src}
                alt={image.alt ?? ""}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={
                  cols === 3
                    ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    : "(max-width: 640px) 100vw, 50vw"
                }
              />
            </div>
            {image.caption && (
              <figcaption className="mt-2 text-sm text-[color:var(--font-color-tertiary)]">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}

const pullQuoteStyles = {
  default:
    "border-l-4 border-[var(--color-cyan)] pl-6 py-2",
  highlight:
    "bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 text-center",
  bordered:
    "border-y border-white/[0.12] py-8 my-4",
};

function EmbeddedPullQuote(props: {
  quote: string;
  attribution?: string;
  style?: string;
}) {
  const styleClass =
    pullQuoteStyles[(props.style as keyof typeof pullQuoteStyles) ?? "default"] ??
    pullQuoteStyles.default;

  return (
    <div className={`not-prose my-12 ${styleClass}`}>
      <blockquote>
        <Text
          size="body-lg"
          color="primary"
          className="text-xl md:text-2xl font-medium leading-relaxed italic"
        >
          &ldquo;{props.quote}&rdquo;
        </Text>
        {props.attribution && (
          <footer className="mt-4">
            <Text size="body-sm" color="tertiary">
              &mdash; {props.attribution}
            </Text>
          </footer>
        )}
      </blockquote>
    </div>
  );
}

const tinaMarkdownComponents = {
  h2: createHeadingComponent(2),
  h3: createHeadingComponent(3),
  ctaBanner: EmbeddedCtaBanner,
  splitLayout: EmbeddedSplitLayout,
  imageGallery: EmbeddedImageGallery,
  pullQuote: EmbeddedPullQuote,
};

export interface ArticleCtaData {
  backgroundSrc?: string;
  heading?: string;
  subtext?: string;
  primaryLabel?: string;
  primaryHref?: string;
}

interface ArticleDetailClientPageProps {
  query: string;
  variables: { relativePath: string };
  data: { post: PostQuery["post"] };
  headings: TocHeading[];
  authorData?: AuthorData;
  readingTime: number;
  relatedArticles: RelatedArticleItem[];
  slug: string;
  jsonLd: Record<string, unknown>;
  articleCta?: ArticleCtaData;
}

export default function ArticleDetailClientPage(
  props: ArticleDetailClientPageProps,
) {
  const { headings, authorData, readingTime, relatedArticles, slug, jsonLd, articleCta } =
    props;

  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const post = data.post;
  const authorName = authorData?.name ?? post.author?.name;
  const hasHeadings = headings.length > 0;

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : undefined;

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
          {/* Breadcrumb + Category */}
          <nav className="mb-8 flex flex-wrap items-center gap-3">
            <Link
              href="/resources/articles"
              className="inline-flex items-center gap-2 text-sm text-[color:var(--font-color-tertiary)] border border-white/[0.12] rounded-full px-4 py-1.5 hover:border-[var(--color-cyan)] hover:text-[color:var(--color-cyan)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Articles
            </Link>
            {post.category?.name && (
              <span className="inline-flex items-center text-xs font-medium uppercase tracking-wider text-[color:var(--color-cyan)] border border-[var(--color-cyan)]/20 bg-[var(--color-cyan)]/[0.06] rounded-full px-3.5 py-1.5">
                {post.category.name}
              </span>
            )}
          </nav>

          {/* Header */}
          <header className="mb-12 max-w-[800px]">
            <Heading level={1} size="h2" color="primary" className="mb-4">
              {post.title}
            </Heading>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[color:var(--font-color-tertiary)]">
              {authorName && (
                <span className="inline-flex items-center gap-2">
                  {authorData?.photoUrl ? (
                    <Image
                      src={authorData.photoUrl}
                      alt={authorName}
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-[var(--color-cyan)]/20 flex items-center justify-center text-[10px] font-bold text-[color:var(--color-cyan)]">
                      {authorName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </span>
                  )}
                  {authorName}
                </span>
              )}
              {formattedDate && (
                <span className="inline-flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60">
                    <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
                    <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  </svg>
                  {formattedDate}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 opacity-60">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25" />
                  <path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {readingTime} min read
              </span>
            </div>

            {post.description && (
              <Text
                size="body-lg"
                color="secondary"
                className="mt-5 leading-relaxed"
              >
                {post.description}
              </Text>
            )}
          </header>

          {/* Two-column layout: Content | Sidebar (author + TOC) */}
          <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-12">
            {/* Left: Article body */}
            <div>
              {/* Mobile: sticky TOC inside article container */}
              {hasHeadings && (
                <ArticleTableOfContents headings={headings} variant="mobile" />
              )}
              <article className={`prose prose-invert prose-lg max-w-prose prose-headings:text-[color:var(--font-color-primary)] prose-headings:font-bold prose-headings:scroll-mt-28 prose-p:text-[color:var(--font-color-secondary)] prose-a:text-[color:var(--color-cyan)] prose-a:no-underline prose-strong:text-[color:var(--font-color-primary)] prose-li:text-[color:var(--font-color-secondary)] prose-img:rounded-2xl prose-pre:whitespace-pre-wrap prose-pre:break-words prose-pre:font-sans prose-pre:text-base prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-0 ${detailStyles.proseLinks}`}>
                {post.body && (
                  <TinaMarkdown
                    content={post.body}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    components={tinaMarkdownComponents as any}
                  />
                )}
              </article>
            </div>

            {/* Right sidebar: TOC + Author (sticky) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                {hasHeadings && (
                  <ArticleTableOfContents headings={headings} variant="sidebar" />
                )}
                {authorData && <AuthorBio author={authorData} />}
              </div>
            </aside>
          </div>

          {/* Author bio below article on mobile/tablet */}
          {authorData && (
            <div className="lg:hidden mt-12 pt-8 border-t border-white/[0.08]">
              <AuthorBio author={authorData} />
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
        backgroundSrc={articleCta?.backgroundSrc || "/images/services/banner-bg.jpg"}
        heading={articleCta?.heading || "It's time to get grounded"}
        subtext={articleCta?.subtext || "Ready to activate your brand purpose and accelerate your impact? Let's talk."}
        primaryLabel={articleCta?.primaryLabel || "Contact Us"}
        primaryHref={articleCta?.primaryHref || "/contact-us"}
        overlayOpacity="heavy"
      />
    </>
  );
}
