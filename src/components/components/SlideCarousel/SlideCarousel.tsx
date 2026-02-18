'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import cn from 'classnames';
import { ArrowsOut, X } from '@phosphor-icons/react';
import CarouselPagination from '@/components/atoms/CarouselPagination';
import Heading from '@/components/atoms/Heading';
import Text from '@/components/atoms/Text';
import styles from './SlideCarousel.module.css';

export interface SlideCarouselItem {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface SlideCarouselProps {
  items: SlideCarouselItem[];
  loop?: boolean;
  className?: string;
}

const TWEEN_FACTOR = 0.3;
const MIN_SCALE = 0.6;

const SlideCarousel: React.FC<SlideCarouselProps> = ({
  items,
  loop = true,
  className,
}) => {
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
  const [lightboxItem, setLightboxItem] = useState<SlideCarouselItem | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

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
      const offCenter = 1 - (scale - MIN_SCALE) / (1 - MIN_SCALE);

      const slideNode = slidesRef.current[index];
      if (slideNode) slideNode.style.transform = `scale(${scale})`;

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

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightboxItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxItem]);

  if (items.length === 0) return null;

  return (
    <>
      <div className={cn('relative', className)}>
        <div className="overflow-hidden py-6 -my-6" ref={emblaRef}>
          <div className="flex touch-pan-y -ml-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => { if (el) slidesRef.current[index] = el; }}
                className={cn(styles.slide, 'min-w-0 pl-4')}
              >
                <div
                  className={cn(
                    styles.card,
                    'relative rounded-[var(--comp-work-card-radius)] bg-(--comp-work-card-surface) overflow-hidden aspect-video',
                  )}
                  onClick={() => setLightboxItem(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Enlarge: ${item.title ?? item.imageAlt ?? 'slide'}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setLightboxItem(item);
                  }}
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt ?? item.title ?? ''}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Glass overlay — blurs + darkens non-center slides */}
                  <div
                    ref={(el) => { if (el) overlaysRef.current[index] = el; }}
                    className={styles.glassOverlay}
                  />

                  {/* Gradient scrim for text legibility */}
                  <div className={cn(styles.cardScrim, 'absolute inset-0 z-[1] pointer-events-none')} />

                  {/* Expand icon */}
                  <span className={cn(styles.expandIcon, 'absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm')}>
                    <ArrowsOut size={18} weight="bold" className="text-white" />
                  </span>

                  {/* Title + Description */}
                  {(item.title || item.description) && (
                    <div className={cn(styles.cardTitle, 'absolute bottom-5 left-5 right-5 z-10')}>
                      {item.title && (
                        <Heading level={3} size="h4" color="primary" className="leading-snug">
                          {item.title}
                        </Heading>
                      )}
                      {item.description && (
                        <Text size="body-sm" color="secondary" className="mt-1 leading-snug">
                          {item.description}
                        </Text>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev arrow */}
        <button
          onClick={scrollPrev}
          disabled={!loop && !canScrollPrev}
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 z-10',
            'w-[var(--size-40)] h-[var(--size-40)] rounded-full',
            'bg-(--color-cyan) flex items-center justify-center',
            'cursor-pointer transition-all hover:scale-110',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          )}
          aria-label="Previous slide"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="var(--color-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Next arrow */}
        <button
          onClick={scrollNext}
          disabled={!loop && !canScrollNext}
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2 z-10',
            'w-[var(--size-40)] h-[var(--size-40)] rounded-full',
            'bg-(--color-cyan) flex items-center justify-center',
            'cursor-pointer transition-all hover:scale-110',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          )}
          aria-label="Next slide"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="var(--color-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dot pagination */}
        <CarouselPagination
          total={items.length}
          activeIndex={selectedIndex}
          onSelect={scrollTo}
          className="mt-6"
        />
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className={styles.lightboxBackdrop}
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title ?? 'Slide preview'}
        >
          {/* Close button */}
          <button
            className="absolute top-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            onClick={() => setLightboxItem(null)}
            aria-label="Close"
          >
            <X size={22} weight="bold" className="text-white" />
          </button>

          {/* Image */}
          <div
            className={cn(styles.lightboxImage, 'relative max-w-[90vw] max-h-[90vh]')}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxItem.imageUrl}
              alt={lightboxItem.imageAlt ?? lightboxItem.title ?? ''}
              className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />
            {lightboxItem.title && (
              <Text size="body-sm" color="secondary" className="mt-3 text-center">
                {lightboxItem.title}
              </Text>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SlideCarousel;
