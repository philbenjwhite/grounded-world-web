import React from 'react';
import Container from '../Container';

export interface HeaderProps {
  /** Optional className for additional styling */
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={`
        bg-[var(--comp-nav-surface)]
        py-4
        ${className ?? ''}
      `}
    >
      <Container>
        <div className="h-10 w-32 bg-gray-700 rounded" aria-label="Logo placeholder" />
      </Container>
    </header>
  );
};

export default Header;
