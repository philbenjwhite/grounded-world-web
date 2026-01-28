import Link from "next/link";
import client from "../../../tina/__generated__/client";

export default async function PostsPage() {
  let posts: {
    title: string;
    date: string;
    description?: string | null;
    _sys: { filename: string };
  }[] = [];

  try {
    const postsResponse = await client.queries.postConnection();
    posts =
      postsResponse.data.postConnection.edges?.map((edge) => ({
        title: edge?.node?.title || "",
        date: edge?.node?.date || "",
        description: edge?.node?.description,
        _sys: { filename: edge?.node?._sys.filename || "" },
      })) || [];
  } catch {
    // TinaCMS client not initialized yet
  }

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
              className="font-medium text-zinc-900 dark:text-white"
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

      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="mb-12 text-4xl font-bold text-zinc-900 dark:text-white">
          Blog Posts
        </h1>

        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post._sys.filename}
                className="rounded-lg border border-zinc-200 bg-white p-8 transition hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
              >
                <Link href={`/posts/${post._sys.filename}`}>
                  <h2 className="mb-2 text-2xl font-semibold text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
                    {post.title}
                  </h2>
                </Link>
                <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {post.description && (
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {post.description}
                  </p>
                )}
                <Link
                  href={`/posts/${post._sys.filename}`}
                  className="mt-4 inline-block font-medium text-zinc-900 hover:underline dark:text-white"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-zinc-600 dark:text-zinc-400">
            No posts yet. Visit the{" "}
            <Link
              href="/admin"
              className="underline hover:text-zinc-900 dark:hover:text-white"
            >
              admin panel
            </Link>{" "}
            to create your first post.
          </p>
        )}
      </main>

      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-zinc-600 dark:text-zinc-400">
          <p>Built with Next.js, TinaCMS, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
