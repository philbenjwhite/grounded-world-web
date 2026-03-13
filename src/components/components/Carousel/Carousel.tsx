'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import cn from 'classnames';
import { ArrowUpRight } from '@phosphor-icons/react';
import CarouselPagination from '@/components/atoms/CarouselPagination';
import styles from './Carousel.module.css';

export interface CarouselItem {
  id: string;
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
  logoUrl?: string;
}

export interface CarouselProps {
  /** Items to display in the carousel */
  items: CarouselItem[];
  /** Callback when an item is clicked */
  onItemClick?: (item: CarouselItem) => void;
  /** Optional className for the root container */
  className?: string;
  /** Enable looping */
  loop?: boolean;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show dot indicators */
  showDots?: boolean;
}

const TWEEN_FACTOR = 0.3;
const MIN_SCALE = 0.6;

const Carousel = ({
  items,
  onItemClick,
  className,
  loop = true,
  showArrows = true,
  showDots = true,
}: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    align: 'center',
    containScroll: false,
  });

  const slidesRef = useRef<HTMLDivElement[]>([]);
  const overlaysRef = useRef<HTMLDivElement[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  /* Apply tween directly to DOM — avoids React re-renders per frame */
  const onScroll = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    emblaApi.scrollSnapList().forEach((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        engine.slideLooper.loopPoints.forEach((loopItem) => {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
            if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
          }
        });
      }

      const tweenValue = 1 - Math.abs(diffToTarget * TWEEN_FACTOR);
      const scale = Math.max(MIN_SCALE, Math.min(1, tweenValue));
      /* 0 = fully centered, 1 = fully off-screen */
      const offCenter = 1 - (scale - MIN_SCALE) / (1 - MIN_SCALE);

      const slideNode = slidesRef.current[index];
      if (!slideNode) return;
      slideNode.style.transform = `scale(${scale})`;

      /* Glass overlay: blur + darken non-center cards */
      const overlayNode = overlaysRef.current[index];
      if (overlayNode) overlayNode.style.opacity = String(offCenter);
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    onScroll();
    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('reInit', onScroll);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', onScroll);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('reInit', onScroll);
    };
  }, [emblaApi, onSelect, onScroll]);

  if (items.length === 0) {
    return (
      <div className={cn('text-[color:var(--color-gray-4)] text-center py-8', className)}>
        No items to display.
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Carousel viewport — py/negative-my gives hover-scale breathing room */}
      <div className="overflow-hidden py-6 -my-6" ref={emblaRef}>
        <div className="flex touch-pan-y -ml-4">
          {items.map((item, index) => {
            const isCenter = index === selectedIndex;

            return (
              <div
                key={item.id}
                ref={(el) => { if (el) slidesRef.current[index] = el; }}
                className={cn(styles.slide, 'min-w-0 pl-4')}
              >
                <div
                  data-active={isCenter || undefined}
                  className={cn(
                    styles.card,
                    'work-card-hover',
                    'relative',
                    'rounded-[var(--comp-work-card-radius)]',
                    'bg-(--comp-work-card-surface)',
                    'overflow-hidden',
                    'aspect-video',
                    isCenter && 'cursor-pointer'
                  )}
                  onClick={isCenter ? () => onItemClick?.(item) : undefined}
                  role={isCenter ? 'button' : undefined}
                  tabIndex={isCenter ? 0 : -1}
                  onKeyDown={
                    isCenter
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') onItemClick?.(item);
                        }
                      : undefined
                  }
                >
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt ?? item.title ?? ''}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full" />
                  )}

                  {/* Base dark overlay for text legibility on light images */}
                  <div className="absolute inset-0 z-[0] bg-black/10 pointer-events-none" />

                  {/* Glass overlay — blurs + darkens non-center cards */}
                  <div
                    ref={(el) => { if (el) overlaysRef.current[index] = el; }}
                    className={styles.glassOverlay}
                  />

                  {/* Gradient scrim for text legibility */}
                  <div className={cn(styles.cardScrim, 'absolute inset-0 z-[1] pointer-events-none')} />

                  {/* Amber glow overlay */}
                  <div className="work-card-glow" />

                  {/* Logo + centered title layout (for project cards with logos) */}
                  {item.logoUrl ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8 gap-4">
                      <img
                        src={item.logoUrl}
                        alt=""
                        className="h-12 md:h-16 w-auto object-contain"
                      />
                      {item.title && (
                        <h3 className="text-xl md:text-3xl font-bold leading-snug text-[var(--font-color-primary)] max-w-lg">
                          {item.title}
                        </h3>
                      )}
                      <span className="inline-block mt-2 rounded-sm bg-[var(--color-primary)] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white">
                        See Case Study
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Title text — bottom left */}
                      {item.title && (
                        <div className={cn(styles.cardTitle, 'absolute bottom-5 left-5 z-10')}>
                          <h3 className="text-lg font-bold leading-snug text-[var(--font-color-primary)]">
                            {item.title}
                          </h3>
                        </div>
                      )}
                    </>
                  )}

                  {/* Arrow icon — top right, visible on hover */}
                  <span className="work-card-arrow absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                    <ArrowUpRight size={18} weight="bold" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation arrows */}
      {showArrows && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!loop && !canScrollPrev}
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 z-10',
              'w-[var(--size-40)] h-[var(--size-40)]',
              'rounded-full',
              'bg-(--color-cyan)',
              'flex items-center justify-center',
              'cursor-pointer',
              'transition-all',
              'hover:scale-110',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            )}
            aria-label="Previous slide"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="var(--color-black)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            onClick={scrollNext}
            disabled={!loop && !canScrollNext}
            className={cn(
              'absolute right-4 top-1/2 -translate-y-1/2 z-10',
              'w-[var(--size-40)] h-[var(--size-40)]',
              'rounded-full',
              'bg-(--color-cyan)',
              'flex items-center justify-center',
              'cursor-pointer',
              'transition-all',
              'hover:scale-110',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            )}
            aria-label="Next slide"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="var(--color-black)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {showDots && (
        <CarouselPagination
          total={items.length}
          activeIndex={selectedIndex}
          onSelect={scrollTo}
          className="mt-6"
        />
      )}
    </div>
  );
};

export default Carousel;
