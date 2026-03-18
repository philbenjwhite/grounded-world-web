"use client";

import Image from "next/image";
import Link from "next/link";
import { useTina } from "tinacms/dist/react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import type { TeamMemberQuery } from "../../../../tina/__generated__/types";
import type { RelatedArticleItem } from "@/components/components/RelatedArticles/RelatedArticles";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Split from "@/components/layout/Split";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import RelatedArticles from "@/components/components/RelatedArticles";

interface TeamMemberClientPageProps {
  query: string;
  variables: { relativePath: string };
  data: { teamMember: TeamMemberQuery["teamMember"] };
  articles: RelatedArticleItem[];
  slug: string;
}

export default function TeamMemberClientPage(
  props: TeamMemberClientPageProps,
) {
  const { articles, slug } = props;

  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const member = data.teamMember;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    jobTitle: member.role,
    worksFor: {
      "@type": "Organization",
      name: "Grounded World",
      url: "https://grounded.world",
    },
    url: `https://grounded.world/about-us/${slug}`,
    image: member.photoUrl
      ? `https://grounded.world${member.photoUrl}`
      : undefined,
    sameAs: member.linkedinUrl ? [member.linkedinUrl] : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section>
        <Container className="px-[var(--layout-section-padding-x)] max-w-[1200px]">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              href="/about-us"
              className="inline-flex items-center gap-2 text-sm text-[color:var(--font-color-tertiary)] border border-white/10 rounded-full px-4 py-1.5 hover:border-[var(--color-cyan)] hover:text-[color:var(--color-cyan)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              About Us
            </Link>
          </nav>

          {/* Profile layout */}
          <Split
            left={
              <div className="flex flex-col items-center gap-6">
                {member.photoUrl ? (
                  <div className="relative w-full max-w-[300px] aspect-square overflow-hidden rounded-2xl">
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      priority
                      sizes="(max-width: 768px) 280px, 300px"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-[300px] aspect-[3/4] rounded-2xl bg-[var(--color-cyan)]/10 flex items-center justify-center">
                    <span className="text-6xl font-bold text-[color:var(--color-cyan)]">
                      {member.name
                        .split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                )}

                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-cyan)] hover:text-white transition-colors"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    Connect on LinkedIn
                  </a>
                )}
              </div>
            }
            right={
              <div>
                <Heading
                  level={1}
                  size="h1"
                  color="primary"
                  className="mb-2"
                >
                  {member.name}
                </Heading>
                <Text
                  size="body-lg"
                  color="tertiary"
                  className="mb-8 font-medium"
                >
                  {member.role}
                </Text>

                {member.bio && (
                  <div className="prose prose-invert prose-lg max-w-none prose-headings:text-[color:var(--font-color-primary)] prose-p:text-[color:var(--font-color-secondary)] prose-a:text-[color:var(--color-cyan)] prose-strong:text-[color:var(--font-color-primary)]">
                    {typeof member.bio === "string" ? (
                      <Text size="body-md" color="secondary">
                        {member.bio}
                      </Text>
                    ) : (
                      <TinaMarkdown content={member.bio} />
                    )}
                  </div>
                )}
              </div>
            }
            ratio="30/70"
            gap="lg"
            align="start"
            reverseOnMobile
          />
        </Container>
      </Section>

      {/* Articles by this team member */}
      {articles.length > 0 && (
        <Section>
          <Container className="px-[var(--layout-section-padding-x)]">
            <RelatedArticles
              articles={articles}
              heading={`Articles by ${member.name}`}
            />
          </Container>
        </Section>
      )}

    </>
  );
}
