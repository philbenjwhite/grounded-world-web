import client from "../../../tina/server-client";
import HeroBanner from "@/components/components/HeroBanner";
import WorkGrid from "@/components/components/WorkGrid";
import type { WorkItem } from "@/components/components/WorkGrid";

export default async function OurWorkPage() {
  let items: WorkItem[] = [];

  try {
    const response = await client.queries.workConnection({
      sort: "date",
      first: 100,
    });

    items = [...(response.data.workConnection.edges ?? [])]
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
        };
      })
      .filter(Boolean) as WorkItem[];
  } catch (error) {
    console.error("workConnection fetch failed:", error);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroBanner
        backgroundType="canvas"
        title="Our Work"
        overlayOpacity="light"
        contentAlign="center"
        minHeight="medium"
      />

      <WorkGrid items={items} />
    </div>
  );
}
