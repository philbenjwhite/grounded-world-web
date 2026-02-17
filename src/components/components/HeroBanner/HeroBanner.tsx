"use client";

import React, { useState } from "react";
import cn from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import styles from "./HeroBanner.module.css";

const DefaultPlexusBackground = dynamic(
  () => import("../PlexusBackground/PlexusBackground"),
  { ssr: false }
);

/* ─── Types ──────────────────────────────────────────── */

export interface HeroBannerProps {
  /** Background media type */
  backgroundType: "vimeo" | "image" | "canvas";

  /** Full Vimeo URL (standard or unlisted) */
  vimeoUrl?: string;
  /** Fallback image shown while Vimeo loads */
  posterSrc?: string;

  /** Background image URL/path (when backgroundType is 'image') */
  imageSrc?: string;
  /** Alt text for background image */
  imageAlt?: string;

  /** Optional custom canvas component (defaults to PlexusBackground) */
  canvasComponent?: React.ComponentType;

  /** Main headline */
  title: string;
  /** Supporting text — plain text or simple HTML string */
  subtitle?: string;

  /** Primary CTA button text */
  ctaLabel?: string;
  /** Primary CTA link destination */
  ctaHref?: string;
  /** Primary CTA style */
  ctaVariant?: "solid" | "outline";

  /** Secondary CTA button text */
  secondaryCtaLabel?: string;
  /** Secondary CTA link destination */
  secondaryCtaHref?: string;

  /** Dark overlay intensity */
  overlayOpacity?: "light" | "medium" | "heavy";
  /** Content horizontal alignment */
  contentAlign?: "center" | "left";
  /** Minimum height of the hero section */
  minHeight?: "full" | "large" | "medium" | "condensed" | "fit";
  /** Show a bottom gradient that bleeds into the next section */
  bottomFade?: boolean;

  /** Decorative image shown on the right side of the hero (forces left alignment) */
  featureImageSrc?: string;
  /** Alt text for the feature image */
  featureImageAlt?: string;
  /** Optional paragraph shown inside the highlights box above the bullet items */
  highlightsDescription?: string;
  /** Highlighted service items shown in a bordered box */
  highlights?: string[];
  /** Border/accent color for the highlights box */
  highlightColor?: string;
  /** When true: title+subtitle+CTA on left, feature image+highlights on right */
  highlightsInRight?: boolean;

  /** Precomputed data-tina-field values for click-to-edit in TinaCMS visual editor */
  tinaFields?: {
    title?: string;
    subtitle?: string;
    highlights?: string;
    highlightsDescription?: string;
    ctaLabel?: string;
  };
}

/* ─── Helpers ────────────────────────────────────────── */

function parseVimeoUrl(
  url: string
): { id: string; hash?: string } | null {
  const patterns = [
    /vimeo\.com\/(\d+)\/([a-zA-Z0-9]+)/, // unlisted with hash in path
    /player\.vimeo\.com\/video\/(\d+)\?.*?h=([a-zA-Z0-9]+)/, // player URL with hash param
    /vimeo\.com\/(\d+)/, // standard
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { id: match[1], hash: match[2] || undefined };
    }
  }
  return null;
}

const overlayClasses: Record<string, string> = {
  light: "bg-black/40",
  medium: "bg-black/60",
  heavy: "bg-black/75",
};

const minHeightClasses: Record<string, string> = {
  full: "h-[75dvh] md:h-[calc(100dvh-56px)]",
  large: "h-[75dvh] md:h-[calc(100dvh-56px)]",
  medium: "h-[60dvh] md:h-[70dvh]",
  condensed: "h-[50dvh] md:h-[60dvh]",
  fit: "",
};

/* ─── Component ──────────────────────────────────────── */

const HeroBanner: React.FC<HeroBannerProps> = ({
  backgroundType,
  vimeoUrl,
  posterSrc,
  imageSrc,
  imageAlt = "",
  canvasComponent: CanvasComponent,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  ctaVariant = "solid",
  secondaryCtaLabel,
  secondaryCtaHref,
  overlayOpacity = "medium",
  contentAlign = "center",
  minHeight = "full",
  bottomFade = false,
  featureImageSrc,
  featureImageAlt = "",
  highlightsDescription,
  highlights,
  highlightColor,
  highlightsInRight = false,
  tinaFields,
}) => {
  const PlexusBg = CanvasComponent ?? DefaultPlexusBackground;
  const [iframeReady, setIframeReady] = useState(false);

  const vimeo =
    backgroundType === "vimeo" && vimeoUrl
      ? parseVimeoUrl(vimeoUrl)
      : null;

  const iframeSrc = vimeo
    ? `https://player.vimeo.com/video/${vimeo.id}?background=1&autoplay=1&loop=1&muted=1&quality=auto${vimeo.hash ? `&h=${vimeo.hash}` : ""}`
    : undefined;

  const isHtml = subtitle ? /<[a-z][\s\S]*>/i.test(subtitle) : false;

  const hasCta = ctaLabel && ctaHref;
  const hasSecondaryCta = secondaryCtaLabel && secondaryCtaHref;
  const hasFeatureImage = !!featureImageSrc;
  const hasHighlights = highlights && highlights.length > 0;

  // When a feature image OR highlightsInRight is active, force left alignment
  const effectiveAlign = (hasFeatureImage || highlightsInRight) ? "left" : contentAlign;
  // Right column exists when there's a feature image or when highlights are pushed right
  const hasRightColumn = hasFeatureImage || (highlightsInRight && hasHighlights);

  // Map predefined token values to static Tailwind class strings so Tailwind
  // can scan them at build time. Falls back to magenta for unknown values.
  const accentClasses: Record<string, { border: string; dot: string }> = {
    "var(--color-magenta)": { border: "border-[var(--color-magenta)]", dot: "bg-[var(--color-magenta)]" },
    "var(--color-cyan)":    { border: "border-[var(--color-cyan)]",    dot: "bg-[var(--color-cyan)]"    },
    "var(--color-gold)":    { border: "border-[var(--color-gold)]",    dot: "bg-[var(--color-gold)]"    },
  };
  const accent = accentClasses[highlightColor ?? ""] ?? accentClasses["var(--color-magenta)"];

  return (
    <>
    <div className="relative w-full p-4 md:p-6 bg-(--background)">
    <section
      className={cn(
        "relative w-full overflow-hidden rounded-3xl",
        minHeightClasses[minHeight]
      )}
    >
      {/* ── Media Layer (z-0) ─────────────────────────── */}
      <div className="absolute inset-0 z-0 bg-(--background)">
        {/* Poster / fallback image (behind iframe or as primary image bg) */}
        {backgroundType === "vimeo" && posterSrc && (
          <Image
            src={posterSrc}
            alt=""
            fill
            className="object-cover"
            priority
          />
        )}

        {backgroundType === "image" && imageSrc && (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            priority
          />
        )}

        {backgroundType === "canvas" && (
          <div className="absolute inset-0 z-0">
            <PlexusBg />
          </div>
        )}

        {/* Vimeo iframe — hidden until loaded, then fades in over the poster */}
        {backgroundType === "vimeo" && iframeSrc && (
          <iframe
            src={iframeSrc}
            className={cn(
              styles.vimeoIframe,
              "absolute border-0 bg-black transition-opacity duration-1000 ease-in-out",
              iframeReady ? "opacity-100" : "opacity-0"
            )}
            allow="autoplay; fullscreen"
            aria-hidden="true"
            tabIndex={-1}
            title=""
            onLoad={() => setIframeReady(true)}
          />
        )}
      </div>

      {/* ── Dark Overlay (z-10) ───────────────────────── */}
      <div
        className={cn(
          "absolute inset-0 z-10",
          overlayClasses[overlayOpacity]
        )}
      />

      {/* ── Internal bottom fade (z-15) — canvas backgrounds only ── */}
      {backgroundType === "canvas" && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-[15] h-[35vh] pointer-events-none",
            styles.canvasFade
          )}
        />
      )}

      {/* ── Content Layer (z-20) ──────────────────────── */}
      <div
        className={cn(
          "relative z-20 flex flex-col justify-center",
          "px-6 md:px-12 lg:px-24",
          minHeight === "fit" ? "py-12 md:py-16 lg:py-20" : minHeightClasses[minHeight],
          effectiveAlign === "center"
            ? "items-center text-center"
            : "items-start text-left"
        )}
      >
        {/* Wrapper: 2-col grid when feature image or highlights-in-right is active */}
        <div
          className={cn(
            "w-full",
            hasRightColumn && "grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-16 items-start"
          )}
        >
          {/* ── Text column ──────────────────────── */}
          <div>
            {/* Feature image — small badge above title when highlightsInRight */}
            {hasFeatureImage && highlightsInRight && (
              <div className={cn(styles.animateFeatureImage, "mb-5")}>
                <Image
                  src={featureImageSrc!}
                  alt={featureImageAlt}
                  width={200}
                  height={60}
                  className="h-12 md:h-14 w-auto object-contain"
                />
              </div>
            )}

            {/* Title */}
            <div className={styles.animateTitle} data-tina-field={tinaFields?.title}>
              <Heading
                level={1}
                size="display"
                color="primary"
                className={cn(!hasRightColumn && "lg:whitespace-nowrap")}
              >
                {title}
              </Heading>
            </div>

            {/* Subtitle + (inline) highlights + CTAs */}
            <div
              className={cn(
                "max-w-4xl",
                effectiveAlign === "center" && "mx-auto"
              )}
            >
              {subtitle && (
                <div className={cn(styles.animateSubtitle, "mt-4 md:mt-6")} data-tina-field={tinaFields?.subtitle}>
                  {isHtml ? (
                    <Text
                      size="body-lg"
                      color="secondary"
                      className="leading-relaxed"
                      as="div"
                    >
                      <span dangerouslySetInnerHTML={{ __html: subtitle }} />
                    </Text>
                  ) : (
                    <Text
                      size="body-lg"
                      color="secondary"
                      className="leading-relaxed"
                    >
                      {subtitle}
                    </Text>
                  )}
                </div>
              )}

              {/* Highlights box — inline (default) */}
              {hasHighlights && !highlightsInRight && (
                <div
                  className={cn(styles.animateHighlights, "mt-6 md:mt-8")}
                  data-tina-field={tinaFields?.highlights}
                >
                  <div className={cn("rounded-xl bg-black/50 backdrop-blur-sm border px-5 py-4 flex flex-col gap-2", accent.border)}>
                    {highlightsDescription && (
                      <div data-tina-field={tinaFields?.highlightsDescription}>
                        <Text size="body-sm" color="secondary" className="mb-2">
                          {highlightsDescription}
                        </Text>
                      </div>
                    )}
                    <ul className="flex flex-col gap-2">
                      {highlights.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span
                            className={cn("mt-2 h-1.5 w-1.5 rounded-full shrink-0", accent.dot)}
                            aria-hidden="true"
                          />
                          <Text size="body-md" color="primary" as="span">
                            {item}
                          </Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {(hasCta || hasSecondaryCta) && (
                <div
                  className={cn(
                    styles.animateCta,
                    "mt-8 md:mt-10 flex flex-wrap gap-4 items-center",
                    effectiveAlign === "center"
                      ? "justify-center"
                      : "justify-start"
                  )}
                >
                  {hasCta && (
                    <div data-tina-field={tinaFields?.ctaLabel}>
                      <Button
                        href={ctaHref}
                        variant={ctaVariant === "outline" ? "secondary" : "primary"}
                      >
                        {ctaLabel}
                      </Button>
                    </div>
                  )}
                  {hasSecondaryCta && (
                    <Button
                      href={secondaryCtaHref}
                      variant="secondary"
                    >
                      {secondaryCtaLabel}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right column ── */}
          {hasRightColumn && (
            <div className={cn("hidden lg:flex flex-col gap-6 items-start shrink-0 w-[320px] xl:w-[380px]")}>
              {/* Feature image in right column only when NOT using highlightsInRight */}
              {hasFeatureImage && !highlightsInRight && (
                <div className={cn(styles.animateFeatureImage, "w-full")}>
                  <Image
                    src={featureImageSrc!}
                    alt={featureImageAlt}
                    width={380}
                    height={380}
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                </div>
              )}
              {hasHighlights && highlightsInRight && (
                <div
                  className={cn(styles.animateHighlights, "w-full mt-1")}
                  data-tina-field={tinaFields?.highlights}
                >
                  <div className={cn("rounded-xl bg-black/50 backdrop-blur-sm border px-5 py-4 flex flex-col gap-2", accent.border)}>
                    {highlightsDescription && (
                      <div data-tina-field={tinaFields?.highlightsDescription}>
                        <Text size="body-sm" color="secondary" className="mb-2">
                          {highlightsDescription}
                        </Text>
                      </div>
                    )}
                    <ul className="flex flex-col gap-2">
                      {highlights!.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span
                            className={cn("mt-2 h-1.5 w-1.5 rounded-full shrink-0", accent.dot)}
                            aria-hidden="true"
                          />
                          <Text size="body-md" color="primary" as="span">
                            {item}
                          </Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* ── Bottom gradient inside the hero — fades image to black at bottom ── */}
      {bottomFade && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-[15] h-1/3 pointer-events-none",
            styles.bottomFade
          )}
        />
      )}
    </section>
    </div>
    </>
  );
};

export default HeroBanner;
