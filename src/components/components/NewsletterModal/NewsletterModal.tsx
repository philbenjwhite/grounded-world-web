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

const MAILERLITE_FORM_ID = "6122054";
const MAILERLITE_FORM_CODE = "u8g2z9";
const MAILERLITE_SCRIPT_URL =
  "https://static.mailerlite.com/js/w/webforms.min.js?vd4de52e171e8eb9c47c0c20caf367ddf";

const EXIT_DURATION = 300;

function loadMailerLiteScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${MAILERLITE_SCRIPT_URL}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = MAILERLITE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load MailerLite script"));
    document.body.appendChild(script);
  });
}

const NewsletterModal: React.FC<NewsletterModalProps> = ({ open, onClose }) => {
  const [closing, setClosing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const closingRef = useRef(false);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const visible = open || closing;

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
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

  // Load MailerLite script when modal opens
  useEffect(() => {
    if (!open) return;
    loadMailerLiteScript()
      .then(() => setScriptLoaded(true))
      .catch(() => {
        // Fallback: form still works via normal POST
        setScriptLoaded(true);
      });
  }, [open]);

  // Reset state when reopened
  useEffect(() => {
    if (open) {
      setSubmitted(false);
    }
  }, [open]);

  // Watch for MailerLite success callback
  useEffect(() => {
    if (!open) return;
    // MailerLite calls this function on successful submission
    (window as unknown as Record<string, unknown>)[`ml_webform_success_${MAILERLITE_FORM_ID}`] = () => {
      setSubmitted(true);
    };
    return () => {
      delete (window as unknown as Record<string, unknown>)[`ml_webform_success_${MAILERLITE_FORM_ID}`];
    };
  }, [open]);

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
        className="relative w-full max-w-md mx-4"
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

        {/* Form card */}
        <div
          className={cn(
            "relative w-full rounded-2xl overflow-hidden bg-(--surface-primary) border border-white/8 p-8",
            closing ? styles.contentClosing : styles.content,
          )}
          ref={formContainerRef}
        >
          {submitted ? (
            /* ── Success state ── */
            <div className="text-center py-4">
              <div className="text-4xl mb-4">&#10003;</div>
              <h3 className="text-xl font-bold text-(--font-color-primary) mb-2">
                You&rsquo;re now Grounded
              </h3>
              <p className="text-(--font-color-secondary) text-sm leading-relaxed">
                We&rsquo;ll deliver inspiration and updates straight to your inbox.
              </p>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <h3 className="text-xl font-bold text-(--font-color-primary) mb-2">
                Stay Grounded
              </h3>
              <p className="text-sm text-(--font-color-secondary) mb-6 leading-relaxed">
                Subscribe for insights on brand purpose, sustainability, and social impact.
              </p>

              <div
                id={`mlb2-${MAILERLITE_FORM_ID}`}
                className={cn("ml-form-embedContainer ml-subscribe-form", `ml-subscribe-form-${MAILERLITE_FORM_ID}`, styles.formEmbed)}
              >
                <div className="ml-form-align-center">
                  <div className="ml-form-embedWrapper embedForm">
                    <div className="ml-form-embedBody ml-form-embedBodyDefault row-form">
                      <div className="ml-form-embedContent" style={{ marginBottom: 0 }} />
                      <form
                        className="ml-block-form"
                        action={`https://static.mailerlite.com/webforms/submit/${MAILERLITE_FORM_CODE}`}
                        data-code={MAILERLITE_FORM_CODE}
                        method="post"
                        target="_blank"
                      >
                        <div className="ml-form-formContent">
                          <div className="ml-form-fieldRow ml-last-item">
                            <div className="ml-field-group ml-field-email ml-validate-email ml-validate-required">
                              <input
                                aria-label="email"
                                aria-required="true"
                                type="email"
                                className={cn("form-control", styles.emailInput)}
                                data-inputmask=""
                                name="fields[email]"
                                placeholder="Your email address"
                                autoComplete="email"
                              />
                            </div>
                          </div>
                        </div>
                        <input type="hidden" name="ml-submit" value="1" />
                        <div className="ml-form-embedSubmit">
                          <button type="submit" className={cn("primary", styles.submitButton)}>
                            Subscribe
                          </button>
                          <button
                            disabled
                            style={{ display: "none" }}
                            type="button"
                            className="loading"
                          >
                            <div className="ml-form-embedSubmitLoad" />
                            <span className="sr-only">Loading...</span>
                          </button>
                        </div>
                        <input type="hidden" name="anticsrf" value="true" />
                      </form>
                    </div>
                    <div className="ml-form-successBody row-success" style={{ display: "none" }}>
                      <div className="ml-form-successContent">
                        <h4>Thank you!</h4>
                        <p>You&rsquo;re now Grounded.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loading indicator before script is ready */}
              {!scriptLoaded && (
                <div className="flex justify-center py-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default NewsletterModal;
