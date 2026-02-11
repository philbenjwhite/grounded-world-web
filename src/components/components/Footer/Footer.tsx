import React from "react";
import cn from "classnames";
import Text from "../../atoms/Text";

export interface FooterProps {
  /** Optional className for additional styling */
  className?: string;
}

const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn("w-full py-8 bg-(--comp-body-surface)", className)}>
      <Text
        size="body-xs"
        color="tertiary"
        className="leading-relaxed text-center mt-2"
      >
        &copy; {currentYear} Grounded World
      </Text>
    </footer>
  );
};

export default Footer;
