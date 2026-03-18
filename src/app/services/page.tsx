import type { Metadata } from "next";
import serverClient from "../../../tina/server-client";
import { getPageMetadata } from "@/lib/page-metadata";
import ClientPage from "../[slug]/client-page";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "services.json",
    "Our Services | Grounded World",
    "Everything we do is designed to move the needle culturally, socially, environmentally and behaviorally — inside and out.",
  );
}

export default async function ServicesPage() {
  const result = await serverClient.queries.page({
    relativePath: "services.json",
  });

  return (
    <ClientPage
      query={result.query}
      variables={result.variables as { relativePath: string }}
      data={result.data}
    />
  );
}
