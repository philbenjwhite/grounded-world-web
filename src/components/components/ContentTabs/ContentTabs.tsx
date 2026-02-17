"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import cn from "classnames";
import Image from "next/image";
import { iconMap } from "@/lib/iconMap";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./ContentTabs.module.css";

/* ─── Types ──────────────────────────────────── */

export interface ContentTabSubsection {
  heading: string;
  body: string;
  imageSrc?: string;
  imageAlt?: string;
  videoSrc?: string;
}

export interface ContentTabItem {
  title: string;
  icon?: string;
  color: string;
  subtitle: string;
  body: string;
  imageSrc?: string;
  imageAlt?: string;
  videoSrc?: string;
  buttonLabel?: string;
  buttonHref?: string;
  buttonExternal?: boolean;
  subsections?: ContentTabSubsection[];
}

export interface ContentTabsProps {
  sectionTitle?: string;
  sectionSubtitle?: string;
  items: ContentTabItem[];
  defaultActiveIndex?: number;
}

/* ─── Text formatting helpers ─────────────────── */

function formatInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function renderBody(body: string): React.ReactNode {
  const paragraphs = body.split("\n\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ol
          key={`list-${elements.length}`}
          className="list-decimal list-outside pl-5 space-y-2 mb-4"
        >
          {listItems.map((item, li) => (
            <li
              key={li}
              className="text-[color:var(--font-color-secondary)] text-[length:var(--font-size-body-md)] leading-relaxed"
            >
              {formatInline(item)}
            </li>
          ))}
        </ol>
      );
      listItems = [];
    }
  };

  for (const p of paragraphs) {
    const listMatch = p.match(/^\d+\.\s+(.*)/);
    if (listMatch) {
      listItems.push(listMatch[1]);
    } else {
      flushList();
      elements.push(
        <Text
          key={`p-${elements.length}`}
          size="body-lg"
          color="secondary"
          className="mb-4"
        >
          {formatInline(p)}
        </Text>
      );
    }
  }
  flushList();

  return <>{elements}</>;
}

/* ─── Component ──────────────────────────────── */

const ContentTabs: React.FC<ContentTabsProps> = ({
  sectionTitle,
  sectionSubtitle,
  items,
  defaultActiveIndex,
}) => {
  const initial = defaultActiveIndex ?? 0;
  const [activeIndex, setActiveIndex] = useState(initial);
  const [displayIndex, setDisplayIndex] = useState(initial);
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [mobileSubIndices, setMobileSubIndices] = useState<
    Record<number, number>
  >({});
  const [animState, setAnimState] = useState<"visible" | "out" | "in">(
    "visible",
  );
  const headingRef = useScrollReveal(0.3);
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  // Detect when the tab bar becomes sticky
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-97px 0px 0px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Tab click: animate content swap in place (no scroll)
  const handleTabClick = useCallback(
    (newIndex: number) => {
      if (newIndex === activeIndex) return;
      setActiveIndex(newIndex);
      setActiveSubIndex(0);

      if (transitionTimer.current) clearTimeout(transitionTimer.current);

      setAnimState("out");
      transitionTimer.current = setTimeout(() => {
        setDisplayIndex(newIndex);
        setAnimState("in");
        transitionTimer.current = setTimeout(() => {
          setAnimState("visible");
        }, 350);
      }, 200);
    },
    [activeIndex],
  );

  const displayItem = items[displayIndex];

  const renderVideo = (src: string, rounding: string, constrain = false) => {
    const vimeoMatch = src.match(
      /(?:vimeo\.com\/(?:manage\/videos\/|video\/|))(\d+)/,
    );
    const wrapClass = cn(
      "relative overflow-hidden mb-6 aspect-video",
      rounding,
      constrain && "max-w-lg",
    );
    const embedUrl = vimeoMatch
      ? `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1`
      : src;

    return (
      <div className={wrapClass}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Video"
        />
      </div>
    );
  };

  const renderTabContent = (
    item: ContentTabItem,
    mobile = false,
    currentSubIndex = 0,
    onSubChange?: (index: number) => void,
  ) => {
    const imageSize = mobile
      ? { width: 480, height: 270 }
      : { width: 560, height: 315 };
    const subImageSize = mobile
      ? { width: 400, height: 225 }
      : { width: 440, height: 248 };
    const imageRounding = "rounded-xl";
    const hasSubs = item.subsections && item.subsections.length > 0;

    // Build sub-tab entries: "Overview" + each subsection heading
    const subTabs = hasSubs
      ? ["Overview", ...item.subsections!.map((s) => s.heading)]
      : [];

    const renderMedia = (
      src?: string,
      alt?: string,
      size: { width: number; height: number } = imageSize,
      videoSrc?: string,
    ) => (
      <>
        {src && (
          <div className={cn("relative overflow-hidden mb-4", imageRounding)}>
            <Image
              src={src}
              alt={alt || ""}
              {...size}
              className={cn("w-full h-auto object-cover", imageRounding)}
            />
          </div>
        )}
        {videoSrc && renderVideo(videoSrc, imageRounding)}
      </>
    );

    const headerBlock = (
      <>
        <span
          className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium mb-3 inline-block text-[color:var(--item-color)]"
        >
          {item.title}
        </span>
        <Heading level={3} size="h3" className="mb-4">
          {item.subtitle}
        </Heading>
        {hasSubs && (
          <div className="flex flex-wrap gap-2 mb-6">
            {subTabs.map((label, si) => (
              <button
                key={label}
                className={cn(
                  "relative px-3 py-1.5 text-sm rounded-lg transition-all duration-200 cursor-pointer",
                  "border",
                  si === currentSubIndex
                    ? "bg-white/[0.08] border-white/[0.12] text-white"
                    : "bg-transparent border-white/[0.06] text-white/50 hover:text-white/70 hover:bg-white/[0.03]",
                )}
                onClick={() => onSubChange?.(si)}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </>
    );

    // Overview
    if (!hasSubs || currentSubIndex === 0) {
      const hasMedia = !!(item.imageSrc || item.videoSrc);

      if (!mobile && hasMedia) {
        return (
          <div className="grid grid-cols-[1fr_1fr] gap-10 items-start">
            <div>{renderMedia(item.imageSrc, item.imageAlt || item.title, imageSize, item.videoSrc)}</div>
            <div>
              {headerBlock}
              <div className="mb-6">{renderBody(item.body)}</div>
              {item.buttonLabel && item.buttonHref && (
                <div className="mb-8">
                  <Button
                    href={item.buttonHref}
                    variant="outline"
                    target={item.buttonExternal ? "_blank" : undefined}
                  >
                    {item.buttonLabel}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      }

      return (
        <div className={cn(!mobile && "max-w-2xl")}>
          {headerBlock}
          <div className="mb-6">{renderBody(item.body)}</div>
          {item.buttonLabel && item.buttonHref && (
            <div className="mb-8">
              <Button
                href={item.buttonHref}
                variant="outline"
                target={item.buttonExternal ? "_blank" : undefined}
              >
                {item.buttonLabel}
              </Button>
            </div>
          )}
          {renderMedia(item.imageSrc, item.imageAlt || item.title, imageSize, item.videoSrc)}
        </div>
      );
    }

    // Subsection
    const sub = item.subsections![currentSubIndex - 1];
    const hasSubMedia = !!(sub.imageSrc || sub.videoSrc);

    if (!mobile && hasSubMedia) {
      return (
        <div className="grid grid-cols-[1fr_1fr] gap-10 items-start">
          <div>{renderMedia(sub.imageSrc, sub.imageAlt || sub.heading, subImageSize, sub.videoSrc)}</div>
          <div>
            {headerBlock}
            <Heading level={4} size="h4" className="mb-4">
              {sub.heading}
            </Heading>
            <div>{renderBody(sub.body)}</div>
          </div>
        </div>
      );
    }

    return (
      <div className={cn(!mobile && "max-w-2xl")}>
        {headerBlock}
        <Heading level={4} size="h4" className="mb-4">
          {sub.heading}
        </Heading>
        <div>{renderBody(sub.body)}</div>
        {renderMedia(sub.imageSrc, sub.imageAlt || sub.heading, subImageSize, sub.videoSrc)}
      </div>
    );
  };

  return (
    <Section className="relative z-20 py-16 md:py-24 lg:py-32">
      <Container className="px-[var(--layout-section-padding-x)]">
        <div className="rounded-3xl bg-white/[0.025] border border-white/[0.06] p-6 md:p-10 lg:p-12">
        {/* Section heading */}
        {(sectionTitle || sectionSubtitle) && (
          <div ref={headingRef} className="mb-10 md:mb-14 text-center">
            {sectionTitle && (
              <Heading level={2} size="h2" color="primary">
                {sectionTitle}
              </Heading>
            )}
            {sectionSubtitle && (
              <Text
                size="body-lg"
                color="secondary"
                className="mt-3 max-w-3xl mx-auto"
              >
                {sectionSubtitle}
              </Text>
            )}
          </div>
        )}

        {/* Sentinel for sticky detection */}
        <div ref={sentinelRef} className="h-0" aria-hidden="true" />

        {/* ── Desktop: sticky tab bar + scrollable content (lg+) ── */}
        <div className="hidden lg:block">
          {/* Sticky horizontal tab bar */}
          <nav
            className={cn(
              "sticky top-[96px] z-30 flex justify-center items-center gap-1 w-fit mx-auto transition-all duration-500",
              isStuck
                ? cn(styles.stickyNav, "rounded-full py-1.5 px-2")
                : "py-3 border-b border-white/[0.06] !w-auto -mx-10 lg:-mx-12 px-10 lg:px-12",
            )}
            role="tablist"
            aria-label={sectionTitle ?? "Content navigation"}
          >
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              const IconComponent = item.icon
                ? iconMap[item.icon]
                : undefined;
              return (
                <button
                  key={item.title}
                  role="tab"
                  aria-selected={isActive}
                  className={cn(
                    styles.tab,
                    "relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer",
                    "rounded-full",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/70",
                  )}
                  style={
                    { "--item-color": item.color } as React.CSSProperties
                  }
                  onClick={() => handleTabClick(index)}
                >
                  {/* Bottom indicator bar */}
                  <div
                    className={cn(
                      styles.tabIndicator,
                      "absolute left-3 right-3 bottom-0 h-[2px] rounded-full transition-all duration-300",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />

                  {IconComponent && (
                    <IconComponent
                      size={18}
                      weight="duotone"
                      className={cn(
                        "shrink-0 transition-colors duration-300",
                        isActive ? styles.iconActive : "text-white/40",
                      )}
                    />
                  )}
                  <span>{item.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Content panel — full width, scrolls naturally */}
          <div
            className={cn(
              styles.contentPanel,
              "pt-8",
              animState === "out" && styles.contentOut,
              animState === "in" && styles.contentIn,
            )}
            style={displayItem ? { "--item-color": displayItem.color } as React.CSSProperties : undefined}
            role="tabpanel"
            aria-label={displayItem?.title}
          >
            {displayItem &&
              renderTabContent(
                displayItem,
                false,
                activeSubIndex,
                setActiveSubIndex,
              )}
          </div>
        </div>

        {/* ── Mobile: horizontal scrollable tabs (below lg) ── */}
        <div className="lg:hidden">
          <nav
            className={cn(
              styles.mobileTabBar,
              "sticky top-[96px] z-30 w-fit mx-auto transition-all duration-500",
              isStuck
                ? cn(styles.stickyNav, "rounded-full py-1.5 px-2")
                : "py-2 border-b border-white/[0.06] !w-auto -mx-6 px-6",
            )}
            role="tablist"
            aria-label={sectionTitle ?? "Content navigation"}
          >
            <div className={cn(styles.tabScroller, "flex justify-center gap-1 overflow-x-auto")}>
              {items.map((item, index) => {
                const isActive = index === activeIndex;
                const IconComponent = item.icon
                  ? iconMap[item.icon]
                  : undefined;
                return (
                  <button
                    key={item.title}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={item.title}
                    className={cn(
                      styles.tab,
                      "relative flex items-center justify-center w-11 h-11 transition-all duration-300 cursor-pointer shrink-0",
                      "rounded-xl",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
                      isActive
                        ? "text-white bg-white/[0.08]"
                        : "text-white/40 hover:text-white/60 hover:bg-white/[0.04]",
                    )}
                    style={
                      { "--item-color": item.color } as React.CSSProperties
                    }
                    onClick={() => handleTabClick(index)}
                  >
                    <div
                      className={cn(
                        styles.tabIndicator,
                        "absolute left-1.5 right-1.5 bottom-0 h-[2px] rounded-full transition-all duration-300",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {IconComponent && (
                      <IconComponent
                        size={22}
                        weight="duotone"
                        className={cn(
                          "transition-colors duration-300",
                          isActive ? styles.iconActive : "",
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Mobile content panel */}
          <div
            className={cn(
              styles.contentPanel,
              "pt-6",
              animState === "out" && styles.contentOut,
              animState === "in" && styles.contentIn,
            )}
            style={displayItem ? { "--item-color": displayItem.color } as React.CSSProperties : undefined}
            role="tabpanel"
            aria-label={displayItem?.title}
          >
            {displayItem &&
              renderTabContent(
                displayItem,
                true,
                mobileSubIndices[displayIndex] ?? 0,
                (si) =>
                  setMobileSubIndices((prev) => ({
                    ...prev,
                    [displayIndex]: si,
                  })),
              )}
          </div>
        </div>
        </div>
      </Container>
    </Section>
  );
};

export default ContentTabs;
