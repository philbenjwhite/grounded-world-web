import type { Metadata } from "next";
import serverClient from "../../../tina/server-client";
import { getPageMetadata } from "@/lib/page-metadata";
import type { WorkItem } from "@/components/components/WorkGrid";
import OurWorkClientPage from "./client-page";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "our-work.json",
    "Our Work | Grounded World",
    "Explore the projects and case studies from Grounded World — activating purpose and accelerating impact for brands worldwide.",
  );
}

export default async function OurWorkPage() {
  /* Fetch page content (heroBanner config) from TinaCMS */
  const pageResult = await serverClient.queries.page({
    relativePath: "our-work.json",
  });

  /* Fetch work items from TinaCMS work collection */
  let workItems: WorkItem[] = [];
  try {
    const response = await serverClient.queries.workConnection({
      sort: "date",
      first: 100,
    });

    workItems = [...(response.data.workConnection.edges ?? [])]
      .sort((a, b) => {
        const dateA = a?.node?.date ? new Date(a.node.date).getTime() : 0;
        const dateB = b?.node?.date ? new Date(b.node.date).getTime() : 0;
        return dateB - dateA;
      })
      .map((edge) => {
        const node = edge?.node;
        if (!node) return null;
        return {
          slug: node._sys.filename,
          title: node.title,
          client: node.client,
          description: node.description ?? undefined,
          date: node.date ?? undefined,
          tag: node.tags?.[0] ?? undefined,
          featuredImage: node.featuredImage ?? undefined,
        };
      })
      .filter(Boolean) as WorkItem[];
  } catch (error) {
    console.error("workConnection fetch failed:", error);
  }

  return (
    <OurWorkClientPage
      query={pageResult.query}
      variables={pageResult.variables as { relativePath: string }}
      data={pageResult.data}
      workItems={workItems}
    />
  );
}
