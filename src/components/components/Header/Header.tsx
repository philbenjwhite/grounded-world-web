"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";
import { ListIcon } from "@phosphor-icons/react";

export interface HeaderProps {
  /** Optional className for additional styling */
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "shrink-0 flex items-center justify-between px-5 md:px-8 lg:px-10 py-3 md:py-4 bg-(--background,#0a0a0a)",
        className,
      )}
    >
      {/* Logo */}
      <Link href="/" className="shrink-0">
        <Image
          src="/grounded-logo-light.svg"
          alt="Grounded World"
          width={160}
          height={56}
          className="h-10 md:h-12 lg:h-14 w-auto"
          priority
        />
      </Link>

      {/* Menu icon */}
      <button
        className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer w-11 h-11 bg-white/6 border border-white/8 backdrop-blur-md hover:bg-white/12 hover:border-white/18"
      >
        <ListIcon
          size={22}
          weight="bold"
          className="text-white/85"
        />
      </button>
    </header>
  );
};

export default Header;
