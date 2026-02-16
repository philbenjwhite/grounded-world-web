import serverClient from "../../../tina/server-client";
import ClientPage from "../[slug]/client-page";

export const metadata = {
  title: "Our Services | Grounded World",
  description:
    "Everything we do is designed to move the needle culturally, socially, environmentally and behaviorally — inside and out.",
};

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
