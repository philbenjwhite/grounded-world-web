"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";
import { LinkedinLogo, EnvelopeSimple, PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react";
import Text from "../../atoms/Text";
import Heading from "../../atoms/Heading";
import NewsletterModal from "../NewsletterModal";
import { resourceLinks } from "../Header/megaMenuData";
import { MAILERLITE_FORM_ID, MAILERLITE_FORM_CODE, loadMailerLiteScript } from "@/lib/mailerlite";
import nlStyles from "../NewsletterCTA/NewsletterCTA.module.css";

export interface FooterProps {
  className?: string;
}

const SERVICE_LINKS = [
  { label: "Discover", href: "/services/discover" },
  { label: "Articulate", href: "/services/articulate" },
  { label: "Activate", href: "/services/activate" },
  { label: "Accelerate", href: "/services/accelerate" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about-us" },
  { label: "Our Work", href: "/our-work" },
  { label: "Ask Gaia", href: "/gaia" },
  { label: "Contact Us", href: "/contact-us" },
];

const footerLinkClass =
  "text-[length:var(--font-size-body-sm)] text-[color:var(--font-color-secondary)] hover:text-[color:var(--font-color-primary)] transition-colors";

const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadMailerLiteScript().catch(() => {});
  }, []);

  useEffect(() => {
    const key = `ml_webform_success_${MAILERLITE_FORM_ID}`;
    (window as unknown as Record<string, unknown>)[key] = () => {
      setSubmitted(true);
    };
    return () => {
      delete (window as unknown as Record<string, unknown>)[key];
    };
  }, []);

  return (
    <>
      <footer
        className={cn(
          "w-full bg-(--comp-body-surface)",
          className,
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          {/* Newsletter CTA */}
          <div className="py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="shrink-0">
              <Heading level={3} size="h4" color="primary">
                Stay Grounded
              </Heading>
              <Text size="body-md" color="secondary" as="p" className="mt-2 max-w-sm">
                Sign up to receive insights, updates, and stories from the front lines of purpose-driven brands.
              </Text>
            </div>

            <div className="w-full max-w-md min-h-14">
              {submitted ? (
                <div className="flex items-center justify-center gap-3 h-14">
                  <CheckCircle size={24} weight="fill" className="text-(--color-cyan)" />
                  <Text size="body-lg" color="primary" className="font-semibold">
                    You&rsquo;re now Grounded!
                  </Text>
                </div>
              ) : (
                <div
                  id={`mlb2-footer-${MAILERLITE_FORM_ID}`}
                  className={cn(
                    "ml-form-embedContainer ml-subscribe-form",
                    `ml-subscribe-form-${MAILERLITE_FORM_ID}`,
                    nlStyles.formEmbed,
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
                          <div className={cn("ml-form-formContent", nlStyles.formRow)}>
                            <div className="ml-form-fieldRow ml-last-item">
                              <div className="ml-field-group ml-field-email ml-validate-email ml-validate-required">
                                <EnvelopeSimple
                                  size={20}
                                  weight="regular"
                                  className={nlStyles.inputIcon}
                                />
                                <input
                                  aria-label="email"
                                  aria-required="true"
                                  type="email"
                                  className={cn("form-control", nlStyles.emailInput)}
                                  data-inputmask=""
                                  name="fields[email]"
                                  placeholder="Enter your email"
                                  autoComplete="email"
                                />
                              </div>
                            </div>
                            <div className="ml-form-embedSubmit">
                              <button type="submit" className={cn("primary", nlStyles.submitButton)}>
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
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Nav columns */}
          <div className="py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
            {/* Logo + B-Corp */}
            <div className="col-span-2 md:col-span-1 flex flex-row md:flex-col items-start justify-between md:justify-start gap-6">
              <Link href="/" aria-label="Grounded World home">
                <Image
                  src="/grounded-logo-light.svg"
                  alt="Grounded World"
                  width={140}
                  height={48}
                  className="h-10 w-auto"
                />
              </Link>
              <Image
                src="/bcorp-logo.svg"
                alt="Certified B Corporation"
                width={56}
                height={56}
                className="h-12 w-auto opacity-50 brightness-[10]"
              />
            </div>

            {/* Services */}
            <nav aria-label="Services">
              <Text
                size="body-xs"
                color="primary"
                as="p"
                className="font-semibold uppercase tracking-wider mb-4"
              >
                Services
              </Text>
              <ul className="flex flex-col gap-2.5">
                {SERVICE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={footerLinkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Resources */}
            <nav aria-label="Resources">
              <Text
                size="body-xs"
                color="primary"
                as="p"
                className="font-semibold uppercase tracking-wider mb-4"
              >
                Resources
              </Text>
              <ul className="flex flex-col gap-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={footerLinkClass}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company */}
            <nav aria-label="Company">
              <Text
                size="body-xs"
                color="primary"
                as="p"
                className="font-semibold uppercase tracking-wider mb-4"
              >
                Company
              </Text>
              <ul className="flex flex-col gap-2.5">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={footerLinkClass}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Bottom bar */}
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <Text size="body-xs" color="tertiary" as="span">
              &copy; {currentYear} Grounded World
            </Text>

            <a
              href="https://www.linkedin.com/company/groundedworld/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--font-color-tertiary)] hover:text-[color:var(--font-color-primary)] transition-colors"
              aria-label="Grounded World on LinkedIn"
            >
              <LinkedinLogo size={20} weight="bold" />
            </a>
          </div>
        </div>
      </footer>

      <NewsletterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default Footer;
