import type { Metadata } from "next";
import serverClient from "../../../tina/server-client";
import { getPageMetadata } from "@/lib/page-metadata";
import AboutClientPage from "./client-page";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "about.json",
    "About Us | Grounded World",
    "Grounded is a B Corp certified, multi-award-winning boutique marketing agency activating purpose and accelerating impact.",
  );
}

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
