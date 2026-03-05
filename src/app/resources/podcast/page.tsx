import type { Metadata } from "next";
import serverClient from "../../../../tina/server-client";
import ClientPage from "../../[slug]/client-page";

export const metadata: Metadata = {
  title: "It Shouldn't Be This Hard Podcast | Grounded World",
  description:
    "The podcast for people who know that responsible business is messy, meaningful, and probably much harder than it should be.",
};

export default async function PodcastPage() {
  const result = await serverClient.queries.page({
    relativePath: "itshouldntbethishard.json",
  });

  return (
    <ClientPage
      query={result.query}
      variables={result.variables as { relativePath: string }}
      data={result.data}
    />
  );
}
