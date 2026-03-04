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
}

export default function ArticleDetailClientPage(
  props: ArticleDetailClientPageProps,
) {
  const { headings, authorData, readingTime, relatedArticles, slug, jsonLd } =
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
          <div className="xl:grid xl:grid-cols-[200px_1fr_260px] xl:gap-8 lg:grid lg:grid-cols-[200px_1fr] lg:gap-10">
            {/* Left: TOC sidebar (desktop only) */}
            {hasHeadings ? (
              <ArticleTableOfContents headings={headings} variant="sidebar" />
            ) : (
              <div className="hidden lg:block" />
            )}

            {/* Center: Article body */}
            <div>
              {/* Mobile: sticky TOC inside article container */}
              {hasHeadings && (
                <ArticleTableOfContents headings={headings} variant="mobile" />
              )}
              <article className="prose prose-invert prose-lg max-w-[65ch] prose-headings:text-[color:var(--font-color-primary)] prose-headings:font-bold prose-headings:scroll-mt-28 prose-p:text-[color:var(--font-color-secondary)] prose-a:text-[color:var(--color-cyan)] prose-strong:text-[color:var(--font-color-primary)] prose-li:text-[color:var(--font-color-secondary)] prose-img:rounded-2xl">
                {post.body && (
                  <TinaMarkdown
                    content={post.body}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    components={tinaMarkdownComponents as any}
                  />
                )}
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
