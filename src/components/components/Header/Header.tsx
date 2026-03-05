"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";
import { CaretDownIcon, EnvelopeIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import styles from "./Header.module.css";
import { resourceLinks } from "./megaMenuData";
import { mapCmsServices, type ServiceItem } from "../VideoHero/utils";
import type { Service } from "../../../../tina/__generated__/types";
import NewsletterModal from "../NewsletterModal/NewsletterModal";

export interface HeaderProps {
  className?: string;
  services?: Service[];
}

function isActivePath(current: string, href: string): boolean {
  if (href === "/") return current === "/";
  return current === href || current.startsWith(href + "/");
}

const Header = ({ className, services = [] }: HeaderProps) => {
  const serviceItems = mapCmsServices(services);
  const pathname = usePathname() ?? "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  /* Close mobile menu on navigation */
  useEffect(() => setMobileOpen(false), [pathname]);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* Scroll → toggle glass effect */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Desktop: slide active indicator to current nav link */
  useEffect(() => {
    const nav = navRef.current;
    const bar = indicatorRef.current;
    if (!nav || !bar) return;

    const update = () => {
      const el = nav.querySelector<HTMLElement>("[data-active]");
      if (!el) {
        bar.style.opacity = "0";
        return;
      }
      const navR = nav.getBoundingClientRect();
      const elR = el.getBoundingClientRect();
      bar.style.transform = `translateX(${elR.left - navR.left}px)`;
      bar.style.width = `${elR.width}px`;
      bar.style.opacity = "1";
    };

    requestAnimationFrame(update);
    const ro = new ResizeObserver(update);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [pathname]);


  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[60] px-[var(--layout-section-padding-x)] pt-3",
          className,
        )}
      >
        <div className={styles.headerFade} aria-hidden="true" />
        <div
          className={cn(
            styles.headerBar,
            scrolled && styles.headerScrolled,
            "max-w-[1440px] mx-auto flex items-center justify-between px-5 md:px-6 lg:px-8 py-2.5 md:py-3 rounded-full",
          )}
        >
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/grounded-logo-light.svg"
              alt="Grounded World"
              width={160}
              height={56}
              className="h-9 md:h-10 lg:h-12 w-auto"
              priority
            />
          </Link>

          {/* Mobile hamburger → X morph */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              styles.toggleBtn,
              "lg:hidden shrink-0 relative flex items-center justify-center cursor-pointer w-10 h-10",
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={cn(
                "absolute w-6 h-[2px] rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                mobileOpen ? "translate-y-0 rotate-45" : "-translate-y-[5px]",
              )}
            />
            <span
              className={cn(
                "absolute w-6 h-[2px] rounded-full bg-white transition-all duration-200",
                mobileOpen ? "opacity-0 scale-x-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "absolute w-6 h-[2px] rounded-full bg-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-[5px]",
              )}
            />
          </button>

          {/* Desktop nav — always visible lg+ */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center gap-1 relative"
            aria-label="Main navigation"
          >
            <NavItems services={serviceItems} pathname={pathname} onSubscribeClick={() => setNewsletterOpen(true)} />
            <span ref={indicatorRef} className={styles.activeIndicator} />
          </nav>
        </div>
      </header>

      {/* ─── Mobile menu overlay ─── */}
      <div
        className={cn(
          "fixed inset-0 z-[55] lg:hidden transition-all duration-300",
          mobileOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none",
        )}
      >
        <div className={cn(styles.mobileOverlay, "absolute inset-0")} />

        {/* key forces remount so CSS animations replay on each open */}
        <div key={mobileOpen ? "open" : "closed"} className="relative z-10 pt-24 px-6 pb-[calc(env(safe-area-inset-bottom)+80px)] h-full overflow-y-auto flex items-center">
          {(() => {
            let idx = 0;
            const stagger = () => ({ "--stagger": `${50 + 35 * idx++}ms` } as React.CSSProperties);
            return (
              <nav className="flex flex-col w-full text-center">
                <MobileNavLink href="/" label="Home" active={pathname === "/"} style={stagger()} />

                <MobileNavLink
                  href="/services"
                  label="Services"
                  active={isActivePath(pathname, "/services")}
                  style={stagger()}
                />
                {serviceItems.length > 0 && (
                  <div className={cn(styles.mobileItem, "flex flex-wrap justify-center gap-x-4 gap-y-1 mb-2")} style={stagger()}>
                    {serviceItems.map((svc) => (
                      <Link
                        key={svc.id}
                        href={svc.url}
                        className={cn(
                          "py-1 no-underline text-[13px] transition-colors duration-150",
                          pathname === svc.url ? "text-white/70 font-medium" : "text-white/25 hover:text-white/50",
                        )}
                      >
                        {svc.label}
                      </Link>
                    ))}
                  </div>
                )}

                <MobileNavLink href="/about-us" label="About Us" active={isActivePath(pathname, "/about-us")} style={stagger()} />
                <MobileNavLink href="/our-work" label="Our Work" active={isActivePath(pathname, "/our-work")} style={stagger()} />

                <MobileNavLink
                  href="/resources"
                  label="Resources"
                  active={isActivePath(pathname, "/resources")}
                  style={stagger()}
                />
                <div className={cn(styles.mobileItem, "flex flex-wrap justify-center gap-x-4 gap-y-1 mb-2")} style={stagger()}>
                  {resourceLinks.map((rt) => (
                    <Link
                      key={rt.label}
                      href={rt.href}
                      className={cn(
                        "py-1 no-underline text-[13px] transition-colors duration-150",
                        pathname === rt.href ? "text-white/70 font-medium" : "text-white/25 hover:text-white/50",
                      )}
                    >
                      {rt.label}
                    </Link>
                  ))}
                </div>

                <MobileNavLink href="/gaia" label="Ask Gaia" active={isActivePath(pathname, "/gaia")} style={stagger()} />
              </nav>
            );
          })()}
        </div>

        {/* ── Fixed bottom CTAs ── */}
        <div className={cn(styles.mobileBottomBar, "absolute bottom-0 left-0 right-0 z-20 px-6 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-5 flex gap-3")}>
          <button
            type="button"
            onClick={() => { setMobileOpen(false); setNewsletterOpen(true); }}
            className={cn(styles.newsletterCta, "flex-1 py-3.5 rounded-full text-[13px] font-semibold flex items-center justify-center gap-2 cursor-pointer")}
          >
            <EnvelopeIcon size={14} weight="bold" />
            Subscribe
          </button>
          <Link
            href="/contact-us"
            className={cn(styles.ctaButton, "flex-1 py-3.5 rounded-full text-[13px] font-bold no-underline flex items-center justify-center")}
          >
            Contact Us
          </Link>
        </div>
      </div>

      <NewsletterModal open={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </>
  );
};

/* ─── Mobile nav helpers ─── */

function MobileNavLink({
  href,
  label,
  active,
  style,
}: {
  href: string;
  label: string;
  active: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      href={href}
      className={cn(
        styles.mobileItem,
        "block py-2.5 no-underline text-[28px] font-bold tracking-[-0.02em] transition-colors duration-150",
        active ? styles.mobileActiveLink : "text-white/20 hover:text-white/45",
      )}
      style={style}
    >
      {label}
    </Link>
  );
}

/* ─── Desktop nav items ─── */

function NavItems({
  services,
  pathname,
  onSubscribeClick,
}: {
  services: ServiceItem[];
  pathname: string;
  onSubscribeClick: () => void;
}) {
  return (
    <>
      {/* HOME */}
      <Link
        href="/"
        className={cn(
          styles.navLink,
          "px-3 py-2 text-[13px] font-semibold no-underline whitespace-nowrap",
        )}
        {...(pathname === "/" && { "data-active": "" })}
      >
        Home
      </Link>

      {/* SERVICES dropdown */}
      {services.length > 0 && (
        <div className={styles.dropdownGroup}>
          <Link
            href="/services"
            className={cn(
              styles.navLink,
              "px-3 py-2 text-[13px] font-semibold no-underline whitespace-nowrap inline-flex items-center gap-1",
            )}
            {...(isActivePath(pathname, "/services") && { "data-active": "" })}
          >
            Services
            <CaretDownIcon
              size={11}
              weight="bold"
              className={styles.chevron}
            />
          </Link>

          <div className={cn(styles.dropdown, "min-w-[320px] p-4")}>
            <div className="grid grid-cols-1 gap-1">
              <Link
                href="/services"
                className={cn(
                  styles.dropdownLink,
                  "flex items-center gap-3 rounded-xl p-3 no-underline",
                )}
              >
                <span className="text-xs font-semibold text-[color:var(--color-white)]">
                  Overview
                </span>
              </Link>

              {services.map((svc) => (
                <Link
                  key={svc.id}
                  href={svc.url}
                  className={cn(
                    styles.dropdownLink,
                    "flex items-center gap-3 rounded-xl p-3 no-underline",
                  )}
                >
                  <div
                    className={cn(
                      styles.serviceOrb,
                      "w-8 h-8 rounded-full shrink-0 flex items-center justify-center",
                    )}
                    style={
                      { "--service-color": svc.color } as React.CSSProperties
                    }
                  >
                    <svc.icon
                      size={14}
                      weight="bold"
                      className={styles.serviceIcon}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold block">
                      {svc.label}
                    </span>
                    {svc.description && (
                      <span className="text-[10px] text-[color:var(--color-gray-4)] block mt-0.5">
                        {svc.description}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABOUT US */}
      <Link
        href="/about-us"
        className={cn(
          styles.navLink,
          "px-3 py-2 text-[13px] font-semibold no-underline whitespace-nowrap",
        )}
        {...(isActivePath(pathname, "/about-us") && { "data-active": "" })}
      >
        About Us
      </Link>

      {/* OUR WORK */}
      <Link
        href="/our-work"
        className={cn(
          styles.navLink,
          "px-3 py-2 text-[13px] font-semibold no-underline whitespace-nowrap",
        )}
        {...(isActivePath(pathname, "/our-work") && { "data-active": "" })}
      >
        Our Work
      </Link>

      {/* RESOURCES dropdown */}
      <div className={styles.dropdownGroup}>
        <Link
          href="/resources"
          className={cn(
            styles.navLink,
            "px-3 py-2 text-[13px] font-semibold no-underline whitespace-nowrap inline-flex items-center gap-1",
          )}
          {...(isActivePath(pathname, "/resources") && { "data-active": "" })}
        >
          Resources
          <CaretDownIcon
            size={11}
            weight="bold"
            className={styles.chevron}
          />
        </Link>

        <div className={cn(styles.dropdown, "min-w-[260px] p-4")}>
          <div className="grid grid-cols-1 gap-1">
            <Link
              href="/resources"
              className={cn(
                styles.dropdownLink,
                "flex items-center gap-3 rounded-xl p-3 no-underline",
              )}
            >
              <span className="text-xs font-semibold text-[color:var(--color-white)]">
                Overview
              </span>
            </Link>

            {resourceLinks.map((rt) => (
              <Link
                key={rt.label}
                href={rt.href}
                className={cn(
                  styles.dropdownLink,
                  "flex items-center gap-3 rounded-xl p-3 no-underline",
                )}
              >
                <div
                  className={cn(
                    styles.serviceOrb,
                    "w-8 h-8 rounded-full shrink-0 flex items-center justify-center",
                  )}
                  style={{ "--service-color": rt.color } as React.CSSProperties}
                >
                  <rt.icon
                    size={14}
                    weight="bold"
                    className={styles.serviceIcon}
                  />
                </div>
                <span className="text-xs font-semibold">{rt.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ASK GAIA */}
      <Link
        href="/gaia"
        className={cn(
          styles.navLink,
          "px-3 py-2 text-[13px] font-semibold no-underline whitespace-nowrap",
        )}
        {...(isActivePath(pathname, "/gaia") && { "data-active": "" })}
      >
        Ask Gaia
      </Link>

      {/* SUBSCRIBE — icon only at lg, full text at xl+ */}
      <button
        type="button"
        onClick={onSubscribeClick}
        className={cn(
          styles.newsletterCta,
          "ml-2 rounded-full whitespace-nowrap inline-flex items-center justify-center overflow-hidden cursor-pointer",
          "w-10 h-10 xl:w-auto xl:h-auto xl:px-5 xl:py-2.5 xl:gap-2",
          "text-[12px] font-semibold",
        )}
        aria-label="Subscribe to newsletter"
      >
        <EnvelopeIcon size={16} weight="bold" className="shrink-0" />
        <span className="hidden xl:inline">Subscribe</span>
      </button>

      {/* CONTACT US — icon only at lg, full text at xl+ */}
      <Link
        href="/contact-us"
        className={cn(
          styles.ctaButton,
          "ml-1 rounded-full no-underline whitespace-nowrap inline-flex items-center justify-center overflow-hidden",
          "w-10 h-10 xl:w-auto xl:h-auto xl:px-6 xl:py-2.5 xl:gap-2",
          "text-[12px] font-semibold",
        )}
        aria-label="Contact us"
      >
        <PaperPlaneTiltIcon size={16} weight="bold" className="shrink-0" />
        <span className="hidden xl:inline">Contact Us</span>
      </Link>
    </>
  );
}

export default Header;
