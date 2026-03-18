import type { Metadata } from "next";
import serverClient from "../../../../tina/server-client";
import { getPageMetadata } from "@/lib/page-metadata";
import ClientPage from "../../[slug]/client-page";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "itshouldntbethishard.json",
    "It Shouldn't Be This Hard Podcast | Grounded World",
    "The podcast for people who know that responsible business is messy, meaningful, and probably much harder than it should be.",
  );
}

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
