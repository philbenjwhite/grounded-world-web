import React from 'react';

export interface ContainerProps {
  /** Content to render inside the container */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={`
        max-w-[1440px]
        mx-auto
        w-full
        ${className ?? ''}
      `}
    >
      {children}
    </div>
  );
};

export default Container;
