"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";
import { LinkedinLogo } from "@phosphor-icons/react";
import Text from "../../atoms/Text";
import Button from "../../atoms/Button";
import NewsletterModal from "../NewsletterModal";
import { resourceLinks } from "../Header/megaMenuData";

export interface FooterProps {
  className?: string;
}

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Work", href: "/our-work" },
  { label: "Contact", href: "/contact" },
];

const footerLinkClass =
  "text-[length:var(--font-size-body-sm)] text-[color:var(--font-color-secondary)] hover:text-[color:var(--font-color-primary)] transition-colors";

const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <footer
        className={cn(
          "w-full bg-(--comp-body-surface)",
          className,
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          {/* Newsletter CTA */}
          <div className="py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Text
                size="body-lg"
                color="primary"
                as="p"
                className="font-semibold"
              >
                Stay grounded
              </Text>
              <Text size="body-sm" color="secondary" as="p" className="mt-1">
                Subscribe for sustainability insights, guides, and updates.
              </Text>
            </div>
            <Button
              variant="primary"
              onClick={() => setModalOpen(true)}
            >
              Subscribe to Newsletter
            </Button>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Nav columns */}
          <div className="py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
            {/* Logo + B-Corp */}
            <div className="col-span-2 md:col-span-1 flex flex-row md:flex-col items-start justify-between md:justify-start gap-6">
              <Link href="/" aria-label="Grounded World home">
                <Image
                  src="/grounded-logo-light.svg"
                  alt="Grounded World"
                  width={140}
                  height={48}
                  className="h-10 w-auto"
                />
              </Link>
              <Image
                src="/bcorp-logo.svg"
                alt="Certified B Corporation"
                width={56}
                height={56}
                className="h-12 w-auto opacity-50 brightness-[10]"
              />
            </div>

            {/* Services */}
            <nav aria-label="Services">
              <Text
                size="body-xs"
                color="primary"
                as="p"
                className="font-semibold uppercase tracking-wider mb-4"
              >
                Services
              </Text>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <Link
                    href="/services"
                    className={footerLinkClass}
                  >
                    All Services
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Resources */}
            <nav aria-label="Resources">
              <Text
                size="body-xs"
                color="primary"
                as="p"
                className="font-semibold uppercase tracking-wider mb-4"
              >
                Resources
              </Text>
              <ul className="flex flex-col gap-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={footerLinkClass}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company */}
            <nav aria-label="Company">
              <Text
                size="body-xs"
                color="primary"
                as="p"
                className="font-semibold uppercase tracking-wider mb-4"
              >
                Company
              </Text>
              <ul className="flex flex-col gap-2.5">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={footerLinkClass}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Bottom bar */}
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <Text size="body-xs" color="tertiary" as="span">
              &copy; {currentYear} Grounded World
            </Text>

            <a
              href="https://www.linkedin.com/company/groundedworld/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--font-color-tertiary)] hover:text-[color:var(--font-color-primary)] transition-colors"
              aria-label="Grounded World on LinkedIn"
            >
              <LinkedinLogo size={20} weight="bold" />
            </a>
          </div>
        </div>
      </footer>

      <NewsletterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default Footer;
