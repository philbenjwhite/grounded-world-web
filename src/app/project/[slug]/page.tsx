import { notFound } from "next/navigation";
import client from "../../../../tina/server-client";
import ProjectClientPage from "./client-page";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const response = await client.queries.projectConnection();
    return (
      response.data.projectConnection.edges?.map((edge) => ({
        slug: edge?.node?._sys.filename,
      })) || []
    );
  } catch {
    return [];
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  try {
    const response = await client.queries.project({
      relativePath: `${slug}.json`,
    });

    return (
      <ProjectClientPage
        query={response.query}
        variables={response.variables as { relativePath: string }}
        data={response.data}
      />
    );
  } catch {
    notFound();
  }
}
