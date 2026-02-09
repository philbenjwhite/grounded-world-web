import Link from "next/link";
import client from "../../tina/__generated__/client";
import Section from "@/components/layout/Section";
import Container from "@/components/layout/Container";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";

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
    <div>
      <Section>
        <Container>
          <Heading level={1} size="h1">
            Activating Purpose
          </Heading>
          <Text>
            Grounded is a multi-award-winning, B Corp certified brand activation
            agency — thriving at the intersection of brand experience,
            commercial innovation, sustainability and social impact. We work
            with brands, retailers, startups and nonprofits all over the world —
            helping them transform purpose into profit, commercialize
            sustainability and drive behavior change at scale. No hushing. No
            Washing. No tweaking around the edges.
          </Text>
        </Container>
      </Section>

      <Section>
        <Container>
          <Heading level={2} size="h2">
            Latest Posts
          </Heading>
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
        </Container>
      </Section>
    </div>
  );
}
