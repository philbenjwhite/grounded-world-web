import Link from "next/link";
import client from "../../tina/__generated__/client";

export default async function Home() {
  let posts: { title: string; date: string; _sys: { filename: string } }[] = [];

  try {
    const postsResponse = await client.queries.postConnection();
    posts =
      postsResponse.data.postConnection.edges?.map((edge) => ({
        title: edge?.node?.title || "",
        date: edge?.node?.date || "",
        _sys: { filename: edge?.node?._sys.filename || "" },
      })) || [];
  } catch {
    // TinaCMS client not initialized yet - show default content
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

      <main className="mx-auto max-w-5xl px-6 py-16">
        <section className="mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome to Grounded World
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-zinc-600 dark:text-zinc-400">
            A Next.js website powered by TinaCMS and styled with Tailwind CSS.
            Edit your content through the admin panel.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/posts"
              className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Read Blog
            </Link>
            <Link
              href="/admin"
              className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
            >
              Edit Content
            </Link>
          </div>
        </section>

        <section>
          <h2 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-white">
            Latest Posts
          </h2>
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post._sys.filename}
                  href={`/posts/${post._sys.filename}`}
                  className="rounded-lg border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
                >
                  <h3 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400">
              No posts yet. Visit the{" "}
              <Link href="/admin" className="underline hover:text-zinc-900">
                admin panel
              </Link>{" "}
              to create your first post.
            </p>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-zinc-600 dark:text-zinc-400">
          <p>
            Built with Next.js, TinaCMS, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
