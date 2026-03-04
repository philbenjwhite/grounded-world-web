"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArticleIcon } from "@phosphor-icons/react";
import { iconMap } from "@/lib/iconMap";
import { useTina } from "tinacms/dist/react";
import type { PageQuery } from "../../../../tina/__generated__/types";
import HeroBanner from "@/components/components/HeroBanner";
import CTABanner from "@/components/components/CTABanner";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Grid from "@/components/layout/Grid";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import FilterPills from "@/components/atoms/FilterPills";
import FadeIn from "@/components/utils/FadeIn";
import cardStyles from "./articles.module.css";
import type { ArticleItem } from "./page";

const ITEMS_PER_PAGE = 12;

/** Fallback config used when a category has no CMS-driven icon/color */
const FALLBACK_CONFIG: Record<string, { icon: string; color: string }> = {
  "brand-purpose": { icon: "Compass", color: "#00AEEF" },
  "brand-activism": { icon: "Megaphone", color: "#FF08CC" },
  "social-impact": { icon: "Users", color: "#1CC35B" },
  partnerships: { icon: "Handshake", color: "#FFA603" },
  "retail-shopper": { icon: "ShoppingBag", color: "#E85DC7" },
  strategy: { icon: "Target", color: "#F0C040" },
  sustainability: { icon: "Leaf", color: "#40D8A0" },
};

const DEFAULT_ICON_COLOR = "#888888";
const DefaultIcon = ArticleIcon;

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function ArticleCard({ article }: { article: ArticleItem }) {
  const authorDisplay = article.authorName ?? article.author;

  return (
    <Link
      href={`/resources/articles/${article.slug}`}
      className="group flex flex-col h-full rounded-3xl overflow-hidden border border-white/[0.06] bg-white/[0.025] transition-colors hover:border-white/[0.12]"
    >
      {/* Image area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          (() => {
            const fallback = FALLBACK_CONFIG[article.categorySlug ?? ""];
            const iconKey = article.categoryIcon ?? fallback?.icon;
            const color = article.categoryColor ?? fallback?.color ?? DEFAULT_ICON_COLOR;
            const IconComp = (iconKey ? iconMap[iconKey] : null) ?? DefaultIcon;
            return (
              <div
                className="absolute inset-0"
                style={{ "--card-accent": color } as React.CSSProperties}
              >
                <div className={`absolute inset-0 ${cardStyles.cardGradient}`} />
                <div className={`absolute inset-0 opacity-[0.04] ${cardStyles.dotPattern}`} />
                <div
                  className="absolute inset-0 flex items-center justify-center text-[color:var(--card-accent)]"
                  aria-hidden="true"
                >
                  <div className="opacity-60 drop-shadow-[0_0_20px_currentColor]">
                    <IconComp size={80} weight="light" />
                  </div>
                </div>
              </div>
            );
          })()
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {article.categoryName && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-white/15 border border-white/20 backdrop-blur-sm">
            {article.categoryName}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        <Heading
          level={3}
          size="h4"
          color="primary"
          className="line-clamp-2 group-hover:text-[color:var(--color-cyan)] transition-colors"
        >
          {article.title}
        </Heading>

        <div className="flex items-center gap-2 text-[length:var(--font-size-body-xs)]">
          {article.date && (
            <Text size="body-xs" color="tertiary">
              {formatDate(article.date)}
            </Text>
          )}
          {article.date && authorDisplay && (
            <span className="text-[color:var(--font-color-tertiary)]">
              &middot;
            </span>
          )}
          {authorDisplay && (
            <Text size="body-xs" color="tertiary">
              {authorDisplay}
            </Text>
          )}
        </div>

        {article.description && (
          <Text size="body-sm" color="secondary" className="line-clamp-2">
            {article.description}
          </Text>
        )}

        <div className="mt-auto pt-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-cyan)] transition-colors">
            Read Article
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform group-hover:translate-x-1"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

interface ArticlesClientPageProps {
  articles: ArticleItem[];
  query: string;
  variables: { relativePath: string };
  data: { page: PageQuery["page"] };
}

export default function ArticlesClientPage(props: ArticlesClientPageProps) {
  const { articles } = props;
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  /* Hero Banner */
  const heroSection = data.page.sections?.find(
    (s) => s?.__typename === "PageSectionsHeroBanner",
  ) as {
    title?: string;
    subtitle?: string;
    overlayOpacity?: string;
    contentAlign?: string;
    minHeight?: string;
  } | undefined;

  /* CTA Banner */
  const ctaSection = data.page.sections?.find(
    (s) => s?.__typename === "PageSectionsCtaBanner",
  ) as {
    backgroundSrc?: string;
    backgroundAlt?: string;
    heading?: string;
    subtext?: string;
    primaryLabel?: string;
    primaryHref?: string;
    primaryExternal?: boolean;
    overlayOpacity?: string;
  } | undefined;

  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Derive unique categories from the actual data
  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, string>();
    for (const article of articles) {
      if (article.categoryName && article.categorySlug) {
        uniqueCategories.set(article.categorySlug, article.categoryName);
      }
    }
    // Sort alphabetically by display name
    return Array.from(uniqueCategories.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([slug, name]) => ({ slug, name }));
  }, [articles]);

  const allCategoryLabels = useMemo(
    () => ["All", ...categories.map((c) => c.name)],
    [categories]
  );

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    const matchCat = categories.find((c) => c.name === activeCategory);
    if (!matchCat) return articles;
    return articles.filter((a) => a.categorySlug === matchCat.slug);
  }, [articles, activeCategory, categories]);

  // Reset visible count when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArticles.length;

  return (
    <div className="min-h-screen bg-(--background) text-white">
      {/* Hero */}
      <HeroBanner
        backgroundType="canvas"
        title={heroSection?.title ?? "Articles & Blogs"}
        subtitle={heroSection?.subtitle ?? undefined}
        minHeight={
          (heroSection?.minHeight as "full" | "large" | "medium" | "condensed" | "fit") ?? "condensed"
        }
        overlayOpacity={
          (heroSection?.overlayOpacity as "light" | "medium" | "heavy") ?? "light"
        }
        contentAlign={
          (heroSection?.contentAlign as "center" | "left") ?? "center"
        }
      />

      {/* Articles Grid */}
      <Section>
        <Container className="px-[var(--layout-section-padding-x)]">
          {/* Category Filters */}
          <FadeIn>
            <FilterPills
              items={allCategoryLabels}
              active={activeCategory}
              onChange={handleCategoryChange}
              align="start"
              className="mb-12 md:mb-16"
            />
          </FadeIn>

          {/* Results count */}
          <Text size="body-sm" color="tertiary" className="mb-8">
            Showing {visibleArticles.length} of {filteredArticles.length}{" "}
            articles
          </Text>

          {/* Card Grid */}
          {visibleArticles.length > 0 ? (
            <Grid cols={3} colsTablet={2} colsMobile={1} gap="lg">
              {visibleArticles.map((article) => (
                <FadeIn key={article.slug}>
                  <ArticleCard article={article} />
                </FadeIn>
              ))}
            </Grid>
          ) : (
            <div className="text-center py-16">
              <Text size="body-lg" color="tertiary">
                No articles found in this category.
              </Text>
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="flex justify-center mt-12 md:mt-16">
              <Button
                variant="secondary"
                onClick={() =>
                  setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                }
              >
                Load More Articles
              </Button>
            </div>
          )}
        </Container>
      </Section>

      {/* CTA */}
      {ctaSection?.backgroundSrc && ctaSection?.heading && ctaSection?.primaryLabel && ctaSection?.primaryHref && (
        <CTABanner
          backgroundSrc={ctaSection.backgroundSrc}
          backgroundAlt={ctaSection.backgroundAlt ?? undefined}
          heading={ctaSection.heading}
          subtext={ctaSection.subtext ?? undefined}
          primaryLabel={ctaSection.primaryLabel}
          primaryHref={ctaSection.primaryHref}
          primaryExternal={ctaSection.primaryExternal ?? false}
          overlayOpacity={
            (ctaSection.overlayOpacity as "light" | "medium" | "heavy") ?? undefined
          }
        />
      )}
    </div>
  );
}
