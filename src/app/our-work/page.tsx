import Link from "next/link";
import client from "../../../tina/server-client";

export default async function OurWorkPage() {
  let edges: NonNullable<
    Awaited<
      ReturnType<typeof client.queries.workConnection>
    >["data"]["workConnection"]["edges"]
  > = [];

  try {
    const response = await client.queries.workConnection({
      sort: "date",
    });
    edges = response.data.workConnection.edges ?? [];
  } catch (error) {
    console.error("workConnection fetch failed:", error);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="mb-12 text-4xl font-bold md:text-5xl">Our Work</h1>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {edges.map((edge) => {
            const node = edge?.node;
            if (!node) return null;
            const tag = node.tags?.[0];

            return (
              <Link
                key={node._sys.filename}
                href={`/our-work/${node._sys.filename}`}
                className="group rounded-lg bg-zinc-900 p-6 transition-colors hover:bg-zinc-800"
              >
                {tag && (
                  <span className="mb-3 inline-block rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400 group-hover:bg-zinc-700">
                    {tag}
                  </span>
                )}
                <h2 className="mb-2 text-lg font-semibold leading-snug">
                  {node.title}
                </h2>
                <p className="text-sm text-zinc-400">{node.client}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
