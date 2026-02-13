import { notFound } from "next/navigation";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import serverClient from "../../../tina/server-client";
import type {
  PageSections,
  PageSectionsSplitLayoutLeft,
  PageSectionsSplitLayoutRight,
} from "../../../tina/__generated__/types";
import HeroBanner from "@/components/components/HeroBanner";
import ShowcaseGrid from "@/components/components/ShowcaseGrid";
import ExpandingCardPanel from "@/components/components/ExpandingCardPanel";
import Split from "@/components/layout/Split";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import ImageBlock from "@/components/atoms/Image";
import Heading from "@/components/atoms/Heading";
import type { HeadingLevel } from "@/components/atoms/Heading/Heading";

/**
 * Custom TinaMarkdown components — routes headings through the Heading atom.
 */
const richTextComponents = Object.fromEntries(
  ([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map((level) => [
    `h${level}`,
    (props: { children: React.ReactNode }) => (
      <Heading level={level}>{props.children}</Heading>
    ),
  ]),
);

interface PageParams {
  slug: string;
}

/**
 * Render a single page section based on its TinaCMS template type.
 */
function renderSection(section: PageSections, index: number) {
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
            (section.minHeight as "full" | "large" | "medium") ?? undefined
          }
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

    case "PageSectionsSplitLayout":
      return (
        <Section key={index}>
          <Container>
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

    // MediaSection, Carousel, and RichText can be added here as components are built

    default:
      return null;
  }
}

/**
 * Render a single block inside a Split layout slot.
 */
function renderSlotBlock(
  block: PageSectionsSplitLayoutLeft | PageSectionsSplitLayoutRight,
  index: number,
) {
  switch (block.__typename) {
    case "PageSectionsSplitLayoutLeftRichText":
    case "PageSectionsSplitLayoutRightRichText":
      return block.body ? (
        <div key={index} className="prose prose-invert max-w-none">
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

    default:
      return null;
  }
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;

  try {
    const result = await serverClient.queries.page({
      relativePath: `${slug}.json`,
    });

    const page = result.data.page;
    const sections = page.sections?.filter(Boolean) as PageSections[] | undefined;

    return (
      <main>
        {sections?.map((section, index) => renderSection(section, index))}
      </main>
    );
  } catch {
    notFound();
  }
}
