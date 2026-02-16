"use client";

import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@phosphor-icons/react";
import cn from "classnames";
import styles from "./VideoHero.module.css";

interface VimeoModalProps {
  open: boolean;
  onClose: () => void;
  vimeoId: string;
}

const VimeoModal: React.FC<VimeoModalProps> = ({ open, onClose, vimeoId }) => {
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
      className={cn(
        styles.modalBackdrop,
        "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl",
      )}
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Close button above video */}
        <div className="flex justify-end mb-3">
          <button
            className={cn(
              styles.modalClose,
              "flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white cursor-pointer",
            )}
            onClick={onClose}
            aria-label="Close video"
          >
            <span className="text-xs font-semibold uppercase tracking-widest">
              Close
            </span>
            <XIcon size={16} weight="bold" />
          </button>
        </div>

        {/* Video */}
        <div className={cn(styles.modalContent, "relative w-full aspect-video")}>
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
            className="absolute inset-0 w-full h-full rounded-xl"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Video player"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default VimeoModal;
