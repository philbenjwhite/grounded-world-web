import Link from "next/link";
import NextImage from "next/image";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import cn from "classnames";
import type {
  PageSections,
  PageSectionsSplitLayoutLeft,
  PageSectionsSplitLayoutRight,
} from "../../tina/__generated__/types";
import HeroBanner from "@/components/components/HeroBanner";
import ShowcaseGrid from "@/components/components/ShowcaseGrid";
import ExpandingCardPanel from "@/components/components/ExpandingCardPanel";
import LogoCarousel from "@/components/components/LogoCarousel";
import LogoGrid from "@/components/components/LogoGrid";
import IntroSection from "@/components/components/IntroSection";
import AccordionFAQ from "@/components/components/AccordionFAQ";
import VideoHero from "@/components/components/VideoHero";
import FeatureCards from "@/components/components/FeatureCards";
import ContactSection from "@/components/components/ContactSection";
import CTABanner from "@/components/components/CTABanner";
import TestimonialSection from "@/components/components/TestimonialSection";
import ContentTabs from "@/components/components/ContentTabs";
import SlideCarousel from "@/components/components/SlideCarousel";
import NewsletterCTA from "@/components/components/NewsletterCTA";
import PodcastWaveBackground from "@/components/components/PodcastWaveBackground";
import PodcastApplySection from "@/components/components/PodcastApplySection/PodcastApplySection";
import PodcastHero from "@/components/components/PodcastHero/PodcastHero";
import { GaiaVideoIntro } from "@/components/components/GaiaVideoIntro";
import { GaiaChat } from "@/components/components/GaiaChat";
import Split from "@/components/layout/Split";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Grid from "@/components/layout/Grid";
import ImageBlock from "@/components/atoms/Image";
import Button from "@/components/atoms/Button";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import SectionLabel from "@/components/atoms/SectionLabel";
import type { HeadingLevel } from "@/components/atoms/Heading/Heading";
import { CollapsibleText } from "@/components/atoms/CollapsibleText";
import { iconMap } from "@/lib/iconMap";
import IntentionActionStats from "@/components/components/IntentionActionStats/IntentionActionStats";

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
  blockquote: (props: { children?: React.ReactNode }) => (
    <blockquote className="rounded-2xl bg-[var(--color-magenta)] px-7 py-6 md:px-9 md:py-8 my-4">
      <div className="text-white text-[length:var(--font-size-body-lg)] md:text-[length:var(--font-size-h4)] font-bold leading-[1.35]">
        {props.children}
      </div>
    </blockquote>
  ),
  ul: (props: { children?: React.ReactNode }) => (
    <ul className="mb-4 space-y-3 list-none pl-0">{props.children}</ul>
  ),
  li: (props: { children?: React.ReactNode }) => {
    const CheckIcon = iconMap.CheckCircle;
    return (
      <li className="flex items-start gap-3">
        <CheckIcon size={22} weight="fill" className="shrink-0 mt-0.5 text-emerald-400" />
        <Text size="body-lg" color="secondary" as="span">{props.children}</Text>
      </li>
    );
  },
  a: (props: { url?: string; children?: React.ReactNode }) => (
    <a
      href={props.url}
      target={props.url?.startsWith("http") ? "_blank" : undefined}
      rel={props.url?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-[color:var(--color-cyan)] hover:underline"
    >
      {props.children}
    </a>
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
          <CollapsibleText>
            <TinaMarkdown content={block.body} components={richTextComponents} />
          </CollapsibleText>
        </div>
      ) : null;

    case "PageSectionsSplitLayoutLeftImage":
    case "PageSectionsSplitLayoutRightImage": {
      const imgBlock = block as unknown as {
        src?: string; alt?: string; caption?: string; rounded?: boolean;
        maxWidth?: string; maxHeight?: string; contain?: boolean; layout?: string;
        animate?: string;
      };
      return imgBlock.src ? (
        <ImageBlock
          key={index}
          src={imgBlock.src}
          alt={imgBlock.alt ?? ""}
          caption={imgBlock.caption ?? undefined}
          rounded={imgBlock.rounded ?? false}
          maxWidth={imgBlock.maxWidth ?? undefined}
          maxHeight={imgBlock.maxHeight ?? undefined}
          contain={imgBlock.contain ?? false}
          layout={(imgBlock.layout as "fill" | "centered") ?? "fill"}
          animate={(imgBlock.animate as "float") ?? undefined}
        />
      ) : null;
    }

    case "PageSectionsSplitLayoutLeftIntentionStats":
    case "PageSectionsSplitLayoutRightIntentionStats":
      return <IntentionActionStats key={index} />;

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

    case "PageSectionsSplitLayoutLeftExpandingCards":
    case "PageSectionsSplitLayoutRightExpandingCards": {
      const ec = block as unknown as {
        defaultActiveIndex?: number;
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
      };
      const cardItems =
        ec.items
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
          })) ?? [];
      if (cardItems.length === 0) return null;
      return (
        <ExpandingCardPanel
          key={index}
          items={cardItems}
          defaultActiveIndex={ec.defaultActiveIndex ?? undefined}
          renderMode="accordion-only"
        />
      );
    }

    case "PageSectionsSplitLayoutLeftEmbed":
    case "PageSectionsSplitLayoutRightEmbed": {
      const embed = block as unknown as { code?: string };
      if (!embed.code) return null;
      return (
        <div
          key={index}
          className="w-full [&>iframe]:w-full [&>iframe]:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: embed.code }}
        />
      );
    }

    default:
      return null;
  }
}

/* ─── Section renderer ────────────────────────────────── */

export function renderSection(section: PageSections, index: number): React.ReactNode {
  // PodcastHero — handled before switch until TinaCMS types are regenerated
  if ((section as unknown as { _template?: string })._template === "podcastHero" ||
      (section as unknown as { __typename?: string }).__typename === "PageSectionsPodcastHero") {
    const ph = section as unknown as {
      podcastLabel?: string;
      podcastTitle?: string;
      podcastSubtitle?: string;
      podcastThumbnail?: string;
      podcastThumbnailAlt?: string;
      podcastYoutubeId?: string;
    };
    return (
      <PodcastHero
        key={index}
        label={ph.podcastLabel ?? "Podcast"}
        title={ph.podcastTitle ?? ""}
        subtitle={ph.podcastSubtitle ?? undefined}
        thumbnailSrc={ph.podcastThumbnail ?? ""}
        thumbnailAlt={ph.podcastThumbnailAlt ?? undefined}
        youtubeId={ph.podcastYoutubeId ?? "tPaXVOrq_YY"}
      />
    );
  }

  // PodcastApply — handled before switch until TinaCMS types are regenerated
  if ((section as unknown as { _template?: string })._template === "podcastApply" ||
      (section as unknown as { __typename?: string }).__typename === "PageSectionsPodcastApply") {
    const pa = section as unknown as { applyHeading?: string; applyDescription?: string };
    return (
      <PodcastApplySection
        key={index}
        heading={pa.applyHeading ?? undefined}
        description={pa.applyDescription ?? undefined}
      />
    );
  }

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
    case "PageSectionsHeroBanner": {
      const canvasVariantMap: Record<string, React.ComponentType> = {
        podcastWaves: PodcastWaveBackground,
      };
      const variantKey = (section as unknown as { canvasVariant?: string }).canvasVariant;
      const customCanvas = variantKey ? canvasVariantMap[variantKey] : undefined;
      return (
        <HeroBanner
          key={index}
          backgroundType={
            (section.backgroundType as "vimeo" | "image" | "canvas") ?? "image"
          }
          canvasComponent={customCanvas}
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
    }

    case "PageSectionsShowcaseGrid": {
      const sgColumns = (section as unknown as { columns?: number }).columns;
      const sgVariant = (section as unknown as { variant?: string }).variant;
      const sgSectionVariant = (section as unknown as { sectionVariant?: string }).sectionVariant;
      return (
        <ShowcaseGrid
          key={index}
          sectionTitle={section.sectionTitle ?? undefined}
          sectionSubtitle={section.sectionSubtitle ?? undefined}
          columns={(sgColumns as 2 | 3 | 4) ?? 3}
          variant={(sgVariant as "overlay" | "stacked") ?? "overlay"}
          sectionVariant={(sgSectionVariant as "default" | "alt" | "dark") ?? "default"}
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
                imageContain: !!(item as unknown as { imageContain?: boolean }).imageContain,
                imageBg: (item as unknown as { imageBg?: string }).imageBg ?? undefined,
                typingDelay: (item as unknown as { typingDelay?: number }).typingDelay ?? undefined,
              })) ?? []
          }
        />
      );
    }

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
      const stickyLeft = (section as unknown as { stickyLeft?: boolean }).stickyLeft;
      const fullBleedImage = (section as unknown as { fullBleedImage?: boolean }).fullBleedImage;
      const sectionVariant = (section as unknown as { sectionVariant?: string }).sectionVariant as "default" | "alt" | undefined;
      const leftHasText = section.left?.some(
        (b) =>
          b?.__typename === "PageSectionsSplitLayoutLeftRichText" ||
          b?.__typename === "PageSectionsSplitLayoutLeftExpandingCards",
      );
      const leftHasImage = section.left?.some(
        (b) => b?.__typename === "PageSectionsSplitLayoutLeftImage",
      );
      const rightHasImage = section.right?.some(
        (b) => b?.__typename === "PageSectionsSplitLayoutRightImage",
      );
      const rightHasText = section.right?.some(
        (b) =>
          b?.__typename === "PageSectionsSplitLayoutRightRichText" ||
          b?.__typename === "PageSectionsSplitLayoutRightExpandingCards",
      );
      // Auto-sticky: whichever column has images but no text gets sticky behaviour
      const stickyImageLeft = !stickyLeft && leftHasImage && !leftHasText;
      const stickyImageRight = rightHasImage && !rightHasText;

      const labelElement = sectionLabel ? (
        <div data-tina-field={tinaField(section as Record<string, unknown>, "sectionLabel")}>
          <SectionLabel className="mb-4">{sectionLabel}</SectionLabel>
        </div>
      ) : null;

      const leftContent = (
        <div className="flex flex-col gap-6">
          {leftHasText && labelElement}
          {section.left
            ?.filter(Boolean)
            .map((block, blockIndex) =>
              renderSlotBlock(block!, blockIndex),
            )}
        </div>
      );

      /* ── Full-bleed image variant ── */
      if (fullBleedImage) {
        // Find the image block in right slot
        const rightBlocks = section.right?.filter(Boolean) ?? [];
        const imageBlock = rightBlocks.find(
          (b) =>
            b?.__typename === "PageSectionsSplitLayoutRightImage",
        ) as unknown as { src?: string; alt?: string } | undefined;

        const ratioMap: Record<string, string> = {
          "50/50": "lg:grid-cols-[1fr_1fr]",
          "40/60": "lg:grid-cols-[2fr_3fr]",
          "60/40": "lg:grid-cols-[3fr_2fr]",
          "30/70": "lg:grid-cols-[3fr_7fr]",
          "70/30": "lg:grid-cols-[7fr_3fr]",
        };
        const ratio = (section.ratio as string) ?? "60/40";

        return (
          <section key={index} className="relative overflow-hidden bg-(--background)">
            <div className={cn("grid grid-cols-1 items-center", ratioMap[ratio])}>
              {/* Text side with padding */}
              <div className="py-[var(--layout-section-padding-y)] px-[var(--layout-section-padding-x)]">
                {stickyLeft ? (
                  <div className="lg:sticky lg:top-24 max-w-[700px] ml-auto">{leftContent}</div>
                ) : (
                  <div className="max-w-[700px] ml-auto">{leftContent}</div>
                )}
              </div>
              {/* Full-bleed image side */}
              <div className="relative min-h-[400px] lg:min-h-[500px] h-full">
                {imageBlock?.src && (
                  <NextImage
                    src={imageBlock.src}
                    alt={imageBlock.alt ?? ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                )}
              </div>
            </div>
          </section>
        );
      }

      return (
        <Section key={index} variant={sectionVariant ?? "default"}>
          <Container className="px-(--layout-section-padding-x)">
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
              leftClassName={stickyImageLeft ? "lg:self-stretch" : undefined}
              rightClassName={stickyImageRight ? "lg:self-stretch" : undefined}
              left={
                stickyLeft ? (
                  <div className="lg:sticky lg:top-24">{leftContent}</div>
                ) : stickyImageLeft ? (
                  <div className="lg:sticky lg:top-24">{leftContent}</div>
                ) : (
                  leftContent
                )
              }
              right={
                <div className={cn("flex flex-col gap-6", stickyImageRight && "lg:sticky lg:top-24")}>
                  {!leftHasText && labelElement}
                  {section.right
                    ?.filter(Boolean)
                    .map((block, blockIndex) =>
                      renderSlotBlock(block!, blockIndex),
                    )}
                </div>
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

    case "PageSectionsIntroSection": {
      const intro = section as unknown as {
        heading?: string;
        paragraphs?: string[];
        imageSrc?: string;
        imageAlt?: string;
      };
      return (
        <IntroSection
          key={index}
          heading={intro.heading ?? ""}
          paragraphs={(intro.paragraphs?.filter(Boolean) as string[]) ?? []}
          imageSrc={intro.imageSrc ?? undefined}
          imageAlt={intro.imageAlt ?? undefined}
        />
      );
    }

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
        subtext?: string;
        primaryLabel?: string;
        primaryHref?: string;
        primaryExternal?: boolean;
        secondaryLabel?: string;
        secondaryHref?: string;
        secondaryExternal?: boolean;
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
          subtext={s.subtext ?? undefined}
          primaryLabel={s.primaryLabel}
          primaryHref={s.primaryHref}
          primaryExternal={s.primaryExternal ?? false}
          secondaryLabel={s.secondaryLabel ?? undefined}
          secondaryHref={s.secondaryHref ?? undefined}
          secondaryExternal={s.secondaryExternal ?? false}
          overlayOpacity={
            (s.overlayOpacity as "light" | "medium" | "heavy") ?? undefined
          }
          className={s.className ?? undefined}
        />
      );
    }

    case "PageSectionsNewsletterCta": {
      const n = section as unknown as {
        backgroundSrc?: string;
        backgroundAlt?: string;
        newsletterHeading?: string;
        newsletterSubtext?: string;
        overlayOpacity?: string;
        bookingEyebrow?: string;
        bookingHeading?: string;
        bookingSubtext?: string;
        bookingLabel?: string;
        bookingHref?: string;
      };
      return (
        <NewsletterCTA
          key={index}
          backgroundSrc={n.backgroundSrc ?? "/images/stockholm-metro-station-escalators-dark-underground.jpg"}
          backgroundAlt={n.backgroundAlt ?? undefined}
          heading={n.newsletterHeading ?? undefined}
          subtext={n.newsletterSubtext ?? undefined}
          overlayOpacity={
            (n.overlayOpacity as "light" | "medium" | "heavy") ?? undefined
          }
          bookingEyebrow={n.bookingEyebrow ?? undefined}
          bookingHeading={n.bookingHeading ?? undefined}
          bookingSubtext={n.bookingSubtext ?? undefined}
          bookingLabel={n.bookingLabel ?? undefined}
          bookingHref={n.bookingHref ?? undefined}
        />
      );
    }

    case "PageSectionsEmbedSection": {
      const e = section as unknown as {
        embedHeading?: string;
        embedDescription?: string;
        embedMode?: string;
        embedCode?: string;
        embedMinHeight?: number;
      };
      const height = e.embedMinHeight ?? 600;

      /* Gaia Chat — wrapped with video intro */
      if (e.embedMode === "gaiaChat") {
        return (
          <GaiaVideoIntro
            key={index}
            videoSrc="https://player.vimeo.com/progressive_redirect/playback/1170838207/rendition/2160p/file.mp4%20%282160p%29.mp4?loc=external&log_user=0&signature=dababe1b7a5c81dbc97d2df303830f9ed07c21f518cd4bf732c6798f6da32403"
          >
            <div className="h-full md:h-auto md:py-[var(--layout-section-padding-y)]">
              <Container className="h-full md:h-auto md:px-[var(--layout-section-padding-x)]">
                <div className="h-full md:h-auto max-w-4xl mx-auto">
                  <GaiaChat />
                </div>
              </Container>
            </div>
          </GaiaVideoIntro>
        );
      }

      return (
        <Section key={index}>
          <Container className="px-[var(--layout-section-padding-x)]">
            {e.embedHeading && (
              <div className="max-w-3xl mx-auto text-center mb-12">
                <Heading level={2} size="h3" color="primary">
                  {e.embedHeading}
                </Heading>
                {e.embedDescription && (
                  <Text size="body-lg" color="secondary" className="mt-4">
                    {e.embedDescription}
                  </Text>
                )}
              </div>
            )}
            <div className="max-w-4xl mx-auto">
              {e.embedMode === "embed" && e.embedCode ? (
                <div
                  style={{ minHeight: `${height}px` }}
                  dangerouslySetInnerHTML={{ __html: e.embedCode }}
                />
              ) : (
                <div
                  className="rounded-3xl border border-white/[0.08] bg-white/[0.025] flex items-center justify-center"
                  style={{ minHeight: `${height}px` }}
                >
                  <div className="text-center px-6 py-12">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-cyan)]/20 flex items-center justify-center mx-auto mb-6">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--color-cyan)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <Heading level={3} size="h4" color="primary">
                      {e.embedHeading ?? "Coming Soon"}
                    </Heading>
                    <Text size="body-sm" color="tertiary" className="mt-2 max-w-md mx-auto">
                      {e.embedDescription ?? "This section will be available soon."}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </Section>
      );
    }

    case "PageSectionsLogoGrid": {
      const lg = section as unknown as {
        logos?: Array<{ src?: string; alt?: string; href?: string }>;
      };
      const logos = lg.logos
        ?.filter((l): l is { src: string; alt: string; href?: string } =>
          Boolean(l?.src && l?.alt),
        );
      return <LogoGrid key={index} logos={logos} />;
    }

    case "PageSectionsCardGrid": {
      const cg = section as unknown as {
        sectionTitle?: string;
        sectionSubtitle?: string;
        columns?: number;
        items?: Array<{
          icon?: string;
          iconColor?: string;
          title: string;
          subtitle?: string;
          body?: string;
          href?: string;
        }>;
      };
      const cols = (cg.columns ?? 2) as 2 | 3 | 4;
      const items = (cg.items ?? []).filter(Boolean);
      if (items.length === 0) return null;
      return (
        <Section key={index}>
          <Container className="px-[var(--layout-section-padding-x)]">
            {(cg.sectionTitle || cg.sectionSubtitle) && (
              <div className="text-center mb-12 md:mb-16">
                {cg.sectionTitle && (
                  <Heading level={2} size="h2" color="primary" className="mb-4">
                    {cg.sectionTitle}
                  </Heading>
                )}
                {cg.sectionSubtitle && (
                  <Text size="body-lg" color="secondary" className="max-w-2xl mx-auto leading-relaxed">
                    {cg.sectionSubtitle}
                  </Text>
                )}
              </div>
            )}
            <Grid
              cols={cols}
              colsTablet={cols > 2 ? 2 : cols}
              colsMobile={1}
              gap="lg"
            >
              {items.map((item, itemIndex) => {
                const IconComponent = item.icon ? iconMap[item.icon] : null;
                const card = (
                  <div
                    key={itemIndex}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8 h-full"
                  >
                    {IconComponent && (
                      <div className="mb-6">
                        <IconComponent
                          size={24}
                          weight="duotone"
                          style={item.iconColor ? { color: item.iconColor } : undefined}
                        />
                      </div>
                    )}
                    <Heading level={3} size="h4" color="primary" className="mb-3">
                      {item.title}
                    </Heading>
                    {item.subtitle && (
                      <Text size="body-sm" color="tertiary" className="mb-4 font-medium">
                        {item.subtitle}
                      </Text>
                    )}
                    {item.body && (
                      <Text size="body-sm" color="secondary" className="leading-relaxed">
                        {item.body}
                      </Text>
                    )}
                  </div>
                );
                if (item.href) {
                  return (
                    <Link key={itemIndex} href={item.href} className="block h-full no-underline group">
                      {card}
                    </Link>
                  );
                }
                return card;
              })}
            </Grid>
          </Container>
        </Section>
      );
    }

    default:
      return null;
  }
}
