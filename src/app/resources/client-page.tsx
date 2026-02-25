"use client";

import React from "react";
import Link from "next/link";
import {
  MicrophoneStageIcon,
  ArticleIcon,
  BookOpenTextIcon,
  CompassIcon,
  type IconProps,
} from "@phosphor-icons/react";
import HeroBanner from "@/components/components/HeroBanner";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import FadeIn from "@/components/utils/FadeIn";
import NewsletterCTA from "@/components/components/NewsletterCTA";
import styles from "./resources.module.css";

/* ─── Data ───────────────────────────────────────────────── */

const CATEGORIES: {
  id: string;
  icon: React.ComponentType<IconProps>;
  title: string;
  subtitle: string;
  body: string;
  color: string;
  href: string;
}[] = [
  {
    id: "podcast",
    icon: MicrophoneStageIcon,
    title: "Podcast",
    subtitle: "It Shouldn't Be This Hard",
    body: "Lively, provocative discussions on why doing the right thing in business is harder than it should be.",
    color: "var(--color-azure-1)",
    href: "/resources/podcast",
  },
  {
    id: "articles",
    icon: ArticleIcon,
    title: "Articles & Blogs",
    subtitle: "Insights from the front lines",
    body: "An ever-evolving library of insights, provocations, and points of view from the Grounded team.",
    color: "var(--color-gold)",
    href: "/resources/articles",
  },
  {
    id: "whitepapers",
    icon: BookOpenTextIcon,
    title: "White Papers & Playbooks",
    subtitle: "Research & frameworks",
    body: "In-depth research and frameworks for sustainable fashion, brand purpose, and retail activation.",
    color: "var(--color-green)",
    href: "/resources/white-papers",
  },
  {
    id: "guides",
    icon: CompassIcon,
    title: "How To Guides",
    subtitle: "Step-by-step strategies",
    body: "Step-by-step guides to activating brand purpose, sustainability marketing, and social impact.",
    color: "var(--color-magenta)",
    href: "/resources/guides",
  },
];

/* ─── Sub-components ─────────────────────────────────────── */

function CategoryCard({ item }: { item: (typeof CATEGORIES)[number] }) {
  return (
    <Link
      href={item.href}
      className={`${styles.categoryCard} work-card-hover group block rounded-3xl bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 h-full overflow-hidden no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30`}
      {...({ style: { "--tile-color": item.color } } as React.HTMLAttributes<HTMLAnchorElement>)}
    >
      <div className="work-card-glow" />

      {/* Icon */}
      <div className="mb-6">
        <item.icon size={24} weight="duotone" className="text-[color:var(--tile-color)]" />
      </div>

      {/* Content */}
      <Heading level={3} size="h3" color="primary" className="mb-1.5 group-hover:text-[color:var(--tile-color)] transition-colors">
        {item.title}
      </Heading>
      <Text size="body-sm" color="tertiary" className="mb-4 font-medium">
        {item.subtitle}
      </Text>
      <Text size="body-md" color="secondary" className="mb-6 leading-relaxed">
        {item.body}
      </Text>

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

export default function ResourcesClientPage() {
  return (
    <div className="min-h-screen bg-(--background) text-white">

      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroBanner
        backgroundType="canvas"
        title="Resources"
        subtitle="Ideas, frameworks, and tools to help you activate brand purpose, sustainability, and social impact."
        minHeight="condensed"
        overlayOpacity="light"
        contentAlign="center"
      />

      {/* ── Resource Categories ──────────────────────────── */}
      <Section className="!pt-0 !pb-16 md:!pb-24">
        <Container className="px-[var(--layout-section-padding-x)]">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {CATEGORIES.map((item) => (
                <CategoryCard key={item.id} item={item} />
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* ── Newsletter ─────────────────────────────────── */}
      <NewsletterCTA
        backgroundSrc="/images/stockholm-metro-station-escalators-dark-underground.jpg"
        backgroundAlt="Stockholm metro station escalators"
      />
    </div>
  );
}
