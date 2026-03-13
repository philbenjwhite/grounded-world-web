"use client";

import { useRouter } from "next/navigation";
import Carousel from "@/components/components/Carousel";
import type { CarouselItem } from "@/components/components/Carousel";
import Heading from "@/components/atoms/Heading";

export interface ProjectCarouselItem {
  slug: string;
  title: string;
  client: string;
  featuredImage?: string;
  logoImage?: string;
  description?: string;
}

export interface ProjectCarouselProps {
  sectionTitle?: string;
  items: ProjectCarouselItem[];
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
}

const ProjectCarousel = ({
  sectionTitle,
  items,
  loop = true,
  showArrows = true,
  showDots = true,
  className,
}: ProjectCarouselProps) => {
  const router = useRouter();

  const carouselItems: CarouselItem[] = items.map((item) => ({
    id: item.slug,
    title: item.title,
    imageUrl: item.featuredImage,
    imageAlt: `${item.client} – ${item.title}`,
    logoUrl: item.logoImage,
  }));

  const handleItemClick = (carouselItem: CarouselItem) => {
    router.push(`/project/${carouselItem.id}`);
  };

  return (
    <section className={className}>
      {sectionTitle && (
        <Heading level={2} size="h2" color="primary" className="text-center mb-8 md:mb-12">
          {sectionTitle}
        </Heading>
      )}
      <Carousel
        items={carouselItems}
        onItemClick={handleItemClick}
        loop={loop}
        showArrows={showArrows}
        showDots={showDots}
      />
    </section>
  );
};

export default ProjectCarousel;
