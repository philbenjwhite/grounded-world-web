"use client";

import React, { useState, useEffect } from "react";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { EnvelopeSimple, PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import { MAILERLITE_FORM_ID, MAILERLITE_FORM_CODE, loadMailerLiteScript } from "@/lib/mailerlite";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import styles from "./NewsletterCTA.module.css";

export interface NewsletterCTAProps {
  /** Background image URL/path */
  backgroundSrc: string;
  /** Alt text for background image */
  backgroundAlt?: string;
  /** Main headline */
  heading?: string;
  /** Supporting text below the heading */
  subtext?: string;
  /** Dark overlay intensity */
  overlayOpacity?: "light" | "medium" | "heavy";
  /** Optional className */
  className?: string;
  /** When set, renders a split with a booking CTA on the left */
  bookingEyebrow?: string;
  bookingHeading?: string;
  bookingSubtext?: string;
  bookingLabel?: string;
  bookingHref?: string;
}

const overlayClasses: Record<string, string> = {
  light: "bg-black/40",
  medium: "bg-black/55",
  heavy: "bg-black/70",
};

const NewsletterCTA: React.FC<NewsletterCTAProps> = ({
  backgroundSrc,
  backgroundAlt = "",
  heading = "Stay Grounded",
  subtext = "Sign up to receive insights, updates, and stories from the front lines of purpose-driven brands.",
  overlayOpacity = "heavy",
  className,
  bookingEyebrow,
  bookingHeading,
  bookingSubtext,
  bookingLabel,
  bookingHref,
}) => {
  const isSplit = !!(bookingHref && bookingLabel);
  const ref = useScrollReveal<HTMLElement>(0.15);
  const [submitted, setSubmitted] = useState(false);

  // Load MailerLite script on mount
  useEffect(() => {
    loadMailerLiteScript().catch(() => {
      // Fallback: form still works via normal POST
    });
  }, []);

  // Watch for MailerLite success callback
  useEffect(() => {
    (window as unknown as Record<string, unknown>)[`ml_webform_success_${MAILERLITE_FORM_ID}`] = () => {
      setSubmitted(true);
    };
    return () => {
      delete (window as unknown as Record<string, unknown>)[`ml_webform_success_${MAILERLITE_FORM_ID}`];
    };
  }, []);

  const newsletterContent = (
    <>
      {!isSplit && (
        <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-sm">
          <EnvelopeSimple size={28} weight="duotone" className="text-(--color-cyan)" />
        </div>
      )}
      <Heading level={isSplit ? 3 : 2} size={isSplit ? "h3" : "h2"} color="primary" className={isSplit ? "text-left" : ""}>
        {heading}
      </Heading>
      {subtext && (
        <Text size={isSplit ? "body-md" : "body-lg"} color="secondary" className={cn("leading-relaxed", isSplit ? "mt-3 text-left" : "mt-4 max-w-xl")}>
          {subtext}
        </Text>
      )}
      <div className={cn("mt-8 md:mt-10 w-full min-h-14", isSplit ? "" : "max-w-md")}>
        {submitted ? (
          <div className="flex items-center justify-center gap-3 h-14">
            <CheckCircle size={24} weight="fill" className="text-(--color-cyan)" />
            <Text size="body-lg" color="primary" className="font-semibold">
              You&rsquo;re now Grounded!
            </Text>
          </div>
        ) : (
          <div
            id={`mlb2-${MAILERLITE_FORM_ID}`}
            className={cn(
              "ml-form-embedContainer ml-subscribe-form",
              `ml-subscribe-form-${MAILERLITE_FORM_ID}`,
              styles.formEmbed,
            )}
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
                    <div className={cn("ml-form-formContent", styles.formRow)}>
                      <div className="ml-form-fieldRow ml-last-item">
                        <div className="ml-field-group ml-field-email ml-validate-email ml-validate-required">
                          <EnvelopeSimple size={20} weight="regular" className={styles.inputIcon} />
                          <input
                            aria-label="email"
                            aria-required="true"
                            type="email"
                            className={cn("form-control", styles.emailInput)}
                            data-inputmask=""
                            name="fields[email]"
                            placeholder="Enter your email"
                            autoComplete="email"
                          />
                        </div>
                      </div>
                      <div className="ml-form-embedSubmit">
                        <button type="submit" className={cn("primary", styles.submitButton)}>
                          Subscribe
                          <PaperPlaneTilt size={16} weight="bold" />
                        </button>
                        <button disabled style={{ display: "none" }} type="button" className="loading">
                          <div className="ml-form-embedSubmitLoad" />
                          <span className="sr-only">Loading...</span>
                        </button>
                      </div>
                    </div>
                    <input type="hidden" name="ml-submit" value="1" />
                    <input type="hidden" name="anticsrf" value="true" />
                  </form>
                </div>
                <div className="ml-form-successBody row-success" style={{ display: "none" }}>
                  <div className="ml-form-successContent"><h4>Thank you!</h4></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Text size="body-sm" color="tertiary" className="mt-3 opacity-60">
          No spam, ever. Unsubscribe anytime.
        </Text>
      </div>
    </>
  );

  return (
    <section
      ref={ref}
      className={cn("reveal-fade px-4 md:px-6 lg:px-8 pb-16 md:pb-24", className)}
    >
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundSrc}
            alt={backgroundAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1280px"
          />
        </div>
        {/* Dark overlay */}
        <div className={cn("absolute inset-0 z-10", overlayClasses[overlayOpacity])} />

        {isSplit ? (
          /* ── 60/40 split: booking left (primary), newsletter right (secondary) ── */
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-[3fr_2fr] items-start min-h-[40vh]">
            {/* Booking CTA — primary */}
            <div className="relative flex flex-col justify-start px-12 py-16 md:py-20 lg:border-r lg:border-white/10">
              <div className="absolute inset-0 bg-[var(--color-magenta)]/5 pointer-events-none" />
              <div className="relative">
                {bookingEyebrow && (
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-magenta)]">
                    {bookingEyebrow}
                  </p>
                )}
                <Heading level={3} size="h3" color="primary" className="text-left">
                  {bookingHeading ?? "Discovery Call"}
                </Heading>
                {bookingSubtext && (
                  <Text size="body-md" color="secondary" className="mt-3 max-w-lg leading-relaxed text-left">
                    {bookingSubtext.split("Ask Gaia").map((part, i, arr) =>
                      i < arr.length - 1 ? (
                        <span key={i}>
                          {part}
                          <Link href="/gaia" className="text-[var(--color-cyan)] hover:underline font-medium">Ask Gaia</Link>
                        </span>
                      ) : part
                    )}
                  </Text>
                )}
                <div className="mt-6 flex justify-start">
                  <a
                    href={bookingHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-[var(--color-magenta)] text-white hover:opacity-90 transition-opacity"
                  >
                    {bookingLabel}
                  </a>
                </div>
              </div>
            </div>

            {/* Newsletter — secondary */}
            <div className="flex flex-col justify-start px-8 py-16 md:py-20 border-t border-white/10 lg:border-t-0">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
                Not Quite Ready?
              </p>
              {newsletterContent}
            </div>
          </div>
        ) : (
          /* ── Centered (original layout) ── */
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 lg:py-32 min-h-[40vh] md:min-h-[50vh]">
            {newsletterContent}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsletterCTA;
