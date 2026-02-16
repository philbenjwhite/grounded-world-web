import serverClient from "../../tina/server-client";
import HomeClientPage from "./client-page";

export default async function Home() {
  const result = await serverClient.queries.page({
    relativePath: "home.json",
  });

  return (
    <HomeClientPage
      query={result.query}
      variables={result.variables as { relativePath: string }}
      data={result.data}
    />
  );
}
