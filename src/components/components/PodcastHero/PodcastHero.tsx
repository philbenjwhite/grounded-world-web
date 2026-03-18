"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { PlayIcon, XIcon } from "@phosphor-icons/react";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";

interface PodcastHeroProps {
  label?: string;
  title: string;
  subtitle?: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  youtubeId: string;
}

function VideoModal({
  open,
  onClose,
  youtubeId,
}: {
  open: boolean;
  onClose: () => void;
  youtubeId: string;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("overflow-hidden");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("overflow-hidden");
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 border border-white/10 px-4 py-2 text-white/70 hover:text-white backdrop-blur-sm flex items-center gap-2 text-sm cursor-pointer transition-colors"
      >
        <XIcon size={16} weight="bold" />
        Close
      </button>
      <div
        className="relative w-[90vw] max-w-5xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          className="w-full h-full rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Podcast trailer"
        />
      </div>
    </div>,
    document.body,
  );
}

const PodcastHero: React.FC<PodcastHeroProps> = ({
  label = "Podcast",
  title,
  subtitle,
  thumbnailSrc,
  thumbnailAlt = "",
  youtubeId,
}) => {
  // Use YouTube's max-res thumbnail if no custom thumbnail provided
  const imageSrc = thumbnailSrc || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="p-4 md:p-6">
        <button
          onClick={() => setModalOpen(true)}
          className="group relative w-full aspect-[21/9] md:aspect-[2.4/1] rounded-3xl overflow-hidden cursor-pointer text-left"
        >
          {/* Background image */}
          <Image
            src={imageSrc}
            alt={thumbnailAlt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="100vw"
            priority
          />

          {/* Gradient overlays — heavy bottom + colored tint */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(77,217,255,0.08)] via-transparent to-[rgba(255,32,221,0.08)]" />

          {/* Center play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
              <PlayIcon size={32} weight="fill" className="text-white ml-1" />
            </div>
          </div>

          {/* Bottom-left content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 lg:p-12">
            <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[color:var(--color-cyan)] mb-3">
              {label}
            </span>
            <Heading level={1} size="h1" color="primary" className="mb-2 md:mb-3 max-w-2xl">
              {title}
            </Heading>
            {subtitle && (
              <Text size="body-md" color="secondary" className="max-w-xl leading-relaxed">
                {subtitle}
              </Text>
            )}
          </div>

          {/* Top-right badge */}
          <div className="absolute top-5 right-5 md:top-8 md:right-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 flex items-center gap-2">
            <PlayIcon size={14} weight="fill" className="text-white" />
            <span className="text-xs font-medium text-white">Watch Trailer</span>
          </div>
        </button>
      </div>

      <VideoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        youtubeId={youtubeId}
      />
    </>
  );
};

export default PodcastHero;
