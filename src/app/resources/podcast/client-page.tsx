"use client";

import React, { useState } from "react";
import Image from "next/image";
import HeroBanner from "@/components/components/HeroBanner";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import CTABanner from "@/components/components/CTABanner";

/* ─── Data ─────────────────────────────────────────────── */

const LISTEN_PLATFORMS = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/5BFuPMuBbLqKDmq3sGqU3p",
    variant: "primary" as const,
  },
  {
    label: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/podcast/it-shouldnt-be-this-hard/id1711519345",
    variant: "secondary" as const,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@groundedworld",
    variant: "secondary" as const,
  },
];

const GUEST_SCENARIOS = [
  {
    title: "Built It",
    body: "You founded a purpose-driven business, scaled it through the messy middle, and have the scars (and wisdom) to prove it.",
  },
  {
    title: "Pushing for Change",
    body: "You're a corporate change-maker navigating legacy systems, internal politics, and the tension between profit and purpose.",
  },
  {
    title: "Lived It",
    body: "Your personal story demonstrates why this work matters — and the urgency of getting it right.",
  },
];

const inputBase = [
  "w-full px-4 py-3 rounded-xl",
  "bg-white/[0.04] border border-white/[0.08]",
  "text-[color:var(--font-color-primary)]",
  "placeholder:text-[color:var(--font-color-tertiary)]",
  "focus:outline-none focus:border-[color:var(--color-cyan)] focus:ring-1 focus:ring-[color:var(--color-cyan)]",
  "transition-colors duration-200",
  "text-[length:var(--font-size-body-md)]",
].join(" ");

const labelBase =
  "block mb-1.5 text-[length:var(--font-size-body-sm)] font-medium text-[color:var(--font-color-secondary)]";

/* ─── Guest Application Form ────────────────────────────── */

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  linkedIn: string;
}

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  linkedIn: "",
};

function GuestApplicationForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/podcast-guest", {
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

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.06] p-12 text-center">
        <Heading level={3} size="h3" color="primary" className="mb-4">
          Application received!
        </Heading>
        <Text size="body-lg" color="secondary">
          Thanks for putting your hand up. We'll be in touch soon.
        </Text>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 md:p-8"
    >
      {/* Name row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelBase}>First Name</label>
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
          <label className={labelBase}>Last Name</label>
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
        <label className={labelBase}>Email Address</label>
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

      {/* Company */}
      <div>
        <label className={labelBase}>Company</label>
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Acme Corp"
          className={inputBase}
        />
      </div>

      {/* LinkedIn */}
      <div>
        <label className={labelBase}>LinkedIn URL</label>
        <input
          type="url"
          name="linkedIn"
          value={form.linkedIn}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/yourprofile"
          className={inputBase}
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-1">
        <Button
          type="submit"
          variant="primary"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Apply"}
        </Button>
        {status === "error" && (
          <Text size="body-sm" color="secondary">
            Something went wrong. Please try again.
          </Text>
        )}
      </div>
    </form>
  );
}

/* ─── Page ──────────────────────────────────────────────── */

export default function PodcastClientPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroBanner
        backgroundType="canvas"
        title="It Shouldn't Be This Hard"
        subtitle="The podcast for people who know that responsible business is messy, meaningful, and probably much harder than it should be."
        minHeight="condensed"
        overlayOpacity="light"
        contentAlign="center"
      />

      {/* ── About the Podcast ────────────────────────────── */}
      <Section>
        <Container className="px-[var(--layout-section-padding-x)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Cover art */}
            <div className="relative rounded-3xl overflow-hidden aspect-square max-w-md mx-auto lg:mx-0">
              <Image
                src="/images/resources-podcast-cover.jpg"
                alt="It Shouldn't Be This Hard podcast cover"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Description + platform links */}
            <div className="flex flex-col gap-6">
              <Heading level={2} size="h2" color="primary">
                Honest conversations most people avoid
              </Heading>
              <Text size="body-lg" color="secondary" className="leading-relaxed">
                In each episode, Grounded co-founders Heidi Schoeneck and Phil
                White sit down with founders, corporate change-makers,
                sustainability leaders, social entrepreneurs, and thought
                leaders.
              </Text>
              <Text size="body-md" color="secondary" className="leading-relaxed">
                Together they explore impact, climate action, storytelling, and
                the systemic barriers that frustrate real progress — drawing on
                perspectives from behavioral science to spirituality.
              </Text>

              {/* Platform links */}
              <div className="flex flex-wrap gap-4 pt-2">
                {LISTEN_PLATFORMS.map((platform) => (
                  <Button
                    key={platform.label}
                    href={platform.href}
                    variant={platform.variant}
                    target="_blank"
                  >
                    {platform.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Apply to Be a Guest ──────────────────────────── */}
      <Section>
        <Container className="px-[var(--layout-section-padding-x)] max-w-[960px]">
          {/* Heading */}
          <div className="text-center mb-12 md:mb-16">
            <Heading level={2} size="h2" color="primary" className="mb-4">
              Apply to Be a Guest
            </Heading>
            <Text
              size="body-lg"
              color="secondary"
              className="max-w-2xl mx-auto leading-relaxed"
            >
              Maybe you've been there. You took the leap. You built the
              business. You challenged the status quo. And you've got the
              scars — and wisdom — to prove it.
            </Text>
          </div>

          {/* Scenario cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-16">
            {GUEST_SCENARIOS.map((scenario) => (
              <div
                key={scenario.title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8"
              >
                <Heading level={3} size="h4" color="primary" className="mb-3">
                  {scenario.title}
                </Heading>
                <Text size="body-sm" color="secondary" className="leading-relaxed">
                  {scenario.body}
                </Text>
              </div>
            ))}
          </div>

          {/* War stories callout */}
          <Text
            size="body-md"
            color="secondary"
            className="text-center mb-10 leading-relaxed"
          >
            We want your war stories, your wisdom, and your wipe-outs. If that
            sounds like you, we'd love to hear from you.
          </Text>

          {/* Application form */}
          <GuestApplicationForm />
        </Container>
      </Section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <CTABanner
        backgroundSrc="/images/services/banner-bg.jpg"
        heading="It's time to get grounded"
        subtext="Ready to activate your brand purpose and accelerate your impact? Let's talk."
        primaryLabel="Contact Us"
        primaryHref="/contact-us"
        overlayOpacity="heavy"
      />
    </>
  );
}
