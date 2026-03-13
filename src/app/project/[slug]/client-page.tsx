"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type {
  ProjectQuery,
  ProjectSections,
  ProjectSectionsSplitLayoutLeft,
  ProjectSectionsSplitLayoutRight,
} from "../../../../tina/__generated__/types";
import { richTextComponents } from "@/lib/tina-renderers";
import Heading from "@/components/atoms/Heading";
import ImageBlock from "@/components/atoms/Image";
import Button from "@/components/atoms/Button";
import SectionLabel from "@/components/atoms/SectionLabel";
import {
  NotepadIcon,
  CameraIcon,
  ArrowsClockwiseIcon,
  TrophyIcon,
  MegaphoneIcon,
  ShareNetworkIcon,
  HandHeartIcon,
} from "@phosphor-icons/react";
import styles from "./project-page.module.css";

/* Extended rich-text renderers — adds list support + SectionLabel for h4 */
const projectRichTextComponents = {
  ...richTextComponents,
  h4: (props: { children: React.ReactNode }) => (
    <SectionLabel className="mb-4">{props.children}</SectionLabel>
  ),
  ul: (props: { children: React.ReactNode }) => (
    <ul className="space-y-3 my-6">{props.children}</ul>
  ),
  ol: (props: { children: React.ReactNode }) => (
    <ol className="space-y-3 my-6 list-decimal list-inside">{props.children}</ol>
  ),
  li: (props: { children: React.ReactNode }) => (
    <li className="flex gap-3 items-start text-[length:var(--font-size-body-lg)] leading-[1.6] text-[color:var(--font-color-secondary)]">
      <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[var(--color-cyan)] shrink-0" />
      <span>{props.children}</span>
    </li>
  ),
} as typeof richTextComponents;


interface ProjectClientPageProps {
  query: string;
  variables: { relativePath: string };
  data: { project: ProjectQuery["project"] };
}

/* ── Scroll reveal observer ── */
function useRevealObserver(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add(styles.revealVisible);
              observerRef.current?.unobserve(e.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
      );
    }

    const observer = observerRef.current;
    el.querySelectorAll("[data-reveal]").forEach((t) => {
      if (!t.classList.contains(styles.revealVisible)) observer.observe(t);
    });

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [dep]);

  return ref;
}


export default function ProjectClientPage(props: ProjectClientPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const project = data.project;
  const containerRef = useRevealObserver(project.sections);

  /* Find the title section (index 1) to render inside the hero */
  const titleSection = (project.sections ?? [])[1];

  /* Group sections into "zones" for background treatment */
  const sections = project.sections ?? [];

  return (
    <div ref={containerRef} className="min-h-screen bg-(--background) text-white overflow-x-hidden">
      {sections.map((section, index) => {
        if (!section) return null;
        return renderProjectSection(section, index, titleSection);
      })}

      {/* Mosaic gallery — full-bleed edge-to-edge */}
      {project.client === "Plan International" && (
        <div className="relative w-full overflow-hidden px-4 md:px-6 xl:px-8">
          {/* 6-col mosaic with explicit placement — no gaps, fills every cell */}
          <div className={styles.mosaicGrid}>
            {[
              { file: "projects/plan-international/mi-pham-bottom.jpg", area: "a" },
              { file: "annie-spratt-blXnsgfPw94-unsplash.jpg", area: "b" },
              { file: "artur-rekstad-18NWHwnbdFc-unsplash.jpg", area: "c" },
              { file: "billetto-editorial-YvLd3xbo0ac-unsplash.jpg", area: "d" },
              { file: "hannah-busing-wzN8i-7R99M-unsplash.jpg", area: "e" },
              { file: "jess-hendon-PTwGribxAko-unsplash.jpg", area: "f" },
              { file: "jess-hendon-Zt7-t4RgUn8-unsplash.jpg", area: "g" },
              { file: "jess-hendon-xr2dLQfiook-unsplash.jpg", area: "h" },
              { file: "lisboa-ind-VnqagyZWhtk-unsplash.jpg", area: "i" },
              { file: "nathanael-desmeules-Yv5bfNa0ugI-unsplash.jpg", area: "j" },
              { file: "oliver-sjostrom-m-qps7eYZl4-unsplash.jpg", area: "k" },
              { file: "sophia-richards-ZT9wPLFR4VM-unsplash.jpg", area: "l" },
              { file: "tim-mossholder-cCFOo3Qko3Q-unsplash.jpg", area: "m" },
              { file: "yannis-h-ojVyYmUoMd4-unsplash.jpg", area: "n" },
              { file: "ashima-pargal-o3KQX_VLhVY-unsplash.jpg", area: "o" },
              { file: "jess-zoerb-9eaWJcY_SoE-unsplash.jpg", area: "p" },
              { file: "qu-nh-le-m-nh-Y9h6P4uaDzo-unsplash.jpg", area: "q" },
              { file: "stephen-audu-X5xH3Bvi0c8-unsplash.jpg", area: "r" },
            ].map(({ file, area }) => (
              <div
                key={file}
                data-reveal
                style={{ gridArea: area }}
                className={`${styles.mosaicItem} relative overflow-hidden rounded-lg`}
              >
                <Image
                  src={`/images/${file}`}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 33vw, 20vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Heavy vignette overlay for text legibility */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.35)_55%,transparent_100%)]" />
          {/* Top/bottom fade to page bg */}
          <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[var(--background)] to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />

          {/* Centered overlay content */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white text-center tracking-tight leading-[1.1] mb-8 drop-shadow-[0_4px_32px_rgba(0,0,0,0.7)]">
              Girls vs.<br />Stereotypes
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                href="https://unsplash.com/blog/girls-vs-stereotypes/"
                variant="secondary"
                target="_blank"
              >
                Read the story
              </Button>
              <Button
                href="https://unsplash.com/t/girls-vs-stereotypes"
                variant="secondary"
                target="_blank"
              >
                View on Unsplash
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer at bottom */}
      <div className="h-16 md:h-24" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Section renderer
   ═══════════════════════════════════════════ */
function renderProjectSection(
  section: ProjectSections,
  index: number,
  titleSection: ProjectSections | null | undefined,
) {
  switch (section.__typename) {
    /* ─── HERO ─── */
    case "ProjectSectionsHeroImage": {
      const titleBody = titleSection && "body" in titleSection ? titleSection.body : null;
      return (
        <div key={index} className="relative w-full p-4 md:p-6 xl:p-8 bg-(--background)">
          <div className="relative w-full h-[60dvh] md:h-[75dvh] overflow-hidden rounded-3xl">
            {section.src && (
              <div className="absolute inset-0">
                <Image
                  src={section.src}
                  alt={section.alt ?? ""}
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
            )}
            {/* Medium overlay matching HeroBanner */}
            <div className="absolute inset-0 z-10 bg-black/50" />
            {/* Title content inside hero — bottom-aligned */}
            {titleBody && (
              <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 md:px-12 lg:px-24 xl:px-32 pb-10 md:pb-14">
                <div className="max-w-4xl">
                  <TinaMarkdown content={titleBody} components={projectRichTextComponents} />
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    /* ─── RICH TEXT ─── */
    case "ProjectSectionsRichText": {
      /* Title block — already rendered inside hero, skip */
      if (index === 1) {
        return null;
      }

      /* Intro text */
      if (index === 2) {
        return (
          <div key={index} className="py-16 md:py-24 px-[var(--layout-section-padding-x)]">
            <div className="max-w-3xl mx-auto" data-reveal>
              {section.body && (
                <TinaMarkdown content={section.body} components={projectRichTextComponents} />
              )}
            </div>
          </div>
        );
      }

      /* "What We Did" — detect and render as bento cards */
      if (JSON.stringify(section.body ?? "").includes("What We Did")) {
        const steps = [
          { icon: NotepadIcon,         label: "Created the brief",      text: "Assembled a group of adolescent girls to create a brief for Unsplash on the types of images and key words they found more representative." },
          { icon: CameraIcon,          label: "Photographer challenge", text: "Unsplash challenged their global community of photographers to flood their image bank with new photos aligned with the girls' brief." },
          { icon: ArrowsClockwiseIcon, label: "Reset the algorithm",    text: "Unsplash reset their algorithm to associate search terms that are more accurate depictions of how girls want to be perceived." },
          { icon: TrophyIcon,          label: "Selected the winners",   text: "The panel of girls voted and selected the winning top 10 photos from the photographer submissions." },
          { icon: MegaphoneIcon,       label: "Announced the results",  text: "The winning photographs were announced online through Unsplash and Plan PR efforts." },
          { icon: ShareNetworkIcon,    label: "Sparked the movement",   text: "Girls, parents & supporters were invited to share the winning images and utilize the full bank to help perpetuate the evolution." },
          { icon: HandHeartIcon,       label: "Built the community",    text: "Supporters and girls joined #WeAreTheGirls by taking the Pledge at WeAreTheGirls.org and signing up for community activations." },
        ];

        // 4-col grid, explicit row placement so there are zero gaps
        // Row 1: card 0 spans 3 cols, card 1 spans 1 col
        // Row 2: card 2 spans 1 col, card 3 spans 2 cols, card 1 continues (row-span-2)
        // Row 3: card 4 spans 2 cols, card 5 spans 2 cols
        // Row 4: card 6 spans full width
        const gridClasses = [
          "col-span-2 sm:col-span-3",                                    // 0: wide
          "col-span-2 sm:col-span-1 sm:row-span-2",                     // 1: tall
          "col-span-2 sm:col-span-1",                                    // 2: small
          "col-span-2 sm:col-span-2",                                    // 3: medium
          "col-span-2 sm:col-span-2",                                    // 4: medium
          "col-span-2 sm:col-span-2",                                    // 5: medium
          "col-span-2 sm:col-span-4",                                    // 6: full
        ];

        return (
          <div key={index} className="py-12 md:py-20 px-[var(--layout-section-padding-x)]">
            <div className="max-w-4xl mx-auto">
              <div data-reveal className={styles.reveal}>
                <SectionLabel className="mb-3">Process</SectionLabel>
                <Heading level={3} size="h3" color="primary" className="mb-10">
                  What We Did
                </Heading>
              </div>
              <div
                data-reveal
                className={`${styles.stagger} grid grid-cols-2 sm:grid-cols-4 gap-4`}
              >
                {steps.map((card, ci) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={ci}
                      className={`${gridClasses[ci]} work-card-hover relative rounded-[var(--comp-work-card-radius)] bg-[var(--comp-work-card-surface)] p-6 flex flex-col justify-between gap-5 min-h-[180px]`}
                    >
                      <div className="work-card-glow" />
                      <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--color-cyan)]/10 text-[var(--color-cyan)]">
                        <Icon size={22} weight="duotone" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-base font-semibold text-white tracking-tight mb-2">
                          {card.label}
                        </p>
                        <p className="text-sm leading-relaxed text-[color:var(--font-color-secondary)]">
                          {card.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      /* Generic rich text fallback */
      return (
        <div key={index} className="py-12 md:py-20 px-[var(--layout-section-padding-x)]">
          <div
            data-reveal
            className={`max-w-4xl mx-auto ${styles.reveal}`}
          >
            {section.body && (
              <TinaMarkdown content={section.body} components={projectRichTextComponents} />
            )}
          </div>
        </div>
      );
    }

    /* ─── IMAGE ─── */
    case "ProjectSectionsImage": {
      return (
        <div key={index} className="py-6 md:py-10 px-[var(--layout-section-padding-x)] -mb-px">
          <div data-reveal className={styles.revealScale}>
            <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden">
              {section.src && (
                <ImageBlock
                  src={section.src}
                  alt={section.alt ?? ""}
                  caption={section.caption ?? undefined}
                  rounded
                />
              )}
            </div>
          </div>
        </div>
      );
    }

    /* ─── VIDEO ─── */
    case "ProjectSectionsVideo": {
      const vimeoMatch = section.videoUrl?.match(/vimeo\.com\/(\d+)/);
      const isLocalVideo = section.videoUrl?.match(/\.(mp4|webm|ogg)$/i);
      return (
        <div key={index}>
          <div data-reveal>
            <div className="aspect-video overflow-hidden">
              {vimeoMatch ? (
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
                  className="h-full w-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : isLocalVideo ? (
                <video
                  src={`${section.videoUrl}#t=1`}
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  preload="auto"
                />
              ) : (
                <a
                  href={section.videoUrl ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full items-center justify-center bg-white/[0.02] text-[color:var(--font-color-tertiary)] hover:text-white transition-colors"
                >
                  Watch Video &rarr;
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }

    /* ─── SPLIT LAYOUT ─── */
    case "ProjectSectionsSplitLayout": {
      /* Parse ratio for grid columns */
      const ratioMap: Record<string, string> = {
        "50/50": "md:grid-cols-2",
        "60/40": "md:grid-cols-[3fr_2fr]",
        "40/60": "md:grid-cols-[2fr_3fr]",
      };
      const gridCols = ratioMap[section.ratio ?? "50/50"] ?? "md:grid-cols-2";
      const reversed = section.reverseOnMobile;

      return (
        <div key={index} className="py-12 md:py-20 px-[var(--layout-section-padding-x)] bg-[#131313]">
          <div className="max-w-5xl mx-auto">
            <div className={`grid grid-cols-1 ${gridCols} gap-8 md:gap-12 items-center`}>
              {/* Left column */}
              <div
                data-reveal
                className={`${styles.reveal} ${reversed ? "order-2 md:order-1" : ""} max-w-sm md:max-w-none mx-auto md:mx-0`}
              >
                <div className="flex flex-col gap-5">
                  {section.left?.filter(Boolean).map((block, i) =>
                    renderProjectBlock(block!, i)
                  )}
                </div>
              </div>

              {/* Right column */}
              <div
                data-reveal
                className={`${styles.revealScale} ${reversed ? "order-1 md:order-2" : ""} max-w-sm md:max-w-none mx-auto md:mx-0`}
              >
                <div className="flex flex-col gap-5">
                  {section.right?.filter(Boolean).map((block, i) =>
                    renderProjectBlock(block!, i)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    /* ─── LINK CARDS — hidden, merged into bottom mosaic section ─── */
    case "ProjectSectionsLinkCards": {
      return null;
    }

    /* ─── CTA BANNER ─── */
    case "ProjectSectionsCtaBanner": {
      return (
        <div key={index} className="px-4 md:px-6 lg:px-8 pt-16 md:pt-24 pb-16 md:pb-24">
          <div data-reveal className={`relative overflow-hidden rounded-3xl min-h-[40vh] md:min-h-[50vh] ${styles.revealScale}`}>
            {section.backgroundSrc && (
              <div className="absolute inset-0 z-0">
                <Image src={section.backgroundSrc} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 1280px" />
              </div>
            )}
            <div className="absolute inset-0 z-10 bg-black/55" />
            <div className="relative z-20 flex flex-col items-center justify-center text-center px-8 md:px-16 py-20 md:py-28 lg:py-32 min-h-[40vh] md:min-h-[50vh]">
              {section.heading && (
                <Heading level={2} size="h3" color="primary" className="max-w-2xl">
                  {section.heading}
                </Heading>
              )}
              {section.buttonUrl && (
                <div className="mt-8 md:mt-10">
                  <Button
                    href={section.buttonUrl}
                    variant="primary"
                    target="_blank"
                  >
                    {section.buttonText ?? "Learn More"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

/* ═══════════════════════════════════════════
   Inner block renderer for split columns
   ═══════════════════════════════════════════ */
function renderProjectBlock(
  block: ProjectSectionsSplitLayoutLeft | ProjectSectionsSplitLayoutRight,
  index: number,
) {
  if (block.__typename?.includes("RichText")) {
    const b = block as { body?: Parameters<typeof TinaMarkdown>[0]["content"] };
    if (!b.body) return null;
    return (
      <div key={index}>
        <TinaMarkdown content={b.body} components={projectRichTextComponents} />
      </div>
    );
  }

  if (block.__typename?.includes("Image")) {
    const b = block as { src?: string; alt?: string; caption?: string };
    if (!b.src) return null;
    return (
      <div key={index} className="rounded-2xl overflow-hidden">
        <ImageBlock src={b.src} alt={b.alt ?? ""} caption={b.caption ?? undefined} rounded />
      </div>
    );
  }

  if (block.__typename?.includes("ButtonGroup")) {
    const b = block as {
      buttons?: Array<{ label: string; href: string; variant?: string; external?: boolean }>;
    };
    if (!b.buttons?.length) return null;
    return (
      <div key={index} className="flex flex-wrap gap-4 pt-2">
        {b.buttons.map((btn) => (
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

  return null;
}
