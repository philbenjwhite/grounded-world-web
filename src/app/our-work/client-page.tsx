"use client";

import { useTina } from "tinacms/dist/react";
import type { PageQuery, PageSections } from "../../../tina/__generated__/types";
import HeroBanner from "@/components/components/HeroBanner";
import WorkGrid from "@/components/components/WorkGrid";
import type { WorkItem } from "@/components/components/WorkGrid";

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

  const heroSection = data.page.sections?.find(
    (s): s is PageSections & { __typename: "PageSectionsHeroBanner" } =>
      s?.__typename === "PageSectionsHeroBanner",
  );

  return (
    <div className="min-h-screen bg-(--background) text-white">
      <HeroBanner
        backgroundType={
          (heroSection?.backgroundType as "vimeo" | "image" | "canvas") ??
          "canvas"
        }
        title={heroSection?.title ?? "Our Work"}
        subtitle={heroSection?.subtitle ?? undefined}
        ctaLabel={heroSection?.ctaLabel ?? undefined}
        ctaHref={heroSection?.ctaHref ?? undefined}
        ctaVariant={
          (heroSection?.ctaVariant as "solid" | "outline") ?? undefined
        }
        overlayOpacity={
          (heroSection?.overlayOpacity as "light" | "medium" | "heavy") ??
          "light"
        }
        contentAlign={
          (heroSection?.contentAlign as "center" | "left") ?? "center"
        }
        minHeight={
          (heroSection?.minHeight as "full" | "large" | "medium") ?? "medium"
        }
        bottomFade={heroSection?.bottomFade ?? undefined}
      />

      <WorkGrid items={props.workItems} />
    </div>
  );
}
