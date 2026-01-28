import Link from "next/link";
import { notFound } from "next/navigation";
import client from "../../../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const postsResponse = await client.queries.postConnection();
    return (
      postsResponse.data.postConnection.edges?.map((edge) => ({
        slug: edge?.node?._sys.filename,
      })) || []
    );
  } catch {
    return [];
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  try {
    const postResponse = await client.queries.post({
      relativePath: `${slug}.md`,
    });

    const post = postResponse.data.post;

    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-xl font-bold text-zinc-900 dark:text-white"
            >
              Grounded World
            </Link>
            <div className="flex gap-6">
              <Link
                href="/"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Home
              </Link>
              <Link
                href="/posts"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Blog
              </Link>
              <Link
                href="/admin"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                Admin
              </Link>
            </div>
          </nav>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-16">
          <article>
            <header className="mb-12">
              <Link
                href="/posts"
                className="mb-4 inline-block text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                ← Back to posts
              </Link>
              <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-white">
                {post.title}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {post.description && (
                <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                  {post.description}
                </p>
              )}
            </header>

            <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-zinc-900 dark:prose-a:text-white prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-800">
              <TinaMarkdown content={post.body} />
            </div>
          </article>
        </main>

        <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-5xl px-6 py-8 text-center text-zinc-600 dark:text-zinc-400">
            <p>Built with Next.js, TinaCMS, and Tailwind CSS</p>
          </div>
        </footer>
      </div>
    );
  } catch {
    notFound();
  }
}
