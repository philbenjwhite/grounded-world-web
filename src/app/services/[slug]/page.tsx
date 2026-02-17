import { notFound } from "next/navigation";
import serverClient from "../../../../tina/server-client";
import ClientPage from "../../[slug]/client-page";

interface PageParams {
  slug: string;
}

async function fetchPage(slug: string) {
  try {
    return await serverClient.queries.page({
      relativePath: `services-${slug}.json`,
    });
  } catch {
    return null;
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const result = await fetchPage(slug);

  if (!result) notFound();

  return (
    <ClientPage
      query={result.query}
      variables={result.variables as { relativePath: string }}
      data={result.data}
    />
  );
}
