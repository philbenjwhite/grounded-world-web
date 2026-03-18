import type { Metadata } from "next";
import { getPageMetadata } from "@/lib/page-metadata";
import PodcastClientPage from "./client-page";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(
    "itshouldntbethishard.json",
    "It Shouldn't Be This Hard Podcast | Grounded World",
    "The podcast for people who know that responsible business is messy, meaningful, and probably much harder than it should be.",
  );
}

export default function PodcastPage() {
  return <PodcastClientPage />;
}
