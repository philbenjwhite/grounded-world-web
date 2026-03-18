"use client";

import React, { useState } from "react";
import cn from "classnames";
import Section from "../../layout/Section";
import Container from "../../layout/Container";
import Heading from "../../atoms/Heading";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";

interface PodcastApplySectionProps {
  heading?: string;
  description?: string;
}

const inputBase = [
  "w-full px-4 py-3 rounded-xl",
  "bg-white/[0.04] border border-white/10",
  "text-[color:var(--font-color-primary)]",
  "placeholder:text-[color:var(--font-color-tertiary)]",
  "focus:outline-none focus:border-[color:var(--color-cyan)] focus:ring-1 focus:ring-[color:var(--color-cyan)]",
  "transition-colors duration-200 text-sm",
].join(" ");

const TABS = [
  {
    id: "apply",
    label: "Apply to Speak",
    heading: "Apply to Be a Guest!",
    description:
      "Maybe you\u2019ve been there. You took the leap. You built the business. You challenged the status quo. And you\u2019ve got the scars (and wisdom) to prove it. Or you\u2019re right in it \u2014 pushing for real change inside a legacy company. If any of this sounds like you, we want to hear your story!",
    fields: [
      { name: "name", type: "text", placeholder: "Your Name", required: true },
      { name: "email", type: "email", placeholder: "Email Address", required: true },
      { name: "linkedin", type: "url", placeholder: "LinkedIn URL", required: false },
    ],
    submitLabel: "Apply",
  },
  {
    id: "topics",
    label: "Share Topics",
    heading: "Suggest a Topic",
    description:
      "Got a burning topic you think we should tackle? A question that keeps you up at night? A challenge the industry isn\u2019t talking about honestly enough? Drop us your idea and we\u2019ll add it to the conversation.",
    fields: [
      { name: "name", type: "text", placeholder: "Your Name", required: true },
      { name: "email", type: "email", placeholder: "Email Address", required: true },
      { name: "topic", type: "text", placeholder: "Topic or Question", required: true },
    ],
    submitLabel: "Submit",
  },
] as const;

const PodcastApplySection: React.FC<PodcastApplySectionProps> = ({
  heading = "Get Involved",
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const tab = TABS[activeTab];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interest: tab.id === "apply" ? "Podcast Guest Application" : "Podcast Topic Suggestion",
          firstName: (form.name || "").split(" ")[0],
          lastName: (form.name || "").split(" ").slice(1).join(" "),
          email: form.email || "",
          message: tab.id === "apply"
            ? `LinkedIn: ${form.linkedin || "N/A"}`
            : `Topic: ${form.topic || "N/A"}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setForm({});
    } catch {
      setStatus("error");
    }
  };

  const handleTabSwitch = (idx: number) => {
    setActiveTab(idx);
    setStatus("idle");
    setForm({});
  };

  return (
    <Section>
      <Container className="px-[var(--layout-section-padding-x)]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => handleTabSwitch(i)}
                className={cn(
                  "flex-1 px-6 py-4 text-sm font-semibold transition-colors cursor-pointer",
                  i === activeTab
                    ? "text-white bg-white/[0.04] border-b-2 border-[var(--color-cyan)]"
                    : "text-[color:var(--font-color-tertiary)] hover:text-white hover:bg-white/[0.02]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left — copy */}
              <div>
                <Heading level={2} size="h3" color="primary" className="mb-4">
                  {tab.heading}
                </Heading>
                <Text size="body-md" color="secondary" className="leading-relaxed">
                  {tab.description}
                </Text>
              </div>

              {/* Right — form */}
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] p-8 text-center">
                  <Heading level={3} size="h4" color="primary" className="mb-3">
                    Thanks!
                  </Heading>
                  <Text size="body-md" color="secondary">
                    {tab.id === "apply"
                      ? "A member of our team will be in touch."
                      : "We\u2019ll add your topic to the list!"}
                  </Text>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {tab.fields.map((field) => (
                    <input
                      key={field.name}
                      type={field.type}
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      placeholder={field.placeholder}
                      className={inputBase}
                    />
                  ))}
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending\u2026" : tab.submitLabel}
                  </Button>
                  {status === "error" && (
                    <Text size="body-sm" color="secondary">
                      Something went wrong. Please try again.
                    </Text>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default PodcastApplySection;
