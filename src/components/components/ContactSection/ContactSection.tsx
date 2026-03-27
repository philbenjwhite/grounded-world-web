"use client";

import React from "react";
import cn from "classnames";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useGlobalSettings } from "@/lib/GlobalSettingsContext";

/* ─── Types ──────────────────────────────────────────── */

export interface ContactSectionProps {
  /** Section heading */
  heading?: string;
  /** Section description text */
  description?: string;
  /** Calendly or booking URL */
  bookingUrl?: string;
  /** Booking CTA label */
  bookingLabel?: string;
  /** Email address for fallback contact */
  email?: string;
  /** Optional className */
  className?: string;
}

/* ─── Component ──────────────────────────────────────── */

const ContactSection: React.FC<ContactSectionProps> = ({
  heading,
  description,
  bookingUrl,
  bookingLabel,
  email,
  className,
}) => {
  const global = useGlobalSettings();
  const contactConfig = global?.contactForm;

  const resolvedHeading = heading ?? contactConfig?.heading ?? "Let\u2019s Talk";
  const resolvedDescription =
    description ??
    contactConfig?.description ??
    "For a specific request, submit a contact form. A member of the team will get back to you within 24 hours.";
  const resolvedBookingLabel =
    bookingLabel ?? contactConfig?.bookingLabel ?? "Book a Discovery Call";
  const resolvedEmail =
    email ?? contactConfig?.email ?? "getgrounded@grounded.world";
  const resolvedEyebrow = contactConfig?.eyebrow ?? "Get In Touch";
  const emailContextText =
    contactConfig?.emailContextText ??
    "For any other questions, media enquiries or if you\u2019re interested in joining the team, email us at {email}";
  const textWrapBalance = contactConfig?.textWrapBalance ?? false;

  const sectionRef = useScrollReveal(0.1);

  /* Render email context text with {email} placeholder replaced by a mailto link */
  const renderEmailContext = () => {
    const parts = emailContextText.split("{email}");
    return (
      <>
        {parts[0]}
        <a
          href={`mailto:${resolvedEmail}`}
          className="text-[color:var(--font-color-link)] hover:underline"
        >
          {resolvedEmail}
        </a>
        {parts.slice(1).join("{email}")}
      </>
    );
  };

  return (
    <Section className={cn("!py-16 md:!py-24 lg:!py-32", className)}>
      <Container className="px-[var(--layout-section-padding-x)]">
        <div
          ref={sectionRef}
          className="reveal-fade max-w-2xl mx-auto text-center"
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[color:var(--color-gray-4)] mb-4">
            {resolvedEyebrow}
          </p>
          <Heading level={2} size="h2" color="primary" className="mb-6">
            {resolvedHeading}
          </Heading>
          <Text size="body-lg" color="secondary" className={cn("mb-10", textWrapBalance && "text-balance")}>
            {resolvedDescription}
          </Text>
          {bookingUrl && (
            <Button href={bookingUrl} target="_blank" variant="primary">
              {resolvedBookingLabel}
            </Button>
          )}
          <Text size="body-sm" color="tertiary" className={cn("mt-8", textWrapBalance && "text-balance")}>
            {renderEmailContext()}
          </Text>
        </div>
      </Container>
    </Section>
  );
};

export default ContactSection;
