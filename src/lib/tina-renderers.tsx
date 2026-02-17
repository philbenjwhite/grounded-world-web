import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import type {
  PageSections,
  PageSectionsSplitLayoutLeft,
  PageSectionsSplitLayoutRight,
} from "../../tina/__generated__/types";
import HeroBanner from "@/components/components/HeroBanner";
import ShowcaseGrid from "@/components/components/ShowcaseGrid";
import ExpandingCardPanel from "@/components/components/ExpandingCardPanel";
import LogoCarousel from "@/components/components/LogoCarousel";
import IntroSection from "@/components/components/IntroSection";
import AccordionFAQ from "@/components/components/AccordionFAQ";
import VideoHero from "@/components/components/VideoHero";
import FeatureCards from "@/components/components/FeatureCards";
import ContactSection from "@/components/components/ContactSection";
import CTABanner from "@/components/components/CTABanner";
import TestimonialSection from "@/components/components/TestimonialSection";
import ContentTabs from "@/components/components/ContentTabs";
import SlideCarousel from "@/components/components/SlideCarousel";
import Split from "@/components/layout/Split";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import ImageBlock from "@/components/atoms/Image";
import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import SectionLabel from "@/components/atoms/SectionLabel";
import type { HeadingLevel } from "@/components/atoms/Heading/Heading";

/* ─── Rich-text rendering components ─────────────────── */

export const richTextComponents = {
  ...Object.fromEntries(
    ([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map((level) => [
      `h${level}`,
      (props: { children: React.ReactNode }) => (
        <Heading level={level} className="mb-6">{props.children}</Heading>
      ),
    ]),
  ),
  p: (props: { children?: React.ReactNode }) => (
    <Text size="body-lg" color="secondary" className="mb-4">
      {props.children}
    </Text>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

/* ─── Slot block renderer (splitLayout inner blocks) ──── */

export function renderSlotBlock(
  block: PageSectionsSplitLayoutLeft | PageSectionsSplitLayoutRight,
  index: number,
) {
  switch (block.__typename) {
    case "PageSectionsSplitLayoutLeftRichText":
    case "PageSectionsSplitLayoutRightRichText":
      return block.body ? (
        <div key={index}>
          <TinaMarkdown content={block.body} components={richTextComponents} />
        </div>
      ) : null;

    case "PageSectionsSplitLayoutLeftImage":
    case "PageSectionsSplitLayoutRightImage":
      return block.src ? (
        <ImageBlock
          key={index}
          src={block.src}
          alt={block.alt ?? ""}
          caption={block.caption ?? undefined}
          rounded={block.rounded ?? false}
        />
      ) : null;

    case "PageSectionsSplitLayoutLeftButtonGroup":
    case "PageSectionsSplitLayoutRightButtonGroup": {
      const buttons = (
        block as unknown as {
          buttons?: Array<{
            label: string;
            href: string;
            variant?: string;
            external?: boolean;
          }>;
        }
      ).buttons;
      if (!buttons?.length) return null;
      return (
        <div key={index} className="flex flex-wrap gap-4">
          {buttons.filter(Boolean).map((btn) => (
            <Button
              key={btn.label}
              href={btn.href}
              variant={(btn.variant as "primary" | "secondary" | "outline") ?? "secondary"}
              target={btn.external ? "_blank" : undefined}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}

/* ─── Section renderer ────────────────────────────────── */

export function renderSection(section: PageSections, index: number): React.ReactNode {
  // ContentTabs — handled before switch until TinaCMS types are regenerated
  if ((section as unknown as { _template?: string })._template === "contentTabs" ||
      (section as unknown as { __typename?: string }).__typename === "PageSectionsContentTabs") {
    const ct = section as unknown as {
      sectionTitle?: string;
      sectionSubtitle?: string;
      defaultActiveIndex?: number;
      items?: Array<{
        title: string;
        icon?: string;
        color: string;
        subtitle: string;
        body: string;
        imageSrc?: string;
        imageAlt?: string;
        buttonLabel?: string;
        buttonHref?: string;
        buttonExternal?: boolean;
        subsections?: Array<{
          heading: string;
          body: string;
          imageSrc?: string;
          imageAlt?: string;
        }>;
      }>;
    };
    return (
      <ContentTabs
        key={index}
        sectionTitle={ct.sectionTitle ?? undefined}
        sectionSubtitle={ct.sectionSubtitle ?? undefined}
        defaultActiveIndex={ct.defaultActiveIndex ?? undefined}
        items={
          (ct.items ?? []).filter(Boolean).map((item) => ({
            title: item.title,
            icon: item.icon ?? undefined,
            color: item.color,
            subtitle: item.subtitle,
            body: item.body,
            imageSrc: item.imageSrc ?? undefined,
            imageAlt: item.imageAlt ?? undefined,
            buttonLabel: item.buttonLabel ?? undefined,
            buttonHref: item.buttonHref ?? undefined,
            buttonExternal: item.buttonExternal ?? undefined,
            subsections: item.subsections?.filter(Boolean).map((sub) => ({
              heading: sub.heading,
              body: sub.body,
              imageSrc: sub.imageSrc ?? undefined,
              imageAlt: sub.imageAlt ?? undefined,
            })),
          }))
        }
      />
    );
  }

  // ImageCarousel
  if ((section as unknown as { _template?: string })._template === "imageCarousel" ||
      (section as unknown as { __typename?: string }).__typename === "PageSectionsImageCarousel") {
    const ic = section as unknown as {
      sectionTitle?: string;
      sectionSubtitle?: string;
      items?: Array<{
        id: string;
        title?: string;
        description?: string;
        imageUrl?: string;
        imageAlt?: string;
      }>;
    };
    return (
      <Section key={index}>
        <Container className="px-[var(--layout-section-padding-x)]">
          {ic.sectionTitle && (
            <div data-tina-field={tinaField(section as Record<string, unknown>, "sectionTitle")}>
              <Heading level={2} size="h2" color="primary" className="text-center mb-4">
                {ic.sectionTitle}
              </Heading>
            </div>
          )}
          {ic.sectionSubtitle && (
            <div data-tina-field={tinaField(section as Record<string, unknown>, "sectionSubtitle")}>
              <Text size="body-lg" color="secondary" className="text-center mb-8 md:mb-12 max-w-2xl mx-auto">
                {ic.sectionSubtitle}
              </Text>
            </div>
          )}
          <SlideCarousel
            items={(ic.items ?? []).filter(Boolean).map((item) => ({
              id: item.id,
              title: item.title ?? undefined,
              description: item.description ?? undefined,
              imageUrl: item.imageUrl ?? undefined,
              imageAlt: item.imageAlt ?? undefined,
            }))}
          />
        </Container>
      </Section>
    );
  }

  switch (section.__typename) {
    case "PageSectionsHeroBanner":
      return (
        <HeroBanner
          key={index}
          backgroundType={
            (section.backgroundType as "vimeo" | "image" | "canvas") ?? "image"
          }
          vimeoUrl={section.vimeoUrl ?? undefined}
          posterSrc={section.posterSrc ?? undefined}
          imageSrc={section.imageSrc ?? undefined}
          imageAlt={section.imageAlt ?? undefined}
          title={section.title ?? ""}
          subtitle={section.subtitle ?? undefined}
          ctaLabel={section.ctaLabel ?? undefined}
          ctaHref={section.ctaHref ?? undefined}
          ctaVariant={
            (section.ctaVariant as "solid" | "outline") ?? undefined
          }
          secondaryCtaLabel={section.secondaryCtaLabel ?? undefined}
          secondaryCtaHref={section.secondaryCtaHref ?? undefined}
          overlayOpacity={
            (section.overlayOpacity as "light" | "medium" | "heavy") ??
            undefined
          }
          contentAlign={
            (section.contentAlign as "center" | "left") ?? undefined
          }
          minHeight={
            (section.minHeight as "full" | "large" | "medium" | "condensed" | "fit") ?? undefined
          }
          bottomFade={section.bottomFade ?? undefined}
          featureImageSrc={
            (section as unknown as { featureImageSrc?: string }).featureImageSrc ?? undefined
          }
          featureImageAlt={
            (section as unknown as { featureImageAlt?: string }).featureImageAlt ?? undefined
          }
          highlightsDescription={
            (section as unknown as { highlightsDescription?: string }).highlightsDescription ?? undefined
          }
          highlights={
            ((section as unknown as { highlights?: string[] }).highlights?.filter(Boolean) as string[]) ?? undefined
          }
          highlightColor={
            (section as unknown as { highlightColor?: string }).highlightColor ?? undefined
          }
          highlightsInRight={
            (section as unknown as { highlightsInRight?: boolean }).highlightsInRight ?? undefined
          }
          tinaFields={{
            title: tinaField(section as Record<string, unknown>, "title"),
            subtitle: tinaField(section as Record<string, unknown>, "subtitle"),
            highlights: tinaField(section as Record<string, unknown>, "highlights"),
            highlightsDescription: tinaField(section as Record<string, unknown>, "highlightsDescription"),
            ctaLabel: tinaField(section as Record<string, unknown>, "ctaLabel"),
          }}
        />
      );

    case "PageSectionsShowcaseGrid":
      return (
        <ShowcaseGrid
          key={index}
          sectionTitle={section.sectionTitle ?? undefined}
          sectionSubtitle={section.sectionSubtitle ?? undefined}
          items={
            section.items
              ?.filter(Boolean)
              .map((item) => ({
                title: item!.title ?? "",
                description: item!.description ?? "",
                imageSrc: item!.imageSrc ?? "",
                imageAlt: item!.imageAlt ?? "",
                glowColor: item!.glowColor ?? undefined,
                href: item!.href ?? undefined,
              })) ?? []
          }
        />
      );

    case "PageSectionsExpandingCardPanel":
      return (
        <ExpandingCardPanel
          key={index}
          sectionTitle={section.sectionTitle ?? undefined}
          sectionSubtitle={section.sectionSubtitle ?? undefined}
          defaultActiveIndex={section.defaultActiveIndex ?? undefined}
          items={
            section.items
              ?.filter(Boolean)
              .map((item) => ({
                name: item!.name,
                color: item!.color,
                icon: item!.icon ?? undefined,
                tagline: item!.tagline,
                bullets: (item!.bullets?.filter(Boolean) as string[]) ?? [],
                ctaHref: item!.ctaHref,
                ctaLabel: item!.ctaLabel ?? undefined,
                imageSrc: item!.imageSrc ?? undefined,
                imageAlt: item!.imageAlt ?? undefined,
              })) ?? []
          }
        />
      );

    case "PageSectionsSplitLayout": {
      const sectionLabel = (section as unknown as { sectionLabel?: string }).sectionLabel;
      return (
        <Section key={index}>
          <Container className="px-[var(--layout-section-padding-x)]">
            <Split
              ratio={
                (section.ratio as
                  | "50/50"
                  | "40/60"
                  | "60/40"
                  | "30/70"
                  | "70/30") ?? "50/50"
              }
              gap={(section.gap as "none" | "sm" | "md" | "lg" | "xl") ?? "md"}
              align={
                (section.verticalAlign as
                  | "start"
                  | "center"
                  | "end"
                  | "stretch") ?? "start"
              }
              reverseOnMobile={section.reverseOnMobile ?? false}
              left={
                <>
                  {sectionLabel && (
                    <div data-tina-field={tinaField(section as Record<string, unknown>, "sectionLabel")}>
                      <SectionLabel className="mb-4">{sectionLabel}</SectionLabel>
                    </div>
                  )}
                  {section.left
                    ?.filter(Boolean)
                    .map((block, blockIndex) =>
                      renderSlotBlock(block!, blockIndex),
                    )}
                </>
              }
              right={
                <>
                  {section.right
                    ?.filter(Boolean)
                    .map((block, blockIndex) =>
                      renderSlotBlock(block!, blockIndex),
                    )}
                </>
              }
            />
          </Container>
        </Section>
      );
    }

    case "PageSectionsLogoCarousel":
      return (
        <LogoCarousel
          key={index}
          speed={
            (section as Record<string, unknown>).speed as number | undefined
          }
          logos={
            (
              (section as Record<string, unknown>).logos as
                | Array<{ src?: string | null; alt?: string | null }>
                | undefined
            )?.filter(
              (l): l is { src: string; alt: string } =>
                Boolean(l?.src && l?.alt),
            )
          }
        />
      );

    case "PageSectionsIntroSection":
      return (
        <IntroSection
          key={index}
          heading={
            (section as unknown as { heading?: string }).heading ?? ""
          }
          paragraphs={
            (
              (
                section as unknown as { paragraphs?: string[] }
              ).paragraphs?.filter(Boolean) as string[]
            ) ?? []
          }
        />
      );

    case "PageSectionsAccordionFAQ":
      return (
        <AccordionFAQ
          key={index}
          sectionTitle={
            (section as unknown as { sectionTitle?: string }).sectionTitle ??
            undefined
          }
          sectionSubtitle={
            (section as unknown as { sectionSubtitle?: string })
              .sectionSubtitle ?? undefined
          }
          allowMultiple={
            (section as unknown as { allowMultiple?: boolean })
              .allowMultiple ?? undefined
          }
          items={
            (
              (
                section as unknown as {
                  items?: Array<{ question: string; answer: string }>;
                }
              ).items ?? []
            ).filter(Boolean)
          }
        />
      );

    case "PageSectionsVideoHero":
      return (
        <div key={index} className="h-[75dvh] md:h-[calc(100dvh-56px)]">
          <VideoHero
            backgroundVideoUrl={
              (section as unknown as { backgroundVideoUrl?: string })
                .backgroundVideoUrl
            }
            vimeoId={
              (section as unknown as { vimeoId?: string }).vimeoId
            }
            heading={
              (section as unknown as { heading?: string }).heading
            }
            subheading={
              (section as unknown as { subheading?: string }).subheading
            }
          />
        </div>
      );

    case "PageSectionsFeatureCards":
      return (
        <FeatureCards
          key={index}
          sectionLabel={
            (section as unknown as { sectionLabel?: string }).sectionLabel ??
            undefined
          }
          heading={
            (section as unknown as { heading?: string }).heading ?? undefined
          }
          columns={
            (section as unknown as { columns?: number }).columns ?? undefined
          }
          items={
            (
              (
                section as unknown as {
                  items?: Array<{
                    icon?: string;
                    color: string;
                    title: string;
                    body: string;
                  }>;
                }
              ).items ?? []
            )
              .filter(Boolean)
              .map((item) => ({
                icon: item.icon ?? undefined,
                color: item.color,
                title: item.title,
                body: item.body,
              }))
          }
        />
      );

    case "PageSectionsContactSection":
      return (
        <ContactSection
          key={index}
          heading={
            (section as unknown as { heading?: string }).heading ?? undefined
          }
          description={
            (section as unknown as { description?: string }).description ??
            undefined
          }
          bookingUrl={
            (section as unknown as { bookingUrl?: string }).bookingUrl ??
            undefined
          }
          bookingLabel={
            (section as unknown as { bookingLabel?: string }).bookingLabel ??
            undefined
          }
          email={
            (section as unknown as { email?: string }).email ?? undefined
          }
        />
      );

    case "PageSectionsTestimonialSection": {
      const t = section as unknown as {
        quote?: string;
        author?: string;
        role?: string;
        company?: string;
        rating?: number;
        imageSrc?: string;
        imageAlt?: string;
      };
      if (!t.quote) return null;
      return (
        <TestimonialSection
          key={index}
          quote={t.quote}
          author={t.author ?? undefined}
          role={t.role ?? undefined}
          company={t.company ?? undefined}
          rating={t.rating ?? undefined}
          imageSrc={t.imageSrc ?? undefined}
          imageAlt={t.imageAlt ?? undefined}
        />
      );
    }

    case "PageSectionsCtaBanner": {
      const s = section as unknown as {
        backgroundSrc?: string;
        backgroundAlt?: string;
        heading?: string;
        primaryLabel?: string;
        primaryHref?: string;
        secondaryLabel?: string;
        secondaryHref?: string;
        overlayOpacity?: string;
        className?: string;
      };
      if (!s.backgroundSrc || !s.heading || !s.primaryLabel || !s.primaryHref)
        return null;
      return (
        <CTABanner
          key={index}
          backgroundSrc={s.backgroundSrc}
          backgroundAlt={s.backgroundAlt ?? undefined}
          heading={s.heading}
          primaryLabel={s.primaryLabel}
          primaryHref={s.primaryHref}
          secondaryLabel={s.secondaryLabel ?? undefined}
          secondaryHref={s.secondaryHref ?? undefined}
          overlayOpacity={
            (s.overlayOpacity as "light" | "medium" | "heavy") ?? undefined
          }
          className={s.className ?? undefined}
        />
      );
    }

    default:
      return null;
  }
}
