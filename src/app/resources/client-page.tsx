"use client";

import React from "react";
import Link from "next/link";
import { useTina } from "tinacms/dist/react";
import type { PageQuery } from "../../../tina/__generated__/types";
import HeroBanner from "@/components/components/HeroBanner";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import FadeIn from "@/components/utils/FadeIn";
import { iconMap } from "@/lib/iconMap";
import styles from "./resources.module.css";

/* ─── Types ───────────────────────────────────────────────── */

interface CategoryItem {
  icon?: string;
  iconColor?: string;
  title: string;
  subtitle?: string;
  body?: string;
  href?: string;
}

/* ─── Sub-components ─────────────────────────────────────── */

function CategoryCard({ item }: { item: CategoryItem }) {
  const IconComponent = item.icon ? iconMap[item.icon] : null;
  const color = item.iconColor ?? "var(--color-cyan)";

  return (
    <Link
      href={item.href ?? "#"}
      className={`${styles.categoryCard} work-card-hover group block rounded-3xl bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 h-full overflow-hidden no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30`}
      {...({ style: { "--tile-color": color } } as React.HTMLAttributes<HTMLAnchorElement>)}
    >
      <div className="work-card-glow" />

      {/* Icon */}
      {IconComponent && (
        <div className="mb-6">
          <IconComponent size={24} weight="duotone" className="text-[color:var(--tile-color)]" />
        </div>
      )}

      {/* Content */}
      <Heading level={3} size="h3" color="primary" className="mb-1.5 group-hover:text-[color:var(--tile-color)] transition-colors">
        {item.title}
      </Heading>
      {item.subtitle && (
        <Text size="body-sm" color="tertiary" className="mb-4 font-medium">
          {item.subtitle}
        </Text>
      )}
      {item.body && (
        <Text size="body-md" color="secondary" className="mb-6 leading-relaxed">
          {item.body}
        </Text>
      )}

      {/* Footer */}
      <div className="flex items-center justify-end mt-auto">
        <span className={`${styles.categoryExplore} inline-flex items-center gap-1.5 text-sm font-semibold transition-colors`}>
          Explore
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
    </Link>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */

interface ResourcesClientPageProps {
  query: string;
  variables: { relativePath: string };
  data: { page: PageQuery["page"] };
}

export default function ResourcesClientPage(props: ResourcesClientPageProps) {
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

  /* Card Grid (resource categories) */
  const cardGridSection = data.page.sections?.find(
    (s) => s?.__typename === "PageSectionsCardGrid",
  ) as {
    items?: CategoryItem[];
  } | undefined;

  const categories = (cardGridSection?.items ?? []).filter(Boolean);

  return (
    <div className="min-h-screen bg-(--background) text-white">

      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroBanner
        backgroundType="canvas"
        title={heroSection?.title ?? "Resources"}
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

      {/* ── Resource Categories ──────────────────────────── */}
      {categories.length > 0 && (
        <Section className="!pt-0 !pb-16 md:!pb-24">
          <Container className="px-[var(--layout-section-padding-x)]">
            <FadeIn>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {categories.map((item, index) => (
                  <CategoryCard key={item.title ?? index} item={item} />
                ))}
              </div>
            </FadeIn>
          </Container>
        </Section>
      )}

    </div>
  );
}
