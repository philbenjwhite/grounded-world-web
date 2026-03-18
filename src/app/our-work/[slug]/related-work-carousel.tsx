"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { RelatedWorkItem } from "./page";

interface RelatedWorkCarouselProps {
  items: RelatedWorkItem[];
}

export default function RelatedWorkCarousel({ items }: RelatedWorkCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 3,
    containScroll: "trimSnaps",
    loop: false,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-5">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/our-work/${item.slug}`}
              className="relative flex-none w-[calc(33.333%-14px)] max-lg:w-[calc(50%-10px)] max-sm:w-[85%] aspect-[4/3] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15] transition-all group"
            >
              {item.featuredImage && (
                <Image
                  src={item.featuredImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-base font-semibold text-[color:var(--font-color-primary)] leading-snug">
                  {item.title}
                </p>
                <p className="text-sm text-[color:var(--font-color-tertiary)] mt-1">
                  {item.client}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Nav arrows */}
      {items.length > 3 && (
        <>
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-10 h-10 rounded-full bg-(--color-cyan) flex items-center justify-center cursor-pointer transition-all hover:scale-110 max-lg:hidden"
          >
            <CaretLeft size={18} weight="bold" className="text-black" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-10 h-10 rounded-full bg-(--color-cyan) flex items-center justify-center cursor-pointer transition-all hover:scale-110 max-lg:hidden"
          >
            <CaretRight size={18} weight="bold" className="text-black" />
          </button>
        </>
      )}
    </div>
  );
}
