import { notFound } from "next/navigation";
import type { Metadata } from "next";
import serverClient from "../../../../../tina/server-client";
import { getPageMetadata } from "@/lib/page-metadata";
import ClientPage from "../../../[slug]/client-page";

interface PageParams {
  slug: string;
}

async function fetchPage(slug: string) {
  try {
    return await serverClient.queries.page({
      relativePath: `guides-${slug}.json`,
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  return getPageMetadata(
    `guides-${slug}.json`,
    `Guide | Grounded World`,
    "In-depth guide from Grounded World.",
  );
}

export default async function GuidePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const result = await fetchPage(slug);

  if (!result) notFound();

  return (
    <div className="pt-12 pb-16 md:pt-16 md:pb-24">
      <ClientPage
        query={result.query}
        variables={result.variables as { relativePath: string }}
        data={result.data}
      />
    </div>
  );
}
