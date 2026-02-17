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
  minHeight?: "full" | "large" | "medium";
  /** Show a bottom gradient that bleeds into the next section */
  bottomFade?: boolean;
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
  full: "min-h-screen md:min-h-screen",
  large: "min-h-[70vh] md:min-h-[80vh]",
  medium: "min-h-[60vh] md:min-h-[60vh]",
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

  return (
    <>
    <section
      className={cn(
        "relative w-full overflow-hidden",
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

      {/* ── Internal bottom fade (z-15) ── */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-[15] h-[35vh] pointer-events-none",
          styles.canvasFade
        )}
      />

      {/* ── Content Layer (z-20) ──────────────────────── */}
      <div
        className={cn(
          "relative z-20 flex flex-col justify-center",
          "px-6 md:px-12 lg:px-24",
          minHeightClasses[minHeight],
          contentAlign === "center"
            ? "items-center text-center"
            : "items-start text-left"
        )}
      >
        {/* Title — unconstrained width so it stays on one line at desktop */}
        <div className={styles.animateTitle}>
          <Heading
            level={1}
            size="display"
            color="primary"
            className="lg:whitespace-nowrap"
          >
            {title}
          </Heading>
        </div>

        {/* Subtitle + CTAs — max-width for readable line lengths */}
        <div
          className={cn(
            "max-w-4xl",
            contentAlign === "center" && "mx-auto"
          )}
        >
          {subtitle && (
            <div className={cn(styles.animateSubtitle, "mt-4 md:mt-6")}>
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

          {(hasCta || hasSecondaryCta) && (
            <div
              className={cn(
                styles.animateCta,
                "mt-8 md:mt-10 flex flex-wrap gap-4 items-center",
                contentAlign === "center"
                  ? "justify-center"
                  : "justify-start"
              )}
            >
              {hasCta && (
                <Button
                  href={ctaHref}
                  variant={ctaVariant === "outline" ? "secondary" : "primary"}
                >
                  {ctaLabel}
                </Button>
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
    </section>

    {/* ── External bottom fade — sits outside overflow-hidden to eliminate seam ── */}
    {bottomFade && (
      <div
        className={cn(
          "relative z-10 -mt-40 h-40 pointer-events-none",
          styles.bottomFade
        )}
      />
    )}
    </>
  );
};

export default HeroBanner;
