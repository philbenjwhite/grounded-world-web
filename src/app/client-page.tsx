"use client";

import { useTina } from "tinacms/dist/react";
import type { PageQuery } from "../../tina/__generated__/types";
import VideoHero from "@/components/components/VideoHero";
import LogoCarousel from "@/components/components/LogoCarousel";
import IntroSection from "@/components/components/IntroSection";
import ExpandingCardPanel from "@/components/components/ExpandingCardPanel";
import type { ExpandingCardItem } from "@/components/components/ExpandingCardPanel";
import WorkCarousel from "@/components/components/WorkCarousel";
import type { WorkCarouselItem } from "@/components/components/WorkCarousel";

interface HomeClientPageProps {
  query: string;
  variables: { relativePath: string };
  data: { page: PageQuery["page"] };
}

export default function HomeClientPage(props: HomeClientPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  /* Logo Carousel */
  const logoSection = data.page.sections?.find(
    (s) => s?.__typename === "PageSectionsLogoCarousel",
  ) as Record<string, unknown> | undefined;
  const logos = (
    logoSection?.logos as
      | Array<{ src?: string | null; alt?: string | null }>
      | undefined
  )?.filter(
    (l): l is { src: string; alt: string } => Boolean(l?.src && l?.alt),
  );
  const logoSpeed = logoSection?.speed as number | undefined;

  /* Intro Section */
  const introSection = data.page.sections?.find(
    (s) => s?.__typename === "PageSectionsIntroSection",
  ) as { heading?: string; paragraphs?: string[] } | undefined;

  /* Expanding Card Panel */
  const expandingCardSection = data.page.sections?.find(
    (s) => s?.__typename === "PageSectionsExpandingCardPanel",
  ) as {
    sectionTitle?: string;
    items?: Array<{
      name: string;
      color: string;
      icon?: string | null;
      tagline: string;
      bullets?: (string | null)[] | null;
      ctaHref: string;
      ctaLabel?: string | null;
      imageSrc?: string | null;
      imageAlt?: string | null;
    }>;
  } | undefined;

  const services: ExpandingCardItem[] | undefined = expandingCardSection?.items
    ?.filter(Boolean)
    .map((item) => ({
      name: item.name,
      color: item.color,
      icon: item.icon ?? undefined,
      tagline: item.tagline,
      bullets: (item.bullets?.filter(Boolean) as string[]) ?? [],
      ctaHref: item.ctaHref,
      ctaLabel: item.ctaLabel ?? undefined,
      imageSrc: item.imageSrc ?? undefined,
      imageAlt: item.imageAlt ?? undefined,
    }));

  /* Work Carousel — items are already resolved via GraphQL reference */
  const workCarouselSection = data.page.sections?.find(
    (s) => s?.__typename === "PageSectionsWorkCarousel",
  ) as {
    sectionTitle?: string;
    loop?: boolean;
    showArrows?: boolean;
    showDots?: boolean;
    items?: Array<{
      work?: {
        _sys: { filename: string };
        title: string;
        client: string;
        featuredImage?: string | null;
        description?: string | null;
      } | null;
    } | null> | null;
  } | undefined;

  const workCarouselItems: WorkCarouselItem[] =
    workCarouselSection?.items
      ?.filter(Boolean)
      .map((item) => item!.work)
      .filter(Boolean)
      .map((work) => ({
        slug: work!._sys.filename,
        title: work!.title,
        client: work!.client,
        featuredImage: work!.featuredImage ?? undefined,
        description: work!.description ?? undefined,
      })) ?? [];

  /* Video Hero */
  const videoHeroSection = data.page.sections?.find(
    (s) => s?.__typename === "PageSectionsVideoHero",
  ) as {
    backgroundVideoUrl?: string;
    vimeoId?: string;
    heading?: string;
    subheading?: string;
  } | undefined;

  return (
    <>
      <div className="h-[75dvh] md:h-[calc(100dvh-56px)]">
        <VideoHero
          backgroundVideoUrl={videoHeroSection?.backgroundVideoUrl}
          vimeoId={videoHeroSection?.vimeoId}
          heading={videoHeroSection?.heading}
          subheading={videoHeroSection?.subheading}
        />
      </div>

      <LogoCarousel logos={logos} speed={logoSpeed} />

      {introSection && (
        <IntroSection
          heading={introSection.heading ?? "Get Grounded"}
          paragraphs={
            (introSection.paragraphs?.filter(Boolean) as string[]) ?? []
          }
        />
      )}

      {services && services.length > 0 && (
        <ExpandingCardPanel items={services} />
      )}

      {workCarouselItems.length > 0 && (
        <WorkCarousel
          sectionTitle={workCarouselSection?.sectionTitle}
          items={workCarouselItems}
          loop={workCarouselSection?.loop ?? true}
          showArrows={workCarouselSection?.showArrows ?? true}
          showDots={workCarouselSection?.showDots ?? true}
          className="py-16 md:py-24"
        />
      )}
    </>
  );
}
