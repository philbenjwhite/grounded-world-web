"use client";

import React, {
  useRef,
  useEffect,
  useSyncExternalStore,
  useState,
  useCallback,
} from "react";
import cn from "classnames";
import Image from "next/image";
import { PlayIcon } from "@phosphor-icons/react";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import VimeoModal from "./VimeoModal";
import styles from "./VideoHero.module.css";

const DEFAULT_BACKGROUND_VIDEO_URL =
  "https://player.vimeo.com/progressive_redirect/playback/1161946524/rendition/720p/file.mp4%20%28720p%29.mp4?loc=external&log_user=0&signature=ff985305bacd44ceec1d96f384a10daa44f54d5055afc72a0b9ec4ab171053ab";

const DEFAULT_VIMEO_ID = "1153662802";

export interface VideoHeroProps {
  backgroundVideoUrl?: string;
  vimeoId?: string;
  heading?: string;
  subheading?: string;
}

const VideoHero: React.FC<VideoHeroProps> = ({
  backgroundVideoUrl = DEFAULT_BACKGROUND_VIDEO_URL,
  vimeoId = DEFAULT_VIMEO_ID,
  heading = "Activating Purpose",
  subheading = "Accelerating Impact",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  /* ─── Video autoplay ─── */
  useEffect(() => {
    if (!videoRef.current || !heroRef.current || !isClient) return;
    const video = videoRef.current;
    const hero = heroRef.current;
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

    /* Resume when hero scrolls back into view (critical for mobile) */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
      },
      { threshold: 0.1 },
    );
    observer.observe(hero);

    video.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", play);
    const iv = setInterval(() => {
      if (video.paused) play();
    }, 2000);
    return () => {
      observer.disconnect();
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", play);
      clearInterval(iv);
    };
  }, [isClient]);

  /* ─── Custom cursor tracking ─── */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cursorRef.current) return;
    cursorRef.current.style.left = `${e.clientX}px`;
    cursorRef.current.style.top = `${e.clientY}px`;
    setCursorVisible(true);
  }, []);

  const handleMouseEnter = useCallback(() => setCursorVisible(true), []);
  const handleMouseLeave = useCallback(() => setCursorVisible(false), []);

  /* Hide cursor instantly on scroll (mouseLeave doesn't fire when scrolling away) */
  useEffect(() => {
    const hide = () => setCursorVisible(false);
    window.addEventListener("scroll", hide, { passive: true });
    return () => window.removeEventListener("scroll", hide);
  }, []);

  if (!isClient) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-(--background)">
        <div className="text-[color:var(--color-gray-4)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full p-4 md:p-6 bg-(--background)">
      {/* Custom play cursor */}
      <div
        ref={cursorRef}
        className={styles.cursorWrapper}
        data-visible={cursorVisible ? "" : undefined}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 relative">
          <div className={styles.cursorRing} />
          <div className="w-36 h-36 rounded-full bg-[#111111]/92 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center gap-1.5">
            <PlayIcon size={26} weight="bold" className="text-[#FF08CC]" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
              Play
            </span>
          </div>
        </div>
      </div>

      <div
        ref={heroRef}
        className={cn(
          styles.heroContainer,
          "relative w-full h-full overflow-hidden rounded-3xl",
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Play video"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setModalOpen(true);
        }}
      >
        {/* Background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={backgroundVideoUrl} type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div className={cn(styles.overlay, "absolute inset-0")} />

        {/* Center-aligned heading */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <div className={styles.animateHeading}>
            <Heading level={1} size="display" color="primary">
              {heading}
            </Heading>
          </div>
          <div className={cn(styles.animateSubtitle, "mt-2")}>
            <Text size="subtitle" color="secondary">
              {subheading}
            </Text>
          </div>
        </div>

        {/* B Corp — bottom right */}
        <div
          className={cn(
            styles.animateBcorp,
            "absolute bottom-0 right-0 flex flex-col gap-1 p-8 md:p-10 lg:p-12",
          )}
        >
          <Text
            size="body-xs"
            color="secondary"
            className="font-semibold uppercase tracking-wider"
          >
            Bcorp
          </Text>
          <Image
            src="/bcorp-logo.svg"
            alt="Certified B Corporation"
            width={80}
            height={80}
            className={cn(styles.bCorpLogo, "h-14 md:h-16 lg:h-20 w-auto")}
          />
        </div>

        {/* Floating play reel — touch / mobile devices */}
        <button
          className={cn(
            styles.playReelButton,
            "absolute bottom-24 left-1/2 -translate-x-1/2 z-10",
          )}
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
          aria-label="Play reel"
        >
          <div className={cn(styles.buttonGradientBorder, "rounded-full p-[1.5px]")}>
            <div className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#111111]/92 backdrop-blur-xl">
              <PlayIcon size={18} weight="bold" className="text-[#FF08CC]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/90">
                Play Reel
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Vimeo player modal */}
      <VimeoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        vimeoId={vimeoId}
      />
    </div>
  );
};

export default VideoHero;
