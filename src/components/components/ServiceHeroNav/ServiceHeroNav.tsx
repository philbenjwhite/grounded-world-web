"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import cn from "classnames";
import Header from "../Header";
import styles from "./ServiceHeroNav.module.css";
import { ArrowUpRightIcon, EnvelopeIcon } from "@phosphor-icons/react";
import SectionLabel from "../../atoms/SectionLabel";
import Text from "../../atoms/Text";
import { type ServiceItem } from "./utils";

const workPlaceholders = [
  { title: "Brand Activation Campaign", tag: "Case Study", accent: "#00AEEF" },
  { title: "Digital Transformation", tag: "Featured", accent: "#FF08CC" },
  { title: "Sustainability Impact Report", tag: "Research", accent: "#1CC35B" },
  { title: "Community Platform", tag: "Product", accent: "#FFA603" },
];

const resourceTypes = [
  { label: "Podcast", accent: "#00AEEF", url: "/resources/podcast" },
  { label: "White Papers", accent: "#1CC35B", url: "/resources/white-papers" },
  { label: "How To Guides", accent: "#FF08CC", url: "/resources/guides" },
  { label: "Articles & Blogs", accent: "#FFA603", url: "/resources/articles" },
];

const colorMap: Record<string, string> = {
  "about-us": "#4DD9FF",
  "our-work": "#B1B3B6",
  resources: "#0077B5",
  newsletter: "#FFA603",
};

const servicePositions = [
  { left: "18%", top: "72%" },
  { left: "24%", top: "24%" },
  { left: "76%", top: "24%" },
  { left: "82%", top: "72%" },
];

/* ─── Component ─────────────────────────────────────── */

interface ServiceHeroNavProps {
  serviceItems: ServiceItem[];
}

const ServiceHeroNav: React.FC<ServiceHeroNavProps> = ({ serviceItems }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: "y", loop: true });
  const [activeWork, setActiveWork] = useState(0);
  const serviceCanvasRef = useRef<HTMLCanvasElement>(null);
  const serviceParticlesRef = useRef<
    Array<{
      x: number;
      y: number;
      vy: number;
      vx: number;
      size: number;
      life: number;
      color: string;
    }>
  >([]);
  const serviceAnimRef = useRef<number>(0);
  const hoveredNavRef = useRef<string | null>(null);
  const serviceItemsRef = useRef(serviceItems);

  useEffect(() => {
    serviceItemsRef.current = serviceItems;
  }, [serviceItems]);

  useEffect(() => {
    setIsClient(true);
    setIsTouchDevice(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ),
    );
  }, []);

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

  // Sync hover state to ref for particle animation loop
  useEffect(() => {
    hoveredNavRef.current = hoveredNav;
  }, [hoveredNav]);

  // Particle animation for services card
  useEffect(() => {
    if (!isClient) return;
    const canvas = serviceCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let running = true;
    const animate = () => {
      if (!running) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const hov = hoveredNavRef.current;
      const svc = hov
        ? serviceItemsRef.current.find((s) => s.id === hov)
        : null;
      if (svc && serviceParticlesRef.current.length < 35) {
        serviceParticlesRef.current.push({
          x: Math.random() * w,
          y: h + 2,
          vy: -(Math.random() * 0.6 + 0.2),
          vx: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5,
          life: 1,
          color: svc.color,
        });
      }
      serviceParticlesRef.current = serviceParticlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.006;
        if (p.life <= 0) return false;
        const a = Math.min(p.life * 0.4, 0.2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color +
          Math.floor(a * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();
        return true;
      });
      serviceAnimRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      running = false;
      cancelAnimationFrame(serviceAnimRef.current);
    };
  }, [isClient]);

  // Sync Embla selected index to activeWork
  const onEmblaSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveWork(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onEmblaSelect);
    emblaApi.on("reInit", onEmblaSelect);
    return () => {
      emblaApi.off("select", onEmblaSelect);
      emblaApi.off("reInit", onEmblaSelect);
    };
  }, [emblaApi, onEmblaSelect]);

  // Auto-advance work carousel every 5 seconds
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 7000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  const handleHover = (id: string | null) => {
    setHoveredNav(id);
  };

  if (!isClient) {
    return (
      <div
        className={cn(
          styles.loadingContainer,
          "flex flex-col w-full h-screen overflow-hidden",
        )}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className={styles.loadingText}>Loading...</div>
        </div>
      </div>
    );
  }

  const hoveredColor = hoveredNav
    ? serviceItems.find((s) => s.id === hoveredNav)?.color ??
      colorMap[hoveredNav] ??
      null
    : null;
  const hoveredServiceColor = hoveredNav
    ? serviceItems.find((s) => s.id === hoveredNav)?.color
    : undefined;
  const isNewsHovered = hoveredNav === "newsletter";
  const isWorkHovered = hoveredNav === "our-work";
  const isResourcesHovered = hoveredNav === "resources";
  const isAboutHovered = hoveredNav === "about-us";

  return (
    <div
      className={cn(
        styles.outer,
        "flex flex-col w-full h-screen overflow-hidden",
      )}
    >
      <Header />

      {/* Page-level background glow — responds to hovered card */}
      <div
        className={cn(styles.pageGlow, "absolute inset-0 pointer-events-none")}
        style={
          {
            "--glow-color": hoveredColor ?? "transparent",
          } as React.CSSProperties
        }
        data-active={hoveredColor ? "" : undefined}
      />

      {/* ─── BENTO GRID ─── */}
      <div
        className={cn(
          styles.gridWrap,
          "flex-1 min-h-0 p-2 md:p-3 relative z-10",
        )}
      >
        <div className={styles.bentoGrid}>
          {/* ━━━ HERO (3×3 — dominant) ━━━ */}
          <div className={cn(styles.bcard, styles.heroCard)}>
            <video
              ref={videoRef}
              className={cn(
                styles.heroVideo,
                "absolute inset-0 w-full h-full object-cover",
              )}
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
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10">
              <h1
                className={cn(
                  styles.heroH1,
                  "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-[0.9]",
                )}
              >
                Activating Purpose
              </h1>
              <p
                className={cn(
                  styles.heroSubtitle,
                  "text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light tracking-tight mt-1 md:mt-2",
                )}
              >
                Accelerating Impact
              </p>

              {/* ─── AWARDS MARQUEE ──────────────────────────────────
                   TODO: Replace placeholder rectangles with actual
                   award logos / images. This infinite-scroll carousel
                   auto-animates right→left and pauses on hover.
                   ──────────────────────────────────────────────────── */}
              <div
                className={cn(
                  styles.awardsMask,
                  "mt-4 md:mt-6 overflow-hidden",
                )}
              >
                <div className={styles.awardsTrack}>
                  {/* Duplicate set for seamless loop */}
                  {[...Array(2)].map((_, setIndex) => (
                    <React.Fragment key={setIndex}>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={`${setIndex}-${i}`}
                          className={cn(
                            styles.awardItem,
                            "shrink-0 rounded-md flex items-center justify-center",
                          )}
                          data-wide={i % 3 === 0 ? "" : undefined}
                        >
                          <span
                            className={cn(
                              styles.awardItemText,
                              "text-[9px] font-medium",
                            )}
                          >
                            Award
                          </span>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ━━━ SERVICES (2×2) — Half-circle layout ━━━ */}
          <div
            className={cn(styles.bcard, styles.servicesCard)}
            style={
              {
                "--service-tint-color": hoveredServiceColor ?? "transparent",
              } as React.CSSProperties
            }
            data-service-hovered={hoveredServiceColor ? "" : undefined}
          >
            {/* Particle canvas — rises from bottom on hover */}
            <canvas
              ref={serviceCanvasRef}
              className={cn(
                styles.serviceCanvas,
                "absolute inset-0 w-full h-full pointer-events-none",
              )}
            />

            {/* Hover background tint */}
            <div
              className={cn(
                styles.serviceTint,
                "absolute inset-0 pointer-events-none",
              )}
            />

            <div className="relative z-10 flex flex-col h-full p-4 md:p-5 lg:p-6">
              <SectionLabel>Services</SectionLabel>

              {/* ─── HALF-CIRCLE PLACEHOLDER ─────────────────────
                   TODO: Replace with animated SVG graphic.
                   Dotted arc + filled dome + orbiting items.
                   ────────────────────────────────────────────────── */}
              <div className="relative flex-1 mt-2">
                {/* ─── SVG Globe ─── */}
                <div
                  className={cn(
                    styles.globeWrap,
                    "absolute pointer-events-none",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/sphere.svg" alt="" className="w-full h-full" />
                </div>

                {/* Service items on the arc — animate in staggered */}
                {serviceItems.map((svc, i) => {
                  const isHovered = hoveredNav === svc.id;
                  const pos = servicePositions[i];
                  return (
                    <a
                      key={svc.id}
                      href={svc.url}
                      className={cn(
                        styles.serviceItem,
                        "absolute flex flex-col items-center gap-1.5 no-underline group/svc",
                      )}
                      style={
                        {
                          "--service-color": svc.color,
                          "--service-left": pos.left,
                          "--service-top": pos.top,
                          "--delay": `${0.4 + i * 0.12}s`,
                        } as React.CSSProperties
                      }
                      data-hovered={isHovered ? "" : undefined}
                      onMouseEnter={() => !isTouchDevice && handleHover(svc.id)}
                      onMouseLeave={() => !isTouchDevice && handleHover(null)}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(
                          svc.url,
                          isTouchDevice ? "_self" : "_blank",
                        );
                      }}
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
                    </a>
                  );
                })}
              </div>

              <Text size="body-xs" color="tertiary" className="leading-relaxed mt-2">
                Moving the needle &mdash; culturally, socially, environmentally
                and behaviorally.
              </Text>
            </div>
          </div>

          {/* ━━━ OUR WORK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               TODO: Replace this placeholder with a dedicated
               <WorkCarousel /> component fed by real case-study
               data from CMS. The gray image placeholders and
               static titles should be swapped for actual content.
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div
            className={cn(styles.bcardLink, styles.workCard)}
            data-hovered={isWorkHovered ? "" : undefined}
            onMouseEnter={() => !isTouchDevice && handleHover("our-work")}
            onMouseLeave={() => !isTouchDevice && handleHover(null)}
          >
            <div className="relative z-10 flex flex-col h-full p-4 md:p-4 lg:p-5">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <SectionLabel>Our Work</SectionLabel>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(styles.workViewAll, "text-[10px] md:text-xs")}
                  >
                    View all
                  </span>
                  <ArrowUpRightIcon
                    size={16}
                    weight="bold"
                    className={styles.workArrow}
                  />
                </div>
              </div>

              {/* Vertical Embla carousel + pagination side-by-side */}
              <div className="flex flex-1 min-h-0 gap-2 md:gap-3">
                {/* Carousel viewport */}
                <div className="relative flex-1 min-w-0 flex flex-col">
                  <div
                    className={cn(
                      styles.workViewport,
                      "overflow-hidden rounded-lg md:rounded-xl",
                    )}
                    ref={emblaRef}
                  >
                    <div className={styles.workSlideContainer}>
                      {workPlaceholders.map((wp, i) => (
                        <div key={i} className={styles.workSlide}>
                          <div
                            className={cn(
                              styles.workPlaceholderBg,
                              "w-full h-full flex items-center justify-center",
                            )}
                          >
                            <span
                              className={cn(
                                styles.workPlaceholderText,
                                "text-xs md:text-sm font-medium",
                              )}
                            >
                              {wp.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Title area — always visible below carousel */}
                  <div
                    className="shrink-0 pt-2 md:pt-3"
                    style={
                      {
                        "--accent": workPlaceholders[activeWork].accent,
                      } as React.CSSProperties
                    }
                  >
                    <span
                      className={cn(
                        styles.workTag,
                        "text-[9px] md:text-[10px] uppercase tracking-wider font-semibold",
                      )}
                    >
                      {workPlaceholders[activeWork].tag}
                    </span>
                    <p
                      className={cn(
                        styles.workTitle,
                        "text-xs md:text-sm font-semibold mt-0.5 leading-tight",
                      )}
                    >
                      {workPlaceholders[activeWork].title}
                    </p>
                  </div>
                </div>

                {/* Vertical bar pagination — centered beside carousel */}
                <div className="shrink-0 flex flex-col items-center justify-center gap-2">
                  {workPlaceholders.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        emblaApi?.scrollTo(i);
                      }}
                      className={cn(styles.paginationDot, "rounded-sm")}
                      data-active={i === activeWork ? "" : undefined}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ━━━ RESOURCES — Simple 2×2 grid (2×2 area) ━━━ */}
          <div
            className={cn(styles.bcard, styles.resourcesCard)}
            data-hovered={isResourcesHovered ? "" : undefined}
            onMouseEnter={() => !isTouchDevice && handleHover("resources")}
            onMouseLeave={() => !isTouchDevice && handleHover(null)}
          >
            <div
              className={cn(
                styles.resourcesGlow,
                "absolute inset-0 pointer-events-none",
              )}
            />
            <div className="relative z-10 flex flex-col h-full p-3 md:p-4 lg:p-5">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <SectionLabel>Resources</SectionLabel>
                <ArrowUpRightIcon
                  size={16}
                  weight="bold"
                  className={styles.resourcesArrow}
                />
              </div>

              <div className="flex-1 grid grid-cols-2 gap-2 md:gap-3 content-center">
                {resourceTypes.map((rt) => (
                  <a
                    key={rt.label}
                    href={rt.url}
                    className={cn(
                      styles.resourceItem,
                      "flex items-center gap-2.5 rounded-lg p-2.5 md:p-3 no-underline group/rt",
                    )}
                    style={{ "--accent": rt.accent } as React.CSSProperties}
                  >
                    <div
                      className={cn(
                        styles.resourceBar,
                        "w-1 h-5 md:h-6 rounded-full shrink-0",
                      )}
                    />
                    <span
                      className={cn(
                        styles.resourceLabel,
                        "text-[11px] md:text-xs font-medium leading-tight",
                      )}
                    >
                      {rt.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ━━━ NEWSLETTER ━━━ */}
          <div
            className={cn(styles.bcardLink, styles.newsletterCard, "group")}
            data-hovered={isNewsHovered ? "" : undefined}
            onMouseEnter={() => !isTouchDevice && handleHover("newsletter")}
            onMouseLeave={() => !isTouchDevice && handleHover(null)}
          >
            <div
              className={cn(
                styles.newsGlow,
                "absolute inset-0 pointer-events-none",
              )}
            />
            <div className="relative z-10 flex items-center gap-3 h-full p-3 md:p-4">
              <EnvelopeIcon
                size={20}
                weight="duotone"
                className={cn(styles.newsIcon, "shrink-0")}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    styles.newsTitle,
                    "text-xs md:text-sm font-semibold leading-tight",
                  )}
                >
                  Newsletter
                </p>
                <Text size="body-xs" color="tertiary" className="leading-snug mt-0.5 truncate">
                  Weekly purpose-driven insights
                </Text>
              </div>
              <div
                className={cn(
                  styles.newsSubscribeBtn,
                  "shrink-0 h-7 md:h-8 px-3 rounded-full text-[10px] md:text-xs font-semibold flex items-center",
                )}
              >
                Subscribe
              </div>
            </div>
          </div>

          {/* ━━━ ABOUT US ━━━ */}
          <div
            className={cn(styles.bcardLink, styles.aboutCard, "group")}
            data-hovered={isAboutHovered ? "" : undefined}
            onMouseEnter={() => !isTouchDevice && handleHover("about-us")}
            onMouseLeave={() => !isTouchDevice && handleHover(null)}
            onClick={() =>
              window.open("/about", isTouchDevice ? "_self" : "_blank")
            }
          >
            <div
              className={cn(
                styles.aboutGlow,
                "absolute inset-0 pointer-events-none",
              )}
            />
            <div className="relative z-10 flex flex-col justify-between h-full p-3 md:p-4">
              <div>
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <SectionLabel>About Us</SectionLabel>
                  <ArrowUpRightIcon
                    size={16}
                    weight="bold"
                    className={styles.aboutArrow}
                  />
                </div>
                <p
                  className={cn(
                    styles.aboutHeadingWhite,
                    "text-sm md:text-base lg:text-lg font-bold leading-tight tracking-tight",
                  )}
                >
                  Big Brand Muscle.
                </p>
                <p
                  className={cn(
                    styles.aboutHeadingCyan,
                    "text-sm md:text-base lg:text-lg font-bold leading-tight tracking-tight",
                  )}
                >
                  Boutique Hustle.
                </p>
              </div>
              <div className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/bcorp-logo.svg"
                  alt="Certified B Corporation"
                  className={cn(
                    styles.bCorpLogo,
                    "h-14 md:h-16 lg:h-20 w-auto",
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHeroNav;
