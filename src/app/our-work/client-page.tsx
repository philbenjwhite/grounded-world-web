"use client";

import { useTina } from "tinacms/dist/react";
import type { PageQuery, PageSections } from "../../../tina/__generated__/types";
import HeroBanner from "@/components/components/HeroBanner";
import LogoCarousel from "@/components/components/LogoCarousel";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Split from "@/components/layout/Split";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import WorkGrid from "@/components/components/WorkGrid";
import type { WorkItem } from "@/components/components/WorkGrid";
import CTABanner from "@/components/components/CTABanner";

interface ClientPageProps {
  query: string;
  variables: { relativePath: string };
  data: { page: PageQuery["page"] };
  workItems: WorkItem[];
}

export default function OurWorkClientPage(props: ClientPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  /* Hero Banner */
  const heroSection = data.page.sections?.find(
    (s): s is PageSections & { __typename: "PageSectionsHeroBanner" } =>
      s?.__typename === "PageSectionsHeroBanner",
  );

  /* Intro Section — rendered as a two-column split */
  const introSection = data.page.sections?.find(
    (s) => s?.__typename === "PageSectionsIntroSection",
  ) as { heading?: string; paragraphs?: string[] } | undefined;

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

  const introParagraphs = (
    introSection?.paragraphs?.filter(Boolean) as string[]
  ) ?? [];

  return (
    <div className="min-h-screen bg-(--background) text-white">
      {/* Hero — padded + rounded to match homepage VideoHero treatment */}
      <div className="p-4 md:p-6">
        <div className="overflow-hidden rounded-3xl">
          <HeroBanner
            backgroundType={
              (heroSection?.backgroundType as "vimeo" | "image" | "canvas") ??
              "canvas"
            }
            vimeoUrl={heroSection?.vimeoUrl ?? undefined}
            posterSrc={heroSection?.posterSrc ?? undefined}
            imageSrc={heroSection?.imageSrc ?? undefined}
            imageAlt={heroSection?.imageAlt ?? undefined}
            title={heroSection?.title ?? "Our Work"}
            subtitle={heroSection?.subtitle ?? undefined}
            ctaLabel={heroSection?.ctaLabel ?? undefined}
            ctaHref={heroSection?.ctaHref ?? undefined}
            ctaVariant={
              (heroSection?.ctaVariant as "solid" | "outline") ?? undefined
            }
            overlayOpacity={
              (heroSection?.overlayOpacity as "light" | "medium" | "heavy") ??
              "medium"
            }
            contentAlign={
              (heroSection?.contentAlign as "center" | "left") ?? "center"
            }
            minHeight={
              (heroSection?.minHeight as "full" | "large" | "medium") ?? "large"
            }
            bottomFade={false}
          />
        </div>
      </div>

      {/* Two-column intro — data from TinaCMS introSection */}
      {introSection && (
        <Section className="!py-16 md:!py-24 !pb-4 md:!pb-8">
          <Container className="px-[var(--layout-section-padding-x)]">
            <Split
              ratio="50/50"
              gap="xl"
              align="start"
              left={
                <Heading level={2} size="h2" color="primary">
                  {introSection.heading}
                </Heading>
              }
              right={
                <div className="flex flex-col gap-6">
                  {introParagraphs.map((text, i) => (
                    <Text key={i} size="body-lg" color="secondary">
                      {text}
                    </Text>
                  ))}
                </div>
              }
            />
          </Container>
        </Section>
      )}

      <LogoCarousel logos={logos} speed={logoSpeed} />

      <WorkGrid items={props.workItems} sectionTitle="Projects" />

      <CTABanner
        backgroundSrc="/images/stockholm-metro-station-escalators-dark-underground.jpg"
        backgroundAlt="Stockholm metro station escalators"
        heading="It's time to get grounded"
        primaryLabel="Contact Us"
        primaryHref="/contact-us"
        className="px-4 md:px-6 lg:px-8 pb-16 md:pb-24"
      />
    </div>
  );
}
