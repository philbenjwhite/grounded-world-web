"use client";

import MediaSection from "../../components/components/MediaSection";
import type { MediaItem } from "../../components/components/MediaSection/MediaSection";

const categories = [
  "Brand Activation",
  "Sustainability Storytelling",
  "Social Impact",
  "Brand Purpose",
];

const workItems: MediaItem[] = [
  {
    id: "work-1",
    title: "Brand Activation Campaign",
    category: "Brand Activation",
    imageUrl: "https://picsum.photos/seed/work1/800/600",
    imageAlt: "Brand activation project",
  },
  {
    id: "work-2",
    title: "Sustainability Initiative",
    category: "Sustainability Storytelling",
    imageUrl: "https://picsum.photos/seed/work2/800/600",
    imageAlt: "Sustainability storytelling project",
  },
  {
    id: "work-3",
    title: "Community Impact Program",
    category: "Social Impact",
    imageUrl: "https://picsum.photos/seed/work3/800/600",
    imageAlt: "Social impact project",
  },
  {
    id: "work-4",
    title: "Purpose-Driven Campaign",
    category: "Brand Purpose",
    imageUrl: "https://picsum.photos/seed/work4/800/600",
    imageAlt: "Brand purpose project",
  },
  {
    id: "work-5",
    title: "Interactive Experience",
    category: "Brand Activation",
    imageUrl: "https://picsum.photos/seed/work5/800/600",
    imageAlt: "Interactive brand experience",
  },
  {
    id: "work-6",
    title: "Environmental Story",
    category: "Sustainability Storytelling",
    imageUrl: "https://picsum.photos/seed/work6/800/600",
    imageAlt: "Environmental storytelling project",
  },
];

export default function OurWorkPage() {
  const handleItemClick = (item: MediaItem) => {
    console.log("Clicked item:", item);
  };

  return (
    <main>
      <MediaSection
        title="Our Work"
        categories={categories}
        items={workItems}
        onItemClick={handleItemClick}
      />
    </main>
  );
}
