"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";
import gsap from "gsap";
import { CaretDownIcon, EnvelopeIcon } from "@phosphor-icons/react";
import styles from "./Header.module.css";
import { resourceLinks } from "./megaMenuData";
import { mapCmsServices, type ServiceItem } from "../ServiceHeroNav/utils";
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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const mobileContentRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  /* Close mobile menu on navigation */
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: close menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* Scroll direction → show/hide header */
  useEffect(() => {
    const onScroll = () => {
      if (mobileOpen) return;
      const y = window.scrollY;
      if (y < 20) {
        setHeaderVisible(true);
      } else if (y > lastScrollY.current + 5) {
        setHeaderVisible(false);
      } else if (y < lastScrollY.current - 5) {
        setHeaderVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileOpen]);

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

  /* Mobile: stagger items in on open */
  useEffect(() => {
    if (!mobileContentRef.current || !mobileOpen) return;
    const items =
      mobileContentRef.current.querySelectorAll<HTMLElement>(
        "[data-mobile-item]",
      );
    if (items.length) {
      gsap.fromTo(
        items,
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.035,
          ease: "power2.out",
          delay: 0.05,
        },
      );
    }
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 shrink-0 flex items-center justify-between px-5 md:px-8 lg:px-10 py-3 md:py-4 bg-(--background,#0a0a0a) z-[60]",
          "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          !headerVisible && !mobileOpen && "-translate-y-full",
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

        {/* Mobile hamburger → X morph */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className={cn(
            styles.toggleBtn,
            "lg:hidden shrink-0 relative flex items-center justify-center rounded-full cursor-pointer w-11 h-11",
          )}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span
            className={cn(
              "absolute w-[18px] h-[1.5px] rounded-full bg-white/85 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              mobileOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5",
            )}
          />
          <span
            className={cn(
              "absolute w-[18px] h-[1.5px] rounded-full bg-white/85 transition-all duration-200",
              mobileOpen ? "opacity-0 scale-x-0" : "opacity-100",
            )}
          />
          <span
            className={cn(
              "absolute w-[18px] h-[1.5px] rounded-full bg-white/85 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
              mobileOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5",
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

        <div
          ref={mobileContentRef}
          className="relative z-10 pt-20 px-6 pb-8 h-full overflow-y-auto"
        >
          <div className="flex flex-col gap-0.5">
            <MobileLink
              href="/"
              label="Home"
              active={pathname === "/"}
            />

            {serviceItems.length > 0 && (
              <>
                <MobileLink
                  href="/services"
                  label="Services"
                  active={isActivePath(pathname, "/services")}
                />
                <div
                  className={cn(
                    styles.mobileSubCard,
                    "ml-1 mb-2 p-2 flex flex-col gap-0.5",
                  )}
                  data-mobile-item
                >
                  {serviceItems.map((svc) => (
                    <Link
                      key={svc.id}
                      href={svc.url}
                      className={cn(
                        styles.mobileServiceLink,
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-colors duration-200",
                        pathname === svc.url
                          ? "text-white bg-white/[0.04]"
                          : "text-white/50 hover:text-white/80",
                      )}
                    >
                      <div
                        className={cn(
                          styles.mobileServiceOrb,
                          "w-8 h-8 rounded-full shrink-0 flex items-center justify-center",
                        )}
                        style={
                          {
                            "--service-color": svc.color,
                          } as React.CSSProperties
                        }
                      >
                        <svc.icon
                          size={14}
                          weight="bold"
                          className={styles.mobileServiceIcon}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[13px] font-semibold block leading-tight">
                          {svc.label}
                        </span>
                        {svc.description && (
                          <span className="text-[10px] text-white/30 block mt-0.5 leading-snug">
                            {svc.description}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            <MobileLink
              href="/about"
              label="About Us"
              active={isActivePath(pathname, "/about")}
            />
            <MobileLink
              href="/our-work"
              label="Our Work"
              active={isActivePath(pathname, "/our-work")}
            />

            <MobileLink
              href="/resources"
              label="Resources"
              active={isActivePath(pathname, "/resources")}
            />
            <div
              className={cn(
                styles.mobileSubCard,
                "ml-1 mb-2 p-2 flex flex-col gap-0.5",
              )}
              data-mobile-item
            >
              {resourceLinks.map((rt) => (
                <Link
                  key={rt.label}
                  href={rt.href}
                  className={cn(
                    styles.mobileResourceLink,
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-colors duration-200",
                    pathname === rt.href
                      ? "text-white"
                      : "text-white/50 hover:text-white/80",
                  )}
                >
                  <div
                    className={cn(
                      styles.mobileResourceBar,
                      "w-1 h-6 rounded-full shrink-0",
                    )}
                    style={{ "--accent": rt.accent } as React.CSSProperties}
                  />
                  <span className="text-[13px] font-medium">
                    {rt.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/subscribe"
              className={cn(
                styles.newsletterCta,
                "px-5 py-3.5 rounded-xl text-sm font-semibold no-underline flex items-center justify-center gap-2",
              )}
              data-mobile-item
            >
              <EnvelopeIcon size={16} weight="bold" />
              Subscribe to Newsletter
            </Link>
            <Link
              href="/contact"
              className={cn(
                styles.ctaButton,
                "px-5 py-3.5 rounded-xl text-sm font-semibold no-underline text-center",
              )}
              data-mobile-item
            >
              Contact Us
            </Link>
          </div>
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
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block px-4 py-3 rounded-xl text-[15px] font-semibold no-underline transition-colors duration-200",
        active
          ? "text-white bg-white/[0.05]"
          : "text-white/50 hover:text-white hover:bg-white/[0.03]",
      )}
      data-mobile-item
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
          "px-3 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold no-underline",
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
              "px-3 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold no-underline inline-flex items-center gap-1",
            )}
            {...(isActivePath(pathname, "/services") && { "data-active": "" })}
          >
            Services
            <CaretDownIcon
              size={10}
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
          "px-3 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold no-underline",
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
          "px-3 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold no-underline",
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
            "px-3 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold no-underline inline-flex items-center gap-1",
          )}
          {...(isActivePath(pathname, "/resources") && { "data-active": "" })}
        >
          Resources
          <CaretDownIcon
            size={10}
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
                  "flex items-center gap-2.5 rounded-xl p-3 no-underline",
                )}
              >
                <div
                  className={cn(
                    styles.resourceBar,
                    "w-1 h-5 rounded-full shrink-0",
                  )}
                  style={{ "--accent": rt.accent } as React.CSSProperties}
                />
                <span className="text-xs font-medium">{rt.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* SUBSCRIBE — secondary CTA */}
      <Link
        href="/subscribe"
        className={cn(
          styles.newsletterCta,
          "ml-2 px-4 py-2 rounded-lg text-[11px] uppercase tracking-[0.12em] font-semibold no-underline inline-flex items-center gap-1.5",
        )}
      >
        <EnvelopeIcon size={13} weight="bold" />
        Subscribe
      </Link>

      {/* CONTACT US — primary CTA */}
      <Link
        href="/contact"
        className={cn(
          styles.ctaButton,
          "ml-1 px-5 py-2 rounded-lg text-[11px] uppercase tracking-[0.12em] font-semibold no-underline",
        )}
      >
        Contact Us
      </Link>
    </>
  );
}

export default Header;
