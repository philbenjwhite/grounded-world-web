"use client";

import { useTina } from "tinacms/dist/react";
import type { PageQuery, PageSections } from "../../tina/__generated__/types";
import { renderSection } from "@/lib/tina-renderers";
import VideoHero from "@/components/components/VideoHero";
import LogoCarousel from "@/components/components/LogoCarousel";
import WorkCarousel from "@/components/components/WorkCarousel";
import type { WorkCarouselItem } from "@/components/components/WorkCarousel";
import NewsletterCTA from "@/components/components/NewsletterCTA";

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

  /* Newsletter CTA */
  const newsletterSection = data.page.sections?.find(
    (s) => (s as unknown as { __typename?: string })?.__typename === "PageSectionsNewsletterCta",
  ) as {
    backgroundSrc?: string;
    backgroundAlt?: string;
    newsletterHeading?: string;
    newsletterSubtext?: string;
    overlayOpacity?: string;
  } | undefined;

  return (
    <>
      <div className="h-[65dvh] md:h-[calc(100dvh-56px)]">
        <VideoHero
          backgroundVideoUrl={videoHeroSection?.backgroundVideoUrl}
          vimeoId={videoHeroSection?.vimeoId}
          heading={videoHeroSection?.heading}
          subheading={videoHeroSection?.subheading}
        />
      </div>

      <LogoCarousel logos={logos} speed={logoSpeed} />

      {data.page.sections
        ?.filter((s) => s?.__typename === "PageSectionsSplitLayout")
        .map((section, index) => renderSection(section as PageSections, index))}

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

      <NewsletterCTA
        backgroundSrc={newsletterSection?.backgroundSrc ?? "/images/stockholm-metro-station-escalators-dark-underground.jpg"}
        backgroundAlt={newsletterSection?.backgroundAlt ?? "Stockholm metro station escalators"}
        heading={newsletterSection?.newsletterHeading ?? undefined}
        subtext={newsletterSection?.newsletterSubtext ?? undefined}
        overlayOpacity={
          (newsletterSection?.overlayOpacity as "light" | "medium" | "heavy") ?? undefined
        }
      />
    </>
  );
}
