import type { Metadata } from "next";
import PodcastClientPage from "./client-page";

export const metadata: Metadata = {
  title: "It Shouldn't Be This Hard Podcast | Grounded World",
  description:
    "The podcast for people who know that responsible business is messy, meaningful, and probably much harder than it should be.",
};

export default function PodcastPage() {
  return <PodcastClientPage />;
}
