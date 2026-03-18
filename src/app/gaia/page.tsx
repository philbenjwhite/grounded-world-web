import type { Metadata } from "next";
import serverClient from "../../../tina/server-client";
import { getPageMetadata } from "@/lib/page-metadata";
import ClientPage from "../[slug]/client-page";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "gaia.json",
    "Ask Gaia | Grounded World",
    "Meet Gaia, Grounded's AI-powered sustainability expert. Ask questions about brand purpose, sustainability strategy, marketing, and more.",
  );
}

export default async function GaiaPage() {
  const result = await serverClient.queries.page({
    relativePath: "gaia.json",
  });

  return (
    <ClientPage
      query={result.query}
      variables={result.variables as { relativePath: string }}
      data={result.data}
    />
  );
}
