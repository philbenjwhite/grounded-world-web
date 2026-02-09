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
  /** Section heading (used in grid variant) */
  title?: string;
  /** Label displayed above the filter tabs (used in carousel variant) */
  label?: string;
  /** Category labels for filter tabs ("All" is prepended automatically) */
  categories: string[];
  /** Media items to render */
  items: MediaItem[];
  /** Layout variant: "grid" for bento grid, "carousel" for sliding carousel */
  variant?: 'grid' | 'carousel';
  /** Callback when a media item is clicked */
  onItemClick?: (item: MediaItem) => void;
  /** Callback when the active filter changes */
  onFilterChange?: (category: string) => void;
  /** Initially selected category (defaults to "All") */
  defaultCategory?: string;
  /** Optional className for the root container */
  className?: string;
}

// =============================================================================
// GRID VARIANT (Concept A)
// =============================================================================

function getGridPlacement(index: number): React.CSSProperties {
  const groupIndex = index % 6;
  const groupNumber = Math.floor(index / 6);
  const rowOffset = groupNumber * 4;

  const placements: Record<number, { col: string; rowStart: number; rowSpan: number }> = {
    0: { col: '1 / 2', rowStart: 1, rowSpan: 1 },
    1: { col: '1 / 2', rowStart: 2, rowSpan: 1 },
    2: { col: '2 / 4', rowStart: 1, rowSpan: 2 },
    3: { col: '1 / 3', rowStart: 3, rowSpan: 2 },
    4: { col: '3 / 4', rowStart: 3, rowSpan: 1 },
    5: { col: '3 / 4', rowStart: 4, rowSpan: 1 },
  };

  const p = placements[groupIndex];
  const actualRowStart = p.rowStart + rowOffset;
  const actualRowEnd = actualRowStart + p.rowSpan;

  return {
    gridColumn: p.col,
    gridRow: `${actualRowStart} / ${actualRowEnd}`,
  };
}

interface GridViewProps {
  title?: string;
  categories: string[];
  filteredItems: MediaItem[];
  activeCategory: string;
  allCategories: string[];
  onCategoryChange: (category: string) => void;
  onItemClick?: (item: MediaItem) => void;
  className?: string;
}

const GridView = ({
  title,
  filteredItems,
  activeCategory,
  allCategories,
  onCategoryChange,
  onItemClick,
  className,
}: GridViewProps) => {
  return (
    <section
      className={`
        bg-[var(--comp-media-section-surface)]
        px-[var(--layout-section-padding-x)]
        py-[var(--layout-section-padding-y)]
        ${className ?? ''}
      `}
    >
      {/* Header */}
      <div className="flex flex-col gap-[var(--size-16)] mb-[var(--layout-section-gap)] lg:flex-row lg:items-center lg:justify-between">
        {title && (
          <h2
            className="
              text-[length:var(--font-size-h2)]
              font-bold
              text-[color:var(--comp-media-section-title)]
            "
          >
            {title}
          </h2>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-[var(--layout-tab-tab-gap)]" role="tablist">
          {allCategories.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => onCategoryChange(category)}
              className={`
                px-[var(--layout-tab-padding-x)]
                py-[var(--layout-tab-padding-y)]
                rounded-full
                border
                text-[length:var(--font-size-body-sm)]
                font-medium
                transition-colors
                cursor-pointer
                ${
                  activeCategory === category
                    ? 'bg-[var(--comp-tab-surface-active)] border-[var(--comp-tab-stroke-active)] text-[color:var(--comp-tab-text-active)]'
                    : 'bg-[var(--comp-tab-surface-default)] border-[var(--comp-tab-stroke-default)] text-[color:var(--comp-tab-text-default)] hover:bg-[var(--comp-tab-surface-hover)] hover:border-[var(--comp-tab-stroke-hover)]'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 auto-rows-[250px] gap-[var(--comp-media-section-gap)]">
          {filteredItems.map((item, index) => {
            const placement = getGridPlacement(index);
            return (
              <div
                key={item.id}
                className="
                  media-grid-item
                  rounded-[var(--comp-media-section-item-radius)]
                  bg-[var(--comp-media-section-item-surface)]
                  overflow-hidden
                  transition-colors
                  hover:bg-[var(--color-magenta)]
                  cursor-pointer
                "
                style={placement}
                onClick={() => onItemClick?.(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onItemClick?.(item);
                }}
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
          })}
        </div>
      ) : (
        <p className="text-[color:var(--color-gray-4)] text-[length:var(--font-size-body-md)]">
          No items to display.
        </p>
      )}
    </section>
  );
};

// =============================================================================
// CAROUSEL VARIANT (Concept B)
// =============================================================================

interface CarouselViewProps {
  label?: string;
  filteredItems: MediaItem[];
  activeCategory: string;
  allCategories: string[];
  onCategoryChange: (category: string) => void;
  onItemClick?: (item: MediaItem) => void;
  className?: string;
}

const CarouselView = ({
  label,
  filteredItems,
  activeCategory,
  allCategories,
  onCategoryChange,
  onItemClick,
  className,
}: CarouselViewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCategoryChangeInternal = (category: string) => {
    setCurrentIndex(0);
    onCategoryChange(category);
  };

  const goNext = useCallback(() => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const goPrev = useCallback(() => {
    if (filteredItems.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length]);

  const getVisibleItem = (offset: number) => {
    if (filteredItems.length === 0) return null;
    const idx = (currentIndex + offset + filteredItems.length) % filteredItems.length;
    return filteredItems[idx];
  };

  const prevItem = getVisibleItem(-1);
  const centerItem = getVisibleItem(0);
  const nextItem = getVisibleItem(1);

  const renderCard = (item: MediaItem | null, variant: 'prev' | 'center' | 'next') => {
    if (!item) return null;

    const isCenter = variant === 'center';

    return (
      <div
        key={`${item.id}-${variant}`}
        className={`
          rounded-[var(--comp-media-section-item-radius)]
          bg-[var(--comp-media-section-item-surface)]
          overflow-hidden
          transition-all
          duration-300
          ease-in-out
          flex-shrink-0
          ${isCenter
            ? 'w-[60%] h-full z-20 cursor-pointer hover:scale-[1.01]'
            : 'w-[18%] h-[80%] z-10 opacity-50'
          }
        `}
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

  return (
    <section
      className={`
        bg-[var(--comp-media-section-surface)]
        px-[var(--layout-section-padding-x)]
        py-[var(--layout-section-padding-y)]
        ${className ?? ''}
      `}
    >
      {/* Filter Tabs */}
      <div className="flex flex-col items-center gap-[var(--size-8)] mb-[var(--layout-section-gap)]">
        {label && (
          <span className="text-[color:var(--color-gray-4)] text-[length:var(--font-size-body-xl)]">
            {label}
          </span>
        )}
        <div className="flex flex-wrap justify-center gap-[var(--layout-tab-tab-gap)]" role="tablist">
          {allCategories.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => handleCategoryChangeInternal(category)}
              className={`
                px-[var(--layout-tab-padding-x)]
                py-[var(--layout-tab-padding-y)]
                rounded-full
                border
                text-[length:var(--font-size-body-sm)]
                font-medium
                transition-colors
                cursor-pointer
                ${
                  activeCategory === category
                    ? 'bg-[var(--comp-tab-surface-active)] border-[var(--comp-tab-stroke-active)] text-[color:var(--comp-tab-text-active)]'
                    : 'bg-[var(--comp-tab-surface-default)] border-[var(--comp-tab-stroke-default)] text-[color:var(--comp-tab-text-default)] hover:bg-[var(--comp-tab-surface-hover)] hover:border-[var(--comp-tab-stroke-hover)]'
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
        <div className="relative flex items-center h-[500px]">
          {/* Left Arrow */}
          <button
            onClick={goPrev}
            className="
              absolute left-4 z-30
              w-[var(--size-40)] h-[var(--size-40)]
              rounded-full
              bg-[var(--color-cyan)]
              flex items-center justify-center
              cursor-pointer
              transition-transform
              hover:scale-110
            "
            aria-label="Previous item"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="var(--color-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Cards - using flexbox */}
          <div className="flex items-center justify-center gap-4 w-full h-full">
            {renderCard(prevItem, 'prev')}
            {renderCard(centerItem, 'center')}
            {renderCard(nextItem, 'next')}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goNext}
            className="
              absolute right-4 z-30
              w-[var(--size-40)] h-[var(--size-40)]
              rounded-full
              bg-[var(--color-cyan)]
              flex items-center justify-center
              cursor-pointer
              transition-transform
              hover:scale-110
            "
            aria-label="Next item"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="var(--color-black)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      ) : (
        <p className="text-[color:var(--color-gray-4)] text-[length:var(--font-size-body-md)] text-center">
          No items to display.
        </p>
      )}
    </section>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const MediaSection = ({
  title = 'Section title',
  label = 'Tabs',
  categories,
  items,
  variant = 'grid',
  onItemClick,
  onFilterChange,
  defaultCategory = 'All',
  className,
}: MediaSectionProps) => {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  const allCategories = useMemo(() => ['All', ...categories], [categories]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    onFilterChange?.(category);
  };

  if (variant === 'carousel') {
    return (
      <CarouselView
        label={label}
        filteredItems={filteredItems}
        activeCategory={activeCategory}
        allCategories={allCategories}
        onCategoryChange={handleCategoryChange}
        onItemClick={onItemClick}
        className={className}
      />
    );
  }

  return (
    <GridView
      title={title}
      categories={categories}
      filteredItems={filteredItems}
      activeCategory={activeCategory}
      allCategories={allCategories}
      onCategoryChange={handleCategoryChange}
      onItemClick={onItemClick}
      className={className}
    />
  );
};

export default MediaSection;
