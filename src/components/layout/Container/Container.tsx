import React from "react";
import cn from "classnames";

export interface ContainerProps {
  /** Content to render inside the container */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("max-w-[1280px] mx-auto w-full", className)}>
      {children}
    </div>
  );
};

export default Container;
