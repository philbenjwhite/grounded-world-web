"use client";

import React, { useRef, useEffect, useSyncExternalStore, useState } from "react";
import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRightIcon, EnvelopeIcon } from "@phosphor-icons/react";
import Marquee from "react-fast-marquee";
import Heading from "../../atoms/Heading";
import SectionLabel from "../../atoms/SectionLabel";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button/Button";
import styles from "./ServiceHeroNavSimple.module.css";
import { mapCmsServices } from "../ServiceHeroNav/utils";
import type { Service } from "../../../../tina/__generated__/types";

/* ─── Data ──────────────────────────────────────────── */

const svcPositions = [
  { left: "18%", top: "72%" },
  { left: "24%", top: "24%" },
  { left: "76%", top: "24%" },
  { left: "82%", top: "72%" },
];

const colorMap: Record<string, string> = {
  services: "#00AEEF",
  newsletter: "#FFA603",
};

/* ─── Component ─────────────────────────────────────── */

interface ServiceHeroNavSimpleProps {
  services: Service[];
}

const ServiceHeroNavSimple: React.FC<ServiceHeroNavSimpleProps> = ({
  services,
}) => {
  const serviceItems = mapCmsServices(services);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredSvc, setHoveredSvc] = useState<string | null>(null);

  // Video playback
  useEffect(() => {
    if (!videoRef.current || !isClient) return;
    const video = videoRef.current;
    const play = async () => {
      try {
        if (video.paused) await video.play();
      } catch {
        /* silent */
      }
    };
    play();
    const onPause = () => setTimeout(play, 100);
    const onVis = () => {
      if (!document.hidden) play();
    };
    video.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", play);
    const iv = setInterval(() => {
      if (video.paused) play();
    }, 2000);
    return () => {
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", play);
      clearInterval(iv);
    };
  }, [isClient]);

  const handleHover = (id: string | null) => setHoveredCard(id);
  const handleSvcHover = (id: string | null) => setHoveredSvc(id);

  if (!isClient) {
    return (
      <div
        className={cn(
          styles.loadingContainer,
          "flex w-full h-screen items-center justify-center",
        )}
      >
        <div className={styles.loadingText}>Loading...</div>
      </div>
    );
  }

  const hoveredColor = hoveredCard ? colorMap[hoveredCard] ?? null : null;
  const isSvcHovered = hoveredCard === "services";
  const isNewsHovered = hoveredCard === "newsletter";

  return (
    <div className={styles.outer}>
      {/* SVG clip-path for L-shape */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="shn-hero-l-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.031 0 H0.969 C0.986 0 1 0.012 1 0.026 V0.686 C1 0.700 0.986 0.712 0.969 0.712 H0.581 C0.564 0.712 0.555 0.724 0.555 0.738 V0.974 C0.555 0.988 0.541 1 0.524 1 H0.031 C0.014 1 0 0.988 0 0.974 V0.026 C0 0.012 0.014 0 0.031 0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Page-level background glow */}
      <div
        className={cn(styles.pageGlow, "absolute inset-0 pointer-events-none")}
        style={
          { "--glow-color": hoveredColor ?? "transparent" } as React.CSSProperties
        }
        data-active={hoveredColor ? "" : undefined}
      />

      <div className={cn(styles.layout, "relative z-10")}>
        {/* ━━━ L-SHAPED HERO ━━━ */}
        <div className={styles.heroL}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="https://player.vimeo.com/progressive_redirect/playback/1161946524/rendition/720p/file.mp4%20%28720p%29.mp4?loc=external&log_user=0&signature=ff985305bacd44ceec1d96f384a10daa44f54d5055afc72a0b9ec4ab171053ab"
              type="video/mp4"
            />
          </video>

          <div className={cn(styles.heroOverlay, "absolute inset-0")} />

          {/* Heading text */}
          <div
            className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 lg:p-12"
            style={{ paddingBottom: "34%" }}
          >
            <Heading level={1} size="display" color="primary">
              Activating Purpose
            </Heading>
            <Text size="subtitle" color="secondary" className="mt-2">
              Accelerating Impact
            </Text>
          </div>

          {/* B Corp logo */}
          <div className="absolute left-0 bottom-0 p-8 md:p-10">
            <Image
              src="/bcorp-logo.svg"
              alt="Certified B Corporation"
              width={80}
              height={80}
              className={cn(
                styles.bCorpLogo,
                "h-14 md:h-16 lg:h-20 w-auto",
              )}
            />
          </div>
        </div>

        {/* ━━━ RIGHT COLUMN — services + newsletter ━━━ */}
        <div className={styles.rightCol}>
          {/* SERVICES */}
          <div
            className={cn(
              styles.glassLink,
              styles.servicesCard,
              "flex-1 flex flex-col",
            )}
            data-hovered={isSvcHovered ? "" : undefined}
            onMouseEnter={() => handleHover("services")}
            onMouseLeave={() => handleHover(null)}
          >
            <div
              className={cn(
                styles.servicesGlow,
                "absolute inset-0 pointer-events-none",
              )}
            />

            <div className="relative z-10 flex flex-col h-full p-4 md:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <SectionLabel>Services</SectionLabel>
                <ArrowUpRightIcon
                  size={16}
                  weight="bold"
                  className={styles.servicesArrow}
                />
              </div>

              <div className="relative flex-1 mt-2">
                <div
                  className={cn(
                    styles.globeWrap,
                    "absolute pointer-events-none",
                  )}
                >
                  <Image
                    src="/sphere.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>

                {serviceItems.map((svc, i) => {
                  const pos = svcPositions[i];
                  return (
                    <Link
                      key={svc.id}
                      href={svc.url}
                      className={cn(
                        styles.serviceItem,
                        "absolute flex flex-col items-center gap-1.5 no-underline",
                      )}
                      style={
                        {
                          "--service-color": svc.color,
                          "--service-left": pos.left,
                          "--service-top": pos.top,
                          "--delay": `${0.4 + i * 0.12}s`,
                        } as React.CSSProperties
                      }
                      data-hovered={hoveredSvc === svc.id ? "" : undefined}
                      onMouseEnter={() => handleSvcHover(svc.id)}
                      onMouseLeave={() => handleSvcHover(null)}
                    >
                      <div
                        className={cn(
                          styles.serviceOrb,
                          "w-9 h-9 md:w-10 md:h-10 rounded-full shrink-0 flex items-center justify-center",
                        )}
                      >
                        <svc.icon
                          size={16}
                          weight="bold"
                          className={styles.serviceIcon}
                        />
                      </div>
                      <span
                        className={cn(
                          styles.serviceLabel,
                          "text-[10px] md:text-xs font-medium whitespace-nowrap",
                        )}
                      >
                        {svc.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <Text
                size="body-xs"
                color="tertiary"
                className="leading-relaxed mt-2"
              >
                Moving the needle &mdash; culturally, socially, environmentally
                and behaviorally.
              </Text>
            </div>
          </div>

          {/* NEWSLETTER */}
          <Link
            href="/newsletter"
            className={cn(
              styles.glassLink,
              styles.newsletterCard,
              "flex-1 flex items-center no-underline",
            )}
            data-hovered={isNewsHovered ? "" : undefined}
            onMouseEnter={() => handleHover("newsletter")}
            onMouseLeave={() => handleHover(null)}
          >
            <div
              className={cn(
                styles.newsGlow,
                "absolute inset-0 pointer-events-none",
              )}
            />
            <div className="relative z-10 flex flex-col justify-center h-full w-full p-5 md:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4">
                <SectionLabel>Newsletter</SectionLabel>
                <ArrowUpRightIcon
                  size={16}
                  weight="bold"
                  className={styles.newsArrow}
                />
              </div>
              <div className="flex items-center gap-3">
                <EnvelopeIcon
                  size={28}
                  weight="duotone"
                  className={cn(styles.newsIcon, "shrink-0")}
                />
                <div>
                  <Text
                    size="body-xs"
                    color="secondary"
                    as="p"
                    className={cn(
                      styles.newsTitle,
                      "font-semibold leading-tight text-sm md:text-base lg:text-lg",
                    )}
                  >
                    Weekly purpose-driven insights
                  </Text>
                  <Text
                    size="body-xs"
                    color="tertiary"
                    className="leading-snug mt-1"
                  >
                    Subscribe to stay in the loop
                  </Text>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* ━━━ CUTOUT AREA — Awards + Button ━━━ */}
        <div className={styles.cutout}>
          {/* Awards marquee */}
          <div className="flex-1 min-w-0">
            <Marquee speed={30} pauseOnHover gradient gradientColor="black" gradientWidth={40}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    styles.awardItem,
                    "shrink-0 rounded-md flex items-center justify-center mx-3",
                  )}
                  data-wide={i % 3 === 0 ? "" : undefined}
                >
                  <span
                    className={cn(styles.awardItemText, "text-[9px] font-medium")}
                  >
                    Award
                  </span>
                </div>
              ))}
            </Marquee>
          </div>

          {/* Primary CTA */}
          <div className="shrink-0">
            <Button href="/contact">Get in Touch</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHeroNavSimple;
