import type { Metadata } from "next";
import serverClient from "../../tina/server-client";
import { getPageMetadata } from "@/lib/page-metadata";
import HomeClientPage from "./client-page";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "home.json",
    "Brand Purpose & Sustainability Agency | Grounded World",
    "Grounded World is a B Corp certified agency at the intersection of brand purpose, commercial strategy, and social impact.",
  );
}

export default async function Home() {
  const result = await serverClient.queries.page({
    relativePath: "home.json",
  });

  return (
    <HomeClientPage
      query={result.query}
      variables={result.variables as { relativePath: string }}
      data={result.data}
    />
  );
}
