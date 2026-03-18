"use client";

import { useTina } from "tinacms/dist/react";
import Image from "next/image";
import type { PageQuery, PageSections } from "../../../tina/__generated__/types";
import HeroBanner from "@/components/components/HeroBanner";
import { renderSection as renderSharedSection } from "@/lib/tina-renderers";

/* ─── About-page section renderer ─────────────────────── */

function renderSection(section: PageSections, index: number) {
  /* Override HeroBanner to add B Corp badge + rounded wrapper */
  if (section.__typename === "PageSectionsHeroBanner") {
    return (
      <div key={index} className="p-4 md:p-6">
        <div className="relative overflow-hidden rounded-3xl">
          <HeroBanner
            backgroundType={
              (section.backgroundType as "vimeo" | "image" | "canvas") ?? "image"
            }
            vimeoUrl={section.vimeoUrl ?? undefined}
            posterSrc={section.posterSrc ?? undefined}
            imageSrc={section.imageSrc ?? undefined}
            imageAlt={section.imageAlt ?? undefined}
            title={section.title ?? "Big Brand Muscle. Boutique Hustle."}
            subtitle={section.subtitle ?? undefined}
            ctaLabel={section.ctaLabel ?? undefined}
            ctaHref={section.ctaHref ?? undefined}
            ctaVariant={
              (section.ctaVariant as "solid" | "outline") ?? undefined
            }
            secondaryCtaLabel={section.secondaryCtaLabel ?? undefined}
            secondaryCtaHref={section.secondaryCtaHref ?? undefined}
            overlayOpacity={
              (section.overlayOpacity as "light" | "medium" | "heavy") ?? "medium"
            }
            contentAlign={
              (section.contentAlign as "center" | "left") ?? "center"
            }
            minHeight={
              (section.minHeight as "full" | "large" | "medium") ?? "large"
            }
            bottomFade={section.bottomFade ?? false}
          />

          {/* Badge overlay — bottom-left of hero (e.g. B Corp logo) */}
          {typeof (section as Record<string, unknown>).badgeSrc === "string" && (
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 lg:bottom-12 lg:left-12 z-30 flex items-center gap-3">
              <Image
                src={(section as Record<string, unknown>).badgeSrc as string}
                alt={((section as Record<string, unknown>).badgeAlt as string) || ""}
                width={120}
                height={120}
                className="h-16 md:h-20 lg:h-24 w-auto opacity-60 brightness-[10]"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* All other sections use the shared renderer */
  return renderSharedSection(section, index);
}

/* ─── Page Component ──────────────────────────────────── */

interface ClientPageProps {
  query: string;
  variables: { relativePath: string };
  data: { page: PageQuery["page"] };
}

export default function AboutClientPage(props: ClientPageProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const sections = data.page.sections?.filter(Boolean) as
    | PageSections[]
    | undefined;

  return (
    <div className="min-h-screen bg-(--background) text-white">
      {sections?.map((section, index) => renderSection(section, index))}
    </div>
  );
}
