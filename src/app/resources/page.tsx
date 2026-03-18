import type { Metadata } from "next";
import serverClient from "../../../tina/server-client";
import { getPageMetadata } from "@/lib/page-metadata";
import ResourcesClientPage from "./client-page";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "resources.json",
    "Sustainability Marketing Resources | Grounded World",
    "Ideas, frameworks, and tools to help you activate brand purpose, sustainability, and social impact. Explore our podcast, white papers, how-to guides, and articles.",
  );
}

export default async function ResourcesPage() {
  const result = await serverClient.queries.page({
    relativePath: "resources.json",
  });

  return (
    <ResourcesClientPage
      query={result.query}
      variables={result.variables as { relativePath: string }}
      data={result.data}
    />
  );
}
