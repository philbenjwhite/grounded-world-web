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
            <NavItems services={serviceItems} pathname={pathname} />
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
        <div key={mobileOpen ? "open" : "closed"} className="relative z-10 pt-20 px-6 pb-8 h-full overflow-y-auto">
          {(() => {
            let idx = 0;
            const stagger = () => ({ "--stagger": `${50 + 35 * idx++}ms` } as React.CSSProperties);
            return (
              <>
                <div className="flex flex-col gap-0.5">
                  <MobileLink href="/" label="Home" active={pathname === "/"} style={stagger()} />

                  {serviceItems.length > 0 && (
                    <>
                      <MobileLink
                        href="/services"
                        label="Services"
                        active={isActivePath(pathname, "/services")}
                        style={stagger()}
                      />
                      <div
                        className={cn(styles.mobileSubCard, styles.mobileItem, "ml-1 mb-2 p-2 flex flex-col gap-0.5")}
                        style={stagger()}
                      >
                        {serviceItems.map((svc) => (
                          <Link
                            key={svc.id}
                            href={svc.url}
                            className={cn(
                              styles.mobileServiceLink,
                              "flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-colors duration-200",
                              pathname === svc.url ? "text-white bg-white/[0.04]" : "text-white/50 hover:text-white/80",
                            )}
                          >
                            <div
                              className={cn(styles.mobileServiceOrb, "w-8 h-8 rounded-full shrink-0 flex items-center justify-center")}
                              style={{ "--service-color": svc.color } as React.CSSProperties}
                            >
                              <svc.icon size={14} weight="bold" className={styles.mobileServiceIcon} />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[13px] font-semibold block leading-tight">{svc.label}</span>
                              {svc.description && (
                                <span className="text-[10px] text-white/30 block mt-0.5 leading-snug">{svc.description}</span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}

                  <MobileLink href="/about" label="About Us" active={isActivePath(pathname, "/about")} style={stagger()} />
                  <MobileLink href="/our-work" label="Our Work" active={isActivePath(pathname, "/our-work")} style={stagger()} />

                  <MobileLink href="/resources" label="Resources" active={isActivePath(pathname, "/resources")} style={stagger()} />
                  <div
                    className={cn(styles.mobileSubCard, styles.mobileItem, "ml-1 mb-2 p-2 flex flex-col gap-0.5")}
                    style={stagger()}
                  >
                    {resourceLinks.map((rt) => (
                      <Link
                        key={rt.label}
                        href={rt.href}
                        className={cn(
                          styles.mobileServiceLink,
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-colors duration-200",
                          pathname === rt.href ? "text-white bg-white/[0.04]" : "text-white/50 hover:text-white/80",
                        )}
                      >
                        <div
                          className={cn(styles.mobileServiceOrb, "w-8 h-8 rounded-full shrink-0 flex items-center justify-center")}
                          style={{ "--service-color": rt.color } as React.CSSProperties}
                        >
                          <rt.icon size={14} weight="bold" className={styles.mobileServiceIcon} />
                        </div>
                        <span className="text-[13px] font-semibold">{rt.label}</span>
                      </Link>
                    ))}
                  </div>

                  <MobileLink href="/gaia" label="Ask Gaia" active={isActivePath(pathname, "/gaia")} style={stagger()} />
                </div>

                {/* CTAs */}
                <div className="mt-8 flex flex-col gap-3">
                  <Link
                    href="/newsletter"
                    className={cn(styles.newsletterCta, styles.mobileItem, "px-5 py-3.5 rounded-xl text-sm font-semibold no-underline flex items-center justify-center gap-2")}
                    style={stagger()}
                  >
                    <EnvelopeIcon size={16} weight="bold" />
                    Subscribe to Newsletter
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(styles.ctaButton, styles.mobileItem, "px-5 py-3.5 rounded-xl text-sm font-semibold no-underline text-center")}
                    style={stagger()}
                  >
                    Contact Us
                  </Link>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </>
  );
};

/* ─── Mobile nav helpers ─── */

function MobileLink({
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
        "block px-4 py-3 rounded-xl text-[15px] font-semibold no-underline transition-colors duration-200",
        active
          ? "text-white bg-white/[0.05]"
          : "text-white/50 hover:text-white hover:bg-white/[0.03]",
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
}: {
  services: ServiceItem[];
  pathname: string;
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
        href="/about"
        className={cn(
          styles.navLink,
          "px-3 py-2 text-[13px] font-semibold no-underline whitespace-nowrap",
        )}
        {...(isActivePath(pathname, "/about") && { "data-active": "" })}
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
      <Link
        href="/newsletter"
        className={cn(
          styles.newsletterCta,
          "ml-2 rounded-full no-underline whitespace-nowrap inline-flex items-center justify-center overflow-hidden",
          "w-10 h-10 xl:w-auto xl:h-auto xl:px-5 xl:py-2.5 xl:gap-2",
          "text-[12px] font-semibold",
        )}
        aria-label="Subscribe to newsletter"
      >
        <EnvelopeIcon size={16} weight="bold" className="shrink-0" />
        <span className="hidden xl:inline">Subscribe</span>
      </Link>

      {/* CONTACT US — icon only at lg, full text at xl+ */}
      <Link
        href="/contact"
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
