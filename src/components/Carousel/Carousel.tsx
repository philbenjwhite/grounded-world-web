'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import cn from 'classnames';

export interface CarouselItem {
  id: string;
  title?: string;
  imageUrl?: string;
  imageAlt?: string;
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

  const [tweenValues, setTweenValues] = useState<number[]>([]);
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

  const onScroll = useCallback(() => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const values = emblaApi.scrollSnapList().map((scrollSnap, index) => {
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
      return Math.max(MIN_SCALE, Math.min(1, tweenValue));
    });

    setTweenValues(values);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

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
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {items.map((item, index) => {
            const scale = tweenValues[index] ?? 1;
            const isCenter = index === selectedIndex;

            return (
              <div
                key={item.id}
                className="flex-[0_0_60%] min-w-0 pl-4 first:pl-0"
                style={{
                  transform: `scale(${scale})`,
                  transition: 'transform 0.2s ease-out',
                }}
              >
                <div
                  className={cn(
                    'rounded-[var(--comp-media-section-item-radius)]',
                    'bg-[var(--comp-media-section-item-surface)]',
                    'overflow-hidden',
                    'aspect-video',
                    'transition-opacity duration-200',
                    isCenter ? 'opacity-100 cursor-pointer' : 'opacity-60'
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
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full" />
                  )}
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
              'bg-[var(--color-cyan)]',
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
              'bg-[var(--color-cyan)]',
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
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === selectedIndex
                  ? 'bg-[var(--color-cyan)] w-4'
                  : 'bg-[var(--color-gray-4)] hover:bg-[var(--color-gray-3)]'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
