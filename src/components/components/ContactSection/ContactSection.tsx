"use client";

import React, { useState } from "react";
import cn from "classnames";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import Split from "../../layout/Split";
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

interface FormState {
  interest: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  message: string;
}

const DEFAULT_INTEREST_OPTIONS = [
  "Culture, Category, Competitor & Consumer Assessments",
  "Intent-to-Action Gap Research & Analysis",
  "Good Growth Drivers & Go-to-Market Strategy",
  "Corporate, Brand & Social Purpose",
  "Sustainability Strategy, Marketing & Storytelling",
  "Brand Positioning, Architecture & Archetyping",
  "Brand Identity, Packaging & Design",
  "Campaigns, Events, Experiences & Stakeholder Engagement",
  "Retail Activation & Omnichannel Toolkits",
  "Sustainability & Impact Reporting",
  "Commercial & Non-Profit Partnerships",
  "Collaboration Training, Action Labs & Speaking Engagements",
  "Something Else",
];

const INITIAL_FORM: FormState = {
  interest: "",
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  jobTitle: "",
  message: "",
};

const inputBase = [
  "w-full px-4 py-3 rounded-xl",
  "bg-white/[0.04] border border-white/[0.08]",
  "text-[color:var(--font-color-primary)]",
  "placeholder:text-[color:var(--font-color-tertiary)]",
  "focus:outline-none focus:border-[color:var(--color-cyan)] focus:ring-1 focus:ring-[color:var(--color-cyan)]",
  "transition-colors duration-200",
  "text-[length:var(--font-size-body-md)]",
].join(" ");

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
  const resolvedDescription = description ?? contactConfig?.description ?? "For a specific request, submit a contact form. A member of the team will get back to you within 24 hours.";
  const resolvedBookingLabel = bookingLabel ?? contactConfig?.bookingLabel ?? "Book a Discovery Call";
  const resolvedEmail = email ?? contactConfig?.email ?? "getgrounded@grounded.world";
  const resolvedEyebrow = contactConfig?.eyebrow ?? "Get In Touch";
  const interestOptions = contactConfig?.interestOptions ?? DEFAULT_INTEREST_OPTIONS;
  const successHeading = contactConfig?.successHeading ?? "Thanks for reaching out!";
  const successMessage = contactConfig?.successMessage ?? "A member of our team will get back to you within 24 hours.";
  const submitLabel = contactConfig?.submitLabel ?? "Send Message";
  const sendingLabel = contactConfig?.sendingLabel ?? "Sending\u2026";
  const errorMessage = contactConfig?.errorMessage ?? "Something went wrong. Please try again.";
  const emailContextText = contactConfig?.emailContextText ?? "For any other questions, media enquiries or if you\u2019re interested in joining the team, email us at {email}";

  const sectionRef = useScrollReveal(0.1);
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("sent");
      setForm(INITIAL_FORM);
    } catch {
      setStatus("error");
    }
  };

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
        <div ref={sectionRef} className="reveal-fade">
          <Split
            ratio="40/60"
            gap="xl"
            align="start"
            left={
              <div className="lg:sticky lg:top-32 mb-10 lg:mb-0">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[color:var(--color-gray-4)] mb-4">
                  {resolvedEyebrow}
                </p>
                <Heading level={2} size="h2" color="primary" className="mb-6">
                  {resolvedHeading}
                </Heading>
                <Text size="body-lg" color="secondary" className="mb-8">
                  {resolvedDescription}
                </Text>
                {bookingUrl && (
                  <Button href={bookingUrl} target="_blank" variant="primary">
                    {resolvedBookingLabel}
                  </Button>
                )}
                <Text
                  size="body-sm"
                  color="tertiary"
                  className="mt-6"
                >
                  {renderEmailContext()}
                </Text>
              </div>
            }
            right={
              status === "sent" ? (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06] p-12 text-center min-h-[400px]">
                  <Heading level={3} size="h3" color="primary" className="mb-4">
                    {successHeading}
                  </Heading>
                  <Text size="body-lg" color="secondary">
                    {successMessage}
                  </Text>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 md:p-8"
                >
                  {/* Interest */}
                  <div>
                    <label className="block mb-1.5 text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--font-color-secondary)]">
                      What are you interested in?
                    </label>
                    <select
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      required
                      className={cn(inputBase, "appearance-none cursor-pointer")}
                    >
                      <option value="" disabled>
                        Select a topic...
                      </option>
                      {interestOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#151515]">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block mb-1.5 text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--font-color-secondary)]">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Jane"
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--font-color-secondary)]">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Doe"
                        className={inputBase}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-1.5 text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--font-color-secondary)]">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="jane@company.com"
                      className={inputBase}
                    />
                  </div>

                  {/* Company + Job Title row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block mb-1.5 text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--font-color-secondary)]">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Acme Corp"
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--font-color-secondary)]">
                        Job Title
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={form.jobTitle}
                        onChange={handleChange}
                        placeholder="Marketing Director"
                        className={inputBase}
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block mb-1.5 text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--font-color-secondary)]">
                      What can we do for you?
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Tell us about your project or challenge..."
                      className={cn(inputBase, "min-h-[120px] resize-y")}
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex items-center gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? sendingLabel : submitLabel}
                    </Button>
                    {status === "error" && (
                      <Text size="body-sm" color="secondary">
                        {errorMessage}
                      </Text>
                    )}
                  </div>
                </form>
              )
            }
          />
        </div>
      </Container>
    </Section>
  );
};

export default ContactSection;
