"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import HeroBanner from "@/components/components/HeroBanner";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Grid from "@/components/layout/Grid";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import FadeIn from "@/components/utils/FadeIn";
import SlideCarousel from "@/components/components/SlideCarousel";
import MediaSection from "@/components/components/MediaSection";
import CTABanner from "@/components/components/CTABanner";
import SectionLabel from "@/components/atoms/SectionLabel";
import type { MediaItem } from "@/components/components/MediaSection";
import styles from "./resources.module.css";

/* ─── Data ───────────────────────────────────────────────── */

const NAV_TILES = [
  {
    id: "podcast",
    icon: "/images/resources-icon-podcast.png",
    title: "Podcast",
    body: "Lively, provocative discussions on why doing the right thing in business is harder than it should be.",
    color: "var(--color-azure-1)",
    href: "/resources/podcast",
  },
  {
    id: "whitepapers",
    icon: "/images/resources-icon-whitepapers.png",
    title: "White Papers & Playbooks",
    body: "In-depth research and frameworks for sustainable fashion, brand purpose, and retail activation.",
    color: "var(--color-green)",
    href: "/resources/white-papers",
  },
  {
    id: "guides",
    icon: "/images/resources-icon-guides.png",
    title: "How To Guides",
    body: "Step-by-step guides to activating brand purpose, sustainability marketing, and social impact.",
    color: "var(--color-magenta)",
    href: "/resources/guides",
  },
  {
    id: "articles",
    icon: "/images/resources-icon-articles.png",
    title: "Articles & Blogs",
    body: "An ever-evolving library of insights, provocations, and points of view from the Grounded team.",
    color: "var(--color-gold)",
    href: "/resources/articles",
  },
];

const WHITE_PAPERS = [
  {
    id: "fashion-wp",
    category: "Sustainable Fashion",
    title: "Mind the Gap: Policy to Profit in Fashion",
    subtitle: "How new rules can create commercial wins for fashion",
    body: "Grounded's seminal white paper examines how evolving policy creates real commercial opportunity for fashion brands — featuring legal expertise and AI-powered recommendations via Gaia.",
    imageSrc: "/images/resources-whitepaper-fashion.jpg",
    imageAlt: "Mind the Gap: Policy to Profit in Fashion white paper cover",
    ctaLabel: "Download Now",
    ctaHref: "https://grounded.world/resources/",
    ctaExternal: true,
    accentColor: "var(--color-green)",
  },
  {
    id: "ana-wp",
    category: "Brand Purpose",
    title: "Articulating Brand Purpose: The BPP Framework",
    subtitle: "Connect the WHY of purpose to the WAY of profit",
    body: "Published by the ANA Center for Brand Purpose, this playbook is recognised globally as a best-in-class approach for articulating brand and corporate purpose.",
    imageSrc: "/images/resources-whitepaper-ana.png",
    imageAlt: "ANA Brand Purpose Playbook cover",
    ctaLabel: "Download Now",
    ctaHref: "https://www.ana.net/miccontent/show/id/kp-2023-07-grounded-media-articulating-brand-purpose",
    ctaExternal: true,
    accentColor: "var(--color-azure-1)",
  },
  {
    id: "retail-wp",
    category: "Retail Activation",
    title: "Excellence in Execution: Retail Activation for Good",
    subtitle: "Activate brand purpose and sustainability at the shelf",
    body: "Built on three years of proprietary research and consultation with the world's largest brand owners and retailers — frameworks, tools, and case studies for retail activation.",
    imageSrc: "/images/resources-whitepaper-retail.jpg",
    imageAlt: "Retail Activation for Good playbook cover",
    ctaLabel: "Download Now",
    ctaHref: "https://grounded.world/resources/",
    ctaExternal: true,
    accentColor: "var(--color-magenta)",
  },
];

const GUIDES = [
  {
    id: "guide-brand-purpose",
    title: "Activating Brand Purpose",
    description: "Close the intention-action gap and change consumer behaviour",
    imageUrl: "/images/resources-guide-activating-brand-purpose.jpg",
    imageAlt: "Activating Brand Purpose guide cover",
  },
  {
    id: "guide-sustainability",
    title: "Sustainability Marketing",
    description: "Unpack what sustainability marketing is, along with key challenges and case studies",
    imageUrl: "/images/resources-guide-sustainability-marketing.jpg",
    imageAlt: "Sustainability Marketing guide cover",
  },
  {
    id: "guide-social-impact",
    title: "Social Impact",
    description: "Discover what a social impact agency does and how to choose the right partner",
    imageUrl: "/images/resources-guide-social-impact.jpg",
    imageAlt: "Social Impact guide cover",
  },
  {
    id: "guide-brand-activism",
    title: "Brand Activism",
    description: "Learn how to take a stand and avoid the pitfalls of performative activism",
    imageUrl: "/images/resources-guide-brand-activism.jpg",
    imageAlt: "Brand Activism guide cover",
  },
];

const ARTICLE_CATEGORIES = [
  "Activating Brand Purpose and Sustainability",
  "Sustainability Marketing",
  "Social Impact",
  "Brand Activism",
];

const ARTICLES: MediaItem[] = [
  {
    id: "article-earth-day",
    title: "Making Earth Day Every Day Shouldn't Be This Hard | Kathleen Rogers",
    category: "Activating Brand Purpose and Sustainability",
    imageUrl: "/images/resources-article-earth-day-kathleen-rogers.png",
    imageAlt: "Kathleen Rogers — Earth Day episode cover",
    href: "/posts",
  },
  {
    id: "article-jennifer",
    title: "A Future Without Cigarettes Shouldn't Be This Hard | Jennifer Motles",
    category: "Sustainability Marketing",
    imageUrl: "/images/resources-article-jennifer-motles.png",
    imageAlt: "Jennifer Motles episode cover",
    href: "/posts",
  },
  {
    id: "article-coffee",
    title: "Fair Price for Coffee Shouldn't Be This Hard | Bob & Michelle Fish",
    category: "Social Impact",
    imageUrl: "/images/resources-article-bob-michelle-fish.png",
    imageAlt: "Bob and Michelle Fish episode cover",
    href: "/posts",
  },
  {
    id: "article-nov",
    title: "Circular Brand Activation in Switzerland",
    category: "Brand Activism",
    imageUrl: "/images/resources-article-nov-2025.png",
    imageAlt: "Circular Brand Activation article cover",
    href: "/posts",
  },
  {
    id: "article-green-friday",
    title: "Green Friday Brand Activation: Inspiring Sustainable Choices",
    category: "Activating Brand Purpose and Sustainability",
    href: "/posts",
  },
  {
    id: "article-circular-cities",
    title: "Circular Cities in Action: Urban Design Innovations from Switzerland",
    category: "Sustainability Marketing",
    href: "/posts",
  },
];

/* ─── Sub-components ─────────────────────────────────────── */

function QuickNavTile({
  tile,
}: {
  tile: (typeof NAV_TILES)[number];
}) {
  return (
    <a
      href={tile.href}
      className={`${styles.navTile} work-card-hover group block rounded-3xl bg-white/[0.03] backdrop-blur-xl p-8 h-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30`}
      {...({ style: { "--tile-color": tile.color } } as React.HTMLAttributes<HTMLAnchorElement>)}
    >
      <div className="work-card-glow" />
      <div className="mb-5 w-12 h-12 relative">
        <Image
          src={tile.icon}
          alt=""
          fill
          className="object-contain"
          aria-hidden="true"
        />
      </div>
      <Heading level={3} size="h4" color="primary" className="mb-3 group-hover:text-[color:var(--tile-color)] transition-colors">
        {tile.title}
      </Heading>
      <Text size="body-md" color="secondary">
        {tile.body}
      </Text>
      <div className={`${styles.navTileExplore} mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors`}>
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
      </div>
    </a>
  );
}

function WhitePaperCard({
  paper,
}: {
  paper: (typeof WHITE_PAPERS)[number];
}) {
  return (
    <FadeIn>
      <div
        className={`${styles.whitePaperCard} flex flex-col h-full rounded-3xl overflow-hidden border bg-white/[0.025]`}
        {...({ style: { "--accent-color": paper.accentColor } } as React.HTMLAttributes<HTMLDivElement>)}
      >
        {/* Cover image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
          <Image
            src={paper.imageSrc}
            alt={paper.imageAlt}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className={`${styles.whitePaperBadge} absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white`}>
            {paper.category}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-8">
          <Heading level={3} size="h4" color="primary" className="mb-2">
            {paper.title}
          </Heading>
          <Text size="body-sm" color="tertiary" className="mb-3 font-medium">
            {paper.subtitle}
          </Text>
          <Text size="body-md" color="secondary" className="flex-1 mb-6 leading-relaxed">
            {paper.body}
          </Text>
          <div>
            <Button
              href={paper.ctaHref}
              variant="secondary"
              target={paper.ctaExternal ? "_blank" : undefined}
            >
              {paper.ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */

export default function ResourcesClientPage() {
  const router = useRouter();

  const handleArticleClick = (item: MediaItem) => {
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <div className="min-h-screen bg-(--background) text-white">

      {/* ── 1. Hero ───────────────────────────────────────── */}
      <HeroBanner
        backgroundType="canvas"
        title="Resources"
        subtitle="Ideas, frameworks, and tools to help you activate brand purpose, sustainability, and social impact."
        minHeight="condensed"
        overlayOpacity="light"
        contentAlign="center"
      />

      {/* ── 2. Quick Navigation ───────────────────────────── */}
      <Section className="!pt-0 !pb-16 md:!pb-20">
        <Container className="px-[var(--layout-section-padding-x)]">
          <FadeIn>
            <Grid cols={4} colsTablet={2} colsMobile={1} gap="md">
              {NAV_TILES.map((tile) => (
                <QuickNavTile key={tile.id} tile={tile} />
              ))}
            </Grid>
          </FadeIn>
        </Container>
      </Section>

      {/* ── 3. Podcast ────────────────────────────────────── */}
      <section
        id="podcast"
        className="py-[var(--layout-section-padding-y)] bg-(--background) scroll-mt-20"
      >
        <Container className="px-[var(--layout-section-padding-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — cover art */}
            <FadeIn className="order-2 lg:order-1">
              <div className="relative rounded-3xl overflow-hidden aspect-square max-w-md mx-auto lg:mx-0">
                <Image
                  src="/images/resources-podcast-cover.jpg"
                  alt="It Shouldn't Be This Hard podcast cover"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>

            {/* Right — text */}
            <FadeIn className="order-1 lg:order-2 flex flex-col gap-6">
              <SectionLabel>Podcast</SectionLabel>
              <Heading level={2} size="h2" color="primary">
                It Shouldn&apos;t Be This Hard
              </Heading>
              <Text size="body-lg" color="secondary" className="leading-relaxed">
                The podcast for people who know that responsible business is messy, meaningful,
                and probably much harder than it should be.
              </Text>
              <Text size="body-md" color="secondary" className="leading-relaxed">
                Co-founders Heidi Schoeneck and Phil White sit down with founders, corporate
                change-makers, sustainability leaders, and social entrepreneurs for honest —
                sometimes radically transparent — conversations about power, profit, fear, and
                failure, along with the barriers that frustrate real progress.
              </Text>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  href="https://grounded.world/itshouldntbethishard"
                  variant="primary"
                  target="_blank"
                >
                  Listen to the Podcast
                </Button>
                <Button
                  href="https://grounded.world/itshouldntbethishard"
                  variant="secondary"
                  target="_blank"
                >
                  Apply to be a Guest
                </Button>
              </div>
            </FadeIn>

          </div>
        </Container>
      </section>

      {/* ── 4. White Papers & Playbooks ───────────────────── */}
      <section
        id="whitepapers"
        className="py-[var(--layout-section-padding-y)] bg-(--background) scroll-mt-20"
      >
        <Container className="px-[var(--layout-section-padding-x)]">
          <FadeIn>
            <div className="mb-12 md:mb-16">
              <SectionLabel className="mb-4">Research & Frameworks</SectionLabel>
              <Heading level={2} size="h2" color="primary">
                White Papers &amp; Playbooks
              </Heading>
            </div>
          </FadeIn>

          <Grid cols={3} colsTablet={1} colsMobile={1} gap="lg">
            {WHITE_PAPERS.map((paper) => (
              <WhitePaperCard key={paper.id} paper={paper} />
            ))}
          </Grid>
        </Container>
      </section>

      {/* ── 5. How To Guides ──────────────────────────────── */}
      <section
        id="guides"
        className="py-[var(--layout-section-padding-y)] bg-(--background) scroll-mt-20"
      >
        <Container className="px-[var(--layout-section-padding-x)]">
          <FadeIn>
            <div className="mb-12 md:mb-16">
              <SectionLabel className="mb-4">Step-by-Step</SectionLabel>
              <Heading level={2} size="h2" color="primary" className="mb-4">
                How To Guides
              </Heading>
              <Text size="body-lg" color="secondary" className="max-w-2xl">
                Get grounded in the fundamentals of activating purpose, sustainability, and
                social impact.
              </Text>
            </div>
          </FadeIn>

          <SlideCarousel items={GUIDES} loop />
        </Container>
      </section>

      {/* ── 6. Articles & Blogs ───────────────────────────── */}
      <section id="articles" className="scroll-mt-20">
        <MediaSection
          title="Articles &amp; Blogs"
          categories={ARTICLE_CATEGORIES}
          items={ARTICLES}
          onItemClick={handleArticleClick}
        />
        <div className="flex justify-center pb-16 md:pb-24 bg-(--comp-media-section-surface)">
          <Button href="/posts" variant="secondary">
            View All Articles
          </Button>
        </div>
      </section>

      {/* ── 7. CTA Banner ─────────────────────────────────── */}
      <CTABanner
        backgroundSrc="/images/services/banner-bg.jpg"
        heading="It's time to get grounded"
        subtext="Ready to activate your brand purpose and accelerate your impact? Let's talk."
        primaryLabel="Contact Us"
        primaryHref="/contact"
        overlayOpacity="heavy"
      />

    </div>
  );
}
