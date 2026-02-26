import Link from "next/link";
import { notFound } from "next/navigation";
import client from "../../../../tina/server-client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";

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

  return (
    <div className="min-h-screen bg-(--background) text-white">
      <Section>
        <Container className="px-[var(--layout-section-padding-x)] max-w-4xl">
          <nav className="mb-8">
            <Link
              href="/our-work"
              className="text-sm text-[color:var(--font-color-tertiary)] hover:text-[color:var(--color-cyan)] transition-colors"
            >
              &larr; Back to Our Work
            </Link>
          </nav>

          <header className="mb-12">
            {work.tags && work.tags.length > 0 && (
              <div className="mb-4 flex gap-2">
                {work.tags.map(
                  (tag) =>
                    tag && (
                      <span
                        key={tag}
                        className="rounded-full bg-white/[0.06] border border-white/[0.08] px-3 py-1 text-xs text-[color:var(--font-color-tertiary)]"
                      >
                        {tag}
                      </span>
                    ),
                )}
              </div>
            )}
            <Heading level={1} size="h1" color="primary" className="mb-4">
              {work.title}
            </Heading>
            <Text size="body-lg" color="tertiary">
              {work.client}
            </Text>
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
                  src={`https://player.vimeo.com/video/${extractVimeoId(
                    work.videoUrl,
                  )}`}
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
            <div className="prose prose-invert prose-lg max-w-none prose-headings:text-[color:var(--font-color-primary)] prose-headings:font-bold prose-p:text-[color:var(--font-color-secondary)] prose-a:text-[color:var(--color-cyan)] prose-strong:text-[color:var(--font-color-primary)] prose-li:text-[color:var(--font-color-secondary)] prose-img:rounded-2xl">
              <TinaMarkdown content={work.body} />
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
}

/**
 * Extract the Vimeo video ID from a URL like:
 * - https://vimeo.com/312643378
 * - https://vimeo.com/1108243115/53c512ba12
 */
function extractVimeoId(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : "";
}
