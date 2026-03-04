import serverClient from "../../../tina/server-client";
import AboutClientPage from "./client-page";

export const metadata = {
  title: "About Us | Grounded World",
  description:
    "Grounded is a B Corp certified, multi-award-winning boutique marketing agency activating purpose and accelerating impact.",
};

export default async function AboutPage() {
  const result = await serverClient.queries.page({
    relativePath: "about.json",
  });

  return (
    <AboutClientPage
      query={result.query}
      variables={result.variables as { relativePath: string }}
      data={result.data}
    />
  );
}
