"use client";

import React, { useState, useEffect } from "react";
import cn from "classnames";
import Image from "next/image";
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
}) => {
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

  return (
    <section
      ref={ref}
      className={cn(
        "reveal-fade px-4 md:px-6 lg:px-8 pb-16 md:pb-24",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-3xl min-h-[40vh] md:min-h-[50vh]">
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
        <div
          className={cn(
            "absolute inset-0 z-10",
            overlayClasses[overlayOpacity],
          )}
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 lg:py-32 min-h-[40vh] md:min-h-[50vh]">
          {/* Envelope icon */}
          <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-sm">
            <EnvelopeSimple
              size={28}
              weight="duotone"
              className="text-(--color-cyan)"
            />
          </div>

          <Heading level={2} size="h2" color="primary">
            {heading}
          </Heading>

          {subtext && (
            <Text
              size="body-lg"
              color="secondary"
              className="mt-4 max-w-xl leading-relaxed"
            >
              {subtext}
            </Text>
          )}

          {/* Inline MailerLite form */}
          <div className="mt-8 md:mt-10 w-full max-w-md">
            {submitted ? (
              <div className="flex items-center justify-center gap-3 py-4">
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
                              <EnvelopeSimple
                                size={20}
                                weight="regular"
                                className={styles.inputIcon}
                              />
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
                        </div>
                        <input type="hidden" name="ml-submit" value="1" />
                        <input type="hidden" name="anticsrf" value="true" />
                      </form>
                    </div>
                    <div className="ml-form-successBody row-success" style={{ display: "none" }}>
                      <div className="ml-form-successContent">
                        <h4>Thank you!</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Text
              size="body-sm"
              color="tertiary"
              className="mt-3 opacity-60"
            >
              No spam, ever. Unsubscribe anytime.
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
