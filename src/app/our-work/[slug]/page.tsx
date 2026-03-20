import Link from "next/link";
import { notFound } from "next/navigation";
import client from "../../../../tina/server-client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Button from "@/components/atoms/Button";
import RelatedWorkCarousel from "./related-work-carousel";
import styles from "./page.module.css";

interface WorkPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const response = await client.queries.workConnection();
    return (
      response.data.workConnection.edges?.map((edge) => ({
        slug: edge?.node?._sys.filename,
      })) || []
    );
  } catch {
    return [];
  }
}

export interface RelatedWorkItem {
  slug: string;
  title: string;
  client: string;
  featuredImage?: string;
}

// Cache work list at module level so it's fetched once during build
let cachedWorkList: { slug: string; title: string; client: string; featuredImage?: string; tags?: (string | null)[] }[] | null = null;

async function getAllWork() {
  if (cachedWorkList) return cachedWorkList;
  try {
    const response = await client.queries.workConnection({
      sort: "date",
      first: 100,
    });
    cachedWorkList = (response.data.workConnection.edges ?? [])
      .map((edge) => edge?.node)
      .filter(Boolean)
      .map((node) => ({
        slug: node!._sys.filename,
        title: node!.title,
        client: node!.client,
        featuredImage: node!.featuredImage ?? undefined,
        tags: node!.tags ?? undefined,
      }));
    return cachedWorkList;
  } catch {
    return [];
  }
}

async function getRelatedWork(currentSlug: string, currentTags?: (string | null)[]): Promise<RelatedWorkItem[]> {
  const allWork = (await getAllWork()).filter((w) => w.slug !== currentSlug);
  const currentTag = currentTags?.find(Boolean);

  const sameTag = currentTag
    ? allWork.filter((w) => w.tags?.includes(currentTag))
    : [];
  const others = currentTag
    ? allWork.filter((w) => !w.tags?.includes(currentTag))
    : allWork;

  return [...sameTag, ...others].slice(0, 9).map(({ slug, title, client: c, featuredImage }) => ({
    slug, title, client: c, featuredImage,
  }));
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;

  let work;
  try {
    const response = await client.queries.work({
      relativePath: `${slug}.md`,
    });
    work = response.data.work;
  } catch {
    notFound();
  }

  const relatedWork = await getRelatedWork(slug, work.tags ?? undefined);

  const viewAllHref = "/our-work#work";

  return (
    <div className="min-h-screen bg-(--background) text-white">
      <Section>
        <Container className="px-[var(--layout-section-padding-x)] max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/our-work"
              className="text-sm text-[color:var(--font-color-tertiary)] hover:text-white transition-colors"
            >
              &larr; Back to Our Work
            </Link>
            {work.tags && work.tags.length > 0 && (
              <div className="flex gap-2">
                {work.tags.map(
                  (tag) =>
                    tag && (
                      <span
                        key={tag}
                        className="rounded-full bg-white/[0.06] border border-white/10 px-3 py-1 text-xs text-[color:var(--font-color-tertiary)]"
                      >
                        {tag}
                      </span>
                    ),
                )}
              </div>
            )}
          </div>

          <header className="mb-12">
            <Heading level={1} size="h1" color="primary">
              {work.title}
            </Heading>
          </header>

          {work.description && (
            <Text size="body-lg" color="secondary" className="mb-12 leading-relaxed">
              {work.description}
            </Text>
          )}

          {work.videoUrl && (
            <div className="mb-12 aspect-video overflow-hidden rounded-2xl bg-white/[0.03]">
              {work.videoUrl.includes("vimeo.com") ? (
                <iframe
                  src={buildVimeoEmbedUrl(work.videoUrl)}
                  className="h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <a
                  href={work.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full items-center justify-center text-[color:var(--font-color-tertiary)] hover:text-white transition-colors"
                >
                  Watch Video &rarr;
                </a>
              )}
            </div>
          )}

          {work.body && (
            <div className={`prose prose-invert prose-lg ${styles.prose}`}>
              <TinaMarkdown content={work.body} />
            </div>
          )}
        </Container>
      </Section>

      {/* Related Work */}
      {relatedWork.length > 0 && (
        <Section className="!pt-0">
          <Container className="px-[var(--layout-section-padding-x)]">
            <div className="flex items-center justify-between mb-8">
              <Heading level={2} size="h3" color="primary">
                More Case Studies
              </Heading>
              <Button href={viewAllHref} variant="outline">
                View All Work
              </Button>
            </div>
            <RelatedWorkCarousel items={relatedWork} />
          </Container>
        </Section>
      )}
    </div>
  );
}

/**
 * Build the Vimeo player embed URL from a URL like:
 * - https://vimeo.com/312643378
 * - https://vimeo.com/1086078015/3f4c1a88bf (unlisted with hash token)
 */
function buildVimeoEmbedUrl(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)(?:\/([a-f0-9]+))?/);
  if (!match) return "";
  const videoId = match[1];
  const hashToken = match[2];
  return hashToken
    ? `https://player.vimeo.com/video/${videoId}?h=${hashToken}`
    : `https://player.vimeo.com/video/${videoId}`;
}
