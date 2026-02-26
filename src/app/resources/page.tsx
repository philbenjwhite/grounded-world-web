import serverClient from "../../../tina/server-client";
import ResourcesClientPage from "./client-page";

export const metadata = {
  title: "Sustainability Marketing Resources | Grounded World",
  description:
    "Ideas, frameworks, and tools to help you activate brand purpose, sustainability, and social impact. Explore our podcast, white papers, how-to guides, and articles.",
};

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
