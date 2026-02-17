"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import cn from "classnames";
import styles from "./NewsletterModal.module.css";

interface NewsletterModalProps {
  open: boolean;
  onClose: () => void;
}

const MAILERLITE_URL =
  "https://landing.mailerlite.com/webforms/landing/m7v8v4";

const EXIT_DURATION = 300;

const NewsletterModal: React.FC<NewsletterModalProps> = ({ open, onClose }) => {
  const [closing, setClosing] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const closingRef = useRef(false);

  // Modal stays mounted during exit animation
  const visible = open || closing;

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setIframeLoaded(false);
      closingRef.current = false;
      onClose();
    }, EXIT_DURATION);
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    },
    [handleClose],
  );

  useEffect(() => {
    if (!visible) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("overflow-hidden");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("overflow-hidden");
    };
  }, [visible, handleKeyDown]);

  if (!visible) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl",
        closing ? styles.backdropClosing : styles.backdrop,
      )}
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-end mb-3">
          <button
            className={cn(
              styles.closeButton,
              "flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 hover:text-white cursor-pointer",
            )}
            onClick={handleClose}
            aria-label="Close newsletter signup"
          >
            <span className="text-xs font-semibold uppercase tracking-widest">
              Close
            </span>
            <X size={16} weight="bold" />
          </button>
        </div>

        {/* MailerLite form embed */}
        <div
          className={cn(
            "relative w-full rounded-2xl overflow-hidden",
            closing ? styles.contentClosing : styles.content,
          )}
        >
          {/* Dark placeholder while iframe loads */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-(--background) rounded-2xl">
              <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
            </div>
          )}
          <iframe
            src={MAILERLITE_URL}
            className={cn(
              "w-full border-0 h-[680px]",
              iframeLoaded ? styles.iframeReady : styles.iframeLoading,
            )}
            title="Newsletter signup"
            onLoad={() => setIframeLoaded(true)}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default NewsletterModal;
