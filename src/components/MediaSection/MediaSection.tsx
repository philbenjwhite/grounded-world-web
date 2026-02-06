'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';

export interface MediaItem {
  id: string;
  title: string;
  category: string;
  imageUrl?: string;
  imageAlt?: string;
  href?: string;
}

export interface MediaSectionProps {
  /** Label displayed above the filter tabs */
  label?: string;
  /** Category labels for filter tabs ("All" is prepended automatically) */
  categories: string[];
  /** Media items to render */
  items: MediaItem[];
  /** Callback when a media item is clicked */
  onItemClick?: (item: MediaItem) => void;
  /** Callback when the active filter changes */
  onFilterChange?: (category: string) => void;
  /** Initially selected category (defaults to "All") */
  defaultCategory?: string;
  /** Optional className for the root container */
  className?: string;
}

const MediaSection = ({
  label = 'Tabs',
  categories,
  items,
  onItemClick,
  onFilterChange,
  defaultCategory = 'All',
  className,
}: MediaSectionProps) => {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const allCategories = useMemo(() => ['All', ...categories], [categories]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentIndex(0);
    setSlideDirection(null);
    onFilterChange?.(category);
  };

  const goNext = useCallback(() => {
    if (filteredItems.length === 0 || isAnimating) return;

    setIsAnimating(true);
    setSlideDirection('left');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 400);
  }, [filteredItems.length, isAnimating]);

  const goPrev = useCallback(() => {
    if (filteredItems.length === 0 || isAnimating) return;

    setIsAnimating(true);
    setSlideDirection('right');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      setSlideDirection(null);
      setIsAnimating(false);
    }, 400);
  }, [filteredItems.length, isAnimating]);

  // Get visible items: far left, prev, current, next, far right (for smooth animation)
  const getVisibleItem = (offset: number) => {
    if (filteredItems.length === 0) return null;
    const idx = (currentIndex + offset + filteredItems.length) % filteredItems.length;
    return { item: filteredItems[idx], index: idx };
  };

  const farLeftData = getVisibleItem(-2);
  const prevData = getVisibleItem(-1);
  const centerData = getVisibleItem(0);
  const nextData = getVisibleItem(1);
  const farRightData = getVisibleItem(2);

  const renderCard = (
    data: { item: MediaItem; index: number } | null,
    position: 'farLeft' | 'left' | 'center' | 'right' | 'farRight'
  ) => {
    if (!data) return null;
    const { item } = data;

    const isCenter = position === 'center';
    const isSide = position === 'left' || position === 'right';
    const isFar = position === 'farLeft' || position === 'farRight';

    return (
      <div
        key={`${item.id}-${position}`}
        className={`
          absolute
          left-1/2
          rounded-[var(--size-8)]
          bg-[var(--surface-gray-3)]
          overflow-hidden
          transition-all
          duration-400
          ease-in-out
          ${isCenter ? 'w-[65%] h-full z-20 cursor-pointer hover:scale-[1.01]' : ''}
          ${isSide ? 'w-[15%] h-[85%] z-10 opacity-70' : ''}
          ${isFar ? 'w-[15%] h-[85%] z-0 opacity-0' : ''}
        `}
        style={{
          transform: getTransform(position, slideDirection),
          transitionDuration: '400ms',
        }}
        onClick={isCenter ? () => onItemClick?.(item) : undefined}
        role={isCenter ? 'button' : undefined}
        tabIndex={isCenter ? 0 : undefined}
        onKeyDown={isCenter ? (e) => { if (e.key === 'Enter' || e.key === ' ') onItemClick?.(item); } : undefined}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.imageAlt ?? item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>
    );
  };

  const getTransform = (position: string, direction: 'left' | 'right' | null) => {
    // Base positions (percentage from center)
    const positions: Record<string, number> = {
      farLeft: -55,
      left: -42,
      center: 0,
      right: 42,
      farRight: 55,
    };

    // Shift amount during animation
    const shift = 42;

    let translateX = positions[position] ?? 0;

    if (direction === 'left') {
      translateX -= shift;
    } else if (direction === 'right') {
      translateX += shift;
    }

    return `translateX(calc(-50% + ${translateX}%))`;
  };

  return (
    <section
      className={`
        bg-[var(--surface-black)]
        px-[var(--size-24)]
        py-[var(--size-24)]
        ${className ?? ''}
      `}
    >
      {/* Filter Tabs */}
      <div className="flex flex-col items-center gap-[var(--size-8)] mb-[var(--size-32)]">
        {label && (
          <span className="text-[color:var(--text-gray-4)] text-[length:var(--size-20)]">
            {label}
          </span>
        )}
        <div className="flex flex-wrap justify-center gap-[var(--size-12)]" role="tablist">
          {allCategories.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => handleCategoryChange(category)}
              className={`
                px-[var(--size-16)]
                py-[var(--size-8)]
                rounded-full
                border
                text-[length:var(--size-14)]
                font-medium
                transition-colors
                cursor-pointer
                ${
                  activeCategory === category
                    ? 'bg-[var(--surface-cyan)] border-[var(--stroke-cyan)] text-[color:var(--text-black)]'
                    : 'bg-transparent border-[var(--stroke-gray-4)] text-[color:var(--text-cyan)] hover:border-[var(--stroke-cyan)]'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel */}
      {filteredItems.length > 0 ? (
        <div className="relative flex items-center justify-center h-[500px]">
          {/* Left Arrow */}
          <button
            onClick={goPrev}
            disabled={isAnimating}
            className="
              absolute left-0 z-30
              w-[var(--size-40)] h-[var(--size-40)]
              rounded-full
              bg-[var(--surface-cyan)]
              flex items-center justify-center
              cursor-pointer
              transition-transform
              hover:scale-110
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            aria-label="Previous item"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="var(--stroke-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Cards Container */}
          <div className="relative flex items-center justify-center w-full h-full overflow-hidden">
            {renderCard(farLeftData, 'farLeft')}
            {renderCard(prevData, 'left')}
            {renderCard(centerData, 'center')}
            {renderCard(nextData, 'right')}
            {renderCard(farRightData, 'farRight')}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goNext}
            disabled={isAnimating}
            className="
              absolute right-0 z-30
              w-[var(--size-40)] h-[var(--size-40)]
              rounded-full
              bg-[var(--surface-cyan)]
              flex items-center justify-center
              cursor-pointer
              transition-transform
              hover:scale-110
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            aria-label="Next item"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="var(--stroke-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      ) : (
        <p className="text-[color:var(--text-gray-4)] text-[length:var(--size-16)] text-center">
          No items to display.
        </p>
      )}
    </section>
  );
};

export default MediaSection;
