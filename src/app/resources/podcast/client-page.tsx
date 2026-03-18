"use client";

import React, { useState } from "react";
import Image from "next/image";
import cn from "classnames";
import { ChatCircleDotsIcon, LightningIcon, LightbulbIcon } from "@phosphor-icons/react";
import Container from "@/components/layout/Container";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import styles from "./podcast.module.css";

// ── Tabs ──
const TABS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "speak", label: "Apply to Speak" },
  { id: "ideas", label: "Share Ideas" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const inputBase = [
  "w-full px-4 py-3 rounded-xl",
  "bg-white/[0.04] border border-white/10",
  "text-[color:var(--font-color-primary)]",
  "placeholder:text-[color:var(--font-color-tertiary)]",
  "focus:outline-none focus:border-[color:var(--color-cyan)] focus:ring-1 focus:ring-[color:var(--color-cyan)]",
  "transition-colors duration-200 text-sm",
].join(" ");

// ── Main ──
export default function PodcastClientPage() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const [form, setForm] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interest: activeTab === "speak" ? "Podcast Guest Application" : "Podcast Topic Suggestion",
          firstName: (form.name || "").split(" ")[0],
          lastName: (form.name || "").split(" ").slice(1).join(" "),
          email: form.email || "",
          message: activeTab === "speak" ? `LinkedIn: ${form.linkedin || "N/A"}` : `Topic: ${form.topic || "N/A"}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setFormStatus("sent");
      setForm({});
    } catch {
      setFormStatus("error");
    }
  };

  const handleTabSwitch = (id: TabId) => {
    setActiveTab(id);
    if (id === "speak" || id === "ideas") { setFormStatus("idle"); setForm({}); }
  };

  return (
    <div className="min-h-screen bg-(--background) text-white">
      {/* ── Skinny Banner ── */}
      <div className={cn("px-[var(--layout-section-padding-x)] pt-[var(--layout-section-padding-x)]", styles.banner)}>
        <div className="relative w-full aspect-[6/1] rounded-2xl overflow-hidden">
          <Image
            src="/images/youtube-banner.jpg"
            alt="It Shouldn't Be This Hard podcast banner"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      <Container className="px-[var(--layout-section-padding-x)]">
        {/* ── Channel Header: circle image + info to the right ── */}
        <div className={cn("flex flex-row gap-4 sm:gap-6 items-center py-4 sm:py-6", styles.header)}>
          <div className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-white/10 shrink-0 relative">
            <Image
              src="/images/phil-heidi-youtube.png"
              alt="Heidi Schoeneck and Phil White"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 64px, 144px"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Heading level={1} size="h4" color="primary" className="mb-0.5 sm:mb-1 sm:!text-[length:var(--font-size-h2)]">
              It Shouldn&rsquo;t Be This Hard
            </Heading>
            <Text size="body-xs" color="tertiary" className="sm:text-sm">
              @itshouldntbethishard &middot; grounded.world
            </Text>
            <Text size="body-sm" color="secondary" className="leading-relaxed max-w-2xl hidden sm:block mt-2">
              The podcast for people who know that responsible business is messy, meaningful, and probably much harder than it should be!
            </Text>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className={cn("flex gap-1 border-b border-[var(--comp-tab-stroke-default)]/20 mb-8 overflow-x-auto", styles.tabs)}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={cn(
                "px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer relative",
                activeTab === tab.id
                  ? "text-[color:var(--comp-tab-text-default)]"
                  : "text-[color:var(--font-color-tertiary)] hover:text-[color:var(--comp-tab-text-default)]",
              )}
            >
              {tab.label}
              <span className={cn(
                "absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--comp-tab-stroke-default)] rounded-full transition-opacity duration-300",
                activeTab === tab.id ? "opacity-100" : "opacity-0",
              )} />
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        <div className="pb-16 md:pb-24" key={activeTab}>
          <div className={styles.tabContent}>

          {/* HOME — like YouTube "Home" tab: featured video + description */}
          {activeTab === "home" && (
            <div>
              {/* Featured video — side by side like YouTube */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-10 mb-12">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
                  <iframe
                    src="https://www.youtube.com/embed/tPaXVOrq_YY?autoplay=1&mute=1&loop=1&playlist=tPaXVOrq_YY&rel=0&modestbranding=1"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Podcast trailer"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <Heading level={2} size="h4" color="primary" className="mb-2">
                    Why Is It So Hard to Do the Right Things?
                  </Heading>
                  <Text size="body-sm" color="tertiary" className="mb-4">
                    Trailer Episode
                  </Text>
                  <Text size="body-md" color="secondary" className="leading-relaxed mb-4">
                    The podcast for people who know that responsible business is messy, meaningful, and probably much harder than it should be!
                  </Text>
                  <Text size="body-md" color="secondary" className="leading-relaxed">
                    In each episode, grounded co-founders, Heidi Schoeneck and Phil White sit down with founders, corporate changemakers, sustainability leaders, social entrepreneurs, and thought leaders who&rsquo;ve been there and are doing it. Our fearless founders will get into the honest conversations most people avoid &mdash; about power, profit, fear, failure, purpose, and the many barriers and obstacles that often frustrate progress.
                  </Text>
                </div>
              </div>

            </div>
          )}

          {/* ABOUT — text with inline icons, no cards */}
          {activeTab === "about" && (
            <div className="max-w-3xl">
              <Heading level={2} size="h3" color="primary" className="mb-4">
                It Shouldn&rsquo;t Be This Hard
              </Heading>
              <Text size="body-lg" color="secondary" className="leading-relaxed mb-6">
                The podcast for people who know that responsible business is messy, meaningful, and probably much harder than it should be!
              </Text>
              <Text size="body-md" color="secondary" className="leading-relaxed mb-6">
                In each episode, grounded co-founders, Heidi Schoeneck and Phil White sit down with founders, corporate changemakers, sustainability leaders, social entrepreneurs, and thought leaders who&rsquo;ve been there and are doing it. Our fearless founders will get into the honest conversations most people avoid &mdash; about power, profit, fear, failure, purpose, and the many barriers and obstacles that often frustrate progress.
              </Text>

              <div className="flex flex-col gap-8">
                {[
                  {
                    icon: ChatCircleDotsIcon,
                    colorClass: "text-[color:var(--color-cyan)]",
                    title: "Honest Conversations",
                    body: "Our fearless founders get into the conversations most people avoid \u2014 about power, profit, fear, failure, purpose, and the many barriers that often frustrate progress.",
                  },
                  {
                    icon: LightningIcon,
                    colorClass: "text-[color:var(--color-gold)]",
                    title: "Uncomfortable Questions",
                    body: "With a little help from Gaia, grounded\u2019s AI sidekick, they will poke at the uncomfortable questions and unpack the messy middle. And to wrap it up?",
                  },
                  {
                    icon: LightbulbIcon,
                    colorClass: "text-[color:var(--color-green)]",
                    title: "Science Meets Spirituality",
                    body: "The show will bubble up insights from behavioral science and spirituality (so we get unique perspectives from both sides of the conscious leadership coin).",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <item.icon size={22} weight="duotone" className={cn("shrink-0 mt-1", item.colorClass)} />
                    <div>
                      <Text size="body-md" color="primary" className="font-semibold mb-1">
                        {item.title}
                      </Text>
                      <Text size="body-md" color="secondary" className="leading-relaxed">
                        {item.body}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPLY TO SPEAK */}
          {activeTab === "speak" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div>
                <Heading level={2} size="h3" color="primary" className="mb-4">
                  Apply to Be a Guest!
                </Heading>
                <Text size="body-md" color="secondary" className="leading-relaxed mb-4">
                  Maybe you&rsquo;ve been there. You took the leap. You built the business. You challenged the status quo. And you&rsquo;ve got the scars (and wisdom) to prove it?
                </Text>
                <Text size="body-md" color="secondary" className="leading-relaxed mb-4">
                  Or you&rsquo;re right in it. Pushing for real change inside a legacy company. Trying to shift systems that don&rsquo;t want to budge. Frustrated by the gap between good intentions and real outcomes.
                </Text>
                <Text size="body-md" color="secondary" className="leading-relaxed mb-4">
                  Or you&rsquo;ve lived it. The consequences. The costs. The personal experiences that make this work urgent and deeply human.
                </Text>
                <Text size="body-md" color="secondary" className="leading-relaxed">
                  If any of this sounds like you &mdash; we want to hear all about your war stories, your wisdom, and your wipe-outs! Just leave your email and LinkedIn profile below and a member of the team will be in touch!
                </Text>
              </div>
              {formStatus === "sent" ? (
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-8 text-center">
                  <Heading level={3} size="h4" color="primary" className="mb-3">Thanks for applying!</Heading>
                  <Text size="body-md" color="secondary">A member of our team will be in touch.</Text>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                  <input type="text" name="name" value={form.name || ""} onChange={handleFormChange} required placeholder="Your Name" className={inputBase} />
                  <input type="email" name="email" value={form.email || ""} onChange={handleFormChange} required placeholder="Email Address" className={inputBase} />
                  <input type="url" name="linkedin" value={form.linkedin || ""} onChange={handleFormChange} placeholder="LinkedIn URL" className={inputBase} />
                  <Button type="submit" variant="primary" disabled={formStatus === "sending"}>
                    {formStatus === "sending" ? "Sending\u2026" : "Apply"}
                  </Button>
                  {formStatus === "error" && <Text size="body-sm" color="secondary">Something went wrong. Please try again.</Text>}
                </form>
              )}
            </div>
          )}

          {/* SHARE IDEAS */}
          {activeTab === "ideas" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div>
                <Heading level={2} size="h3" color="primary" className="mb-4">
                  Suggest a Topic
                </Heading>
                <Text size="body-md" color="secondary" className="leading-relaxed">
                  Got a burning topic you think we should tackle? A question that keeps you up at night? A challenge the industry isn&rsquo;t talking about honestly enough? Drop us your idea and we&rsquo;ll add it to the conversation.
                </Text>
              </div>
              {formStatus === "sent" ? (
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-8 text-center">
                  <Heading level={3} size="h4" color="primary" className="mb-3">Thanks!</Heading>
                  <Text size="body-md" color="secondary">We&rsquo;ll add your topic to the list.</Text>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                  <input type="text" name="name" value={form.name || ""} onChange={handleFormChange} required placeholder="Your Name" className={inputBase} />
                  <input type="email" name="email" value={form.email || ""} onChange={handleFormChange} required placeholder="Email Address" className={inputBase} />
                  <input type="text" name="topic" value={form.topic || ""} onChange={handleFormChange} required placeholder="Topic or Question" className={inputBase} />
                  <Button type="submit" variant="primary" disabled={formStatus === "sending"}>
                    {formStatus === "sending" ? "Sending\u2026" : "Submit"}
                  </Button>
                  {formStatus === "error" && <Text size="body-sm" color="secondary">Something went wrong. Please try again.</Text>}
                </form>
              )}
            </div>
          )}

          </div>
        </div>
      </Container>

    </div>
  );
}
