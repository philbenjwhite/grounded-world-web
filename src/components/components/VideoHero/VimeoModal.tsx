"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
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
  const cursorRef = useRef<HTMLDivElement>(null);
  const [overVideo, setOverVideo] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cursorRef.current) return;
    cursorRef.current.style.left = `${e.clientX}px`;
    cursorRef.current.style.top = `${e.clientY}px`;
  }, []);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("overflow-hidden");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("overflow-hidden");
      setOverVideo(false);
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    <div
      className={cn(
        styles.modalBackdrop,
        "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl cursor-none",
      )}
      onClick={onClose}
      onMouseMove={handleMouseMove}
    >
      {/* Custom close cursor — hidden when over the video */}
      <div
        ref={cursorRef}
        className={cn(
          styles.closeCursor,
          "pointer-events-none fixed z-[60]",
        )}
        data-hidden={overVideo ? "" : undefined}
      >
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center gap-0.5">
          <XIcon size={18} weight="bold" className="text-white" />
          <span className="text-[8px] font-semibold uppercase tracking-widest text-white/70">
            Close
          </span>
        </div>
      </div>

      <button
        className={cn(
          styles.modalClose,
          "absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/70 hover:text-white z-10 cursor-none",
        )}
        onClick={onClose}
        aria-label="Close video"
      >
        <XIcon size={18} weight="bold" />
      </button>
      <div
        className={cn(
          styles.modalContent,
          "relative w-full max-w-5xl aspect-video mx-4 cursor-default",
        )}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setOverVideo(true)}
        onMouseLeave={() => setOverVideo(false)}
      >
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
          className="absolute inset-0 w-full h-full rounded-xl"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Video player"
        />
      </div>
    </div>,
    document.body,
  );
};

export default VimeoModal;
