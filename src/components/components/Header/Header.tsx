'use client';

import React from 'react';
import { ListIcon } from '@phosphor-icons/react';

export interface HeaderProps {
  /** Optional className for additional styling */
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={`shrink-0 flex items-center justify-between px-5 md:px-8 lg:px-10 py-3 md:py-4 ${className ?? ''}`}
      style={{ background: 'var(--background, #0a0a0a)' }}
    >
      {/* Logo */}
      <a href="/" className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/grounded-logo-light.svg"
          alt="Grounded World"
          className="h-10 md:h-12 lg:h-14 w-auto"
        />
      </a>

      {/* Menu icon */}
      <button
        className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: 44,
          height: 44,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        }}
      >
        <ListIcon size={22} weight="bold" style={{ color: 'rgba(255,255,255,0.85)' }} />
      </button>
    </header>
  );
};

export default Header;
