import Link from "next/link";
import { notFound } from "next/navigation";
import client from "../../../../tina/server-client";
import { TinaMarkdown } from "tinacms/dist/rich-text";

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
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <Link
          href="/our-work"
          className="mb-8 inline-block text-sm text-zinc-400 hover:text-white"
        >
          &larr; Back to Our Work
        </Link>

        <header className="mb-12">
          {work.tags && work.tags.length > 0 && (
            <div className="mb-4 flex gap-2">
              {work.tags.map(
                (tag) =>
                  tag && (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
                    >
                      {tag}
                    </span>
                  ),
              )}
            </div>
          )}
          <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
            {work.title}
          </h1>
          <p className="text-lg text-zinc-400">{work.client}</p>
        </header>

        {work.description && (
          <p className="mb-12 text-xl leading-relaxed text-zinc-300">
            {work.description}
          </p>
        )}

        {work.videoUrl && (
          <div className="mb-12 aspect-video overflow-hidden rounded-lg bg-zinc-900">
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
                className="flex h-full items-center justify-center text-zinc-400 hover:text-white"
              >
                Watch Video &rarr;
              </a>
            )}
          </div>
        )}

        {work.body && (
          <div className="prose prose-invert max-w-none prose-headings:font-bold prose-a:text-white">
            <TinaMarkdown content={work.body} />
          </div>
        )}
      </main>
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
