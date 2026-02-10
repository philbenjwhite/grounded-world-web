'use client';

import React, { useRef, useEffect, useSyncExternalStore, useState } from 'react';
import {
  ArrowUpRight,
  Envelope,
  MagnifyingGlass,
  Compass,
  Lightning,
  ChartLineUp,
  IconProps,
} from '@phosphor-icons/react';
import Button from '../../atoms/Button/Button';

/* ─── Hydration helpers ─────────────────────────────── */

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsClient() {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

function detectTouch() {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
}

/* ─── Data ──────────────────────────────────────────── */

interface ServiceItem {
  id: string;
  label: string;
  color: string;
  url: string;
  icon: React.ComponentType<IconProps>;
}

const serviceItems: ServiceItem[] = [
  { id: 'research', label: 'Research', color: '#00AEEF', url: '/services/research', icon: MagnifyingGlass },
  { id: 'strategy', label: 'Strategy', color: '#FFA603', url: '/services/strategy', icon: Compass },
  { id: 'activation', label: 'Activation', color: '#FF08CC', url: '/services/activation', icon: Lightning },
  { id: 'impact', label: 'Impact', color: '#1CC35B', url: '/services/impact', icon: ChartLineUp },
];

const svcPositions = [
  { left: '18%', top: '72%' },
  { left: '24%', top: '24%' },
  { left: '76%', top: '24%' },
  { left: '82%', top: '72%' },
];

const colorMap: Record<string, string> = {
  services: '#00AEEF',
  newsletter: '#FFA603',
};

/* ─── Component ─────────────────────────────────────── */

const ServiceHeroNavSimple: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isClient = useIsClient();
  const isTouchDevice = isClient && detectTouch();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredSvc, setHoveredSvc] = useState<string | null>(null);

  useEffect(() => {
    if (!videoRef.current || !isClient) return;
    const video = videoRef.current;
    const play = async () => {
      try { if (video.paused) await video.play(); } catch { /* silent */ }
    };
    play();
    const onPause = () => setTimeout(play, 100);
    const onVis = () => { if (!document.hidden) play(); };
    video.addEventListener('pause', onPause);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', play);
    const iv = setInterval(() => { if (video.paused) play(); }, 2000);
    return () => {
      video.removeEventListener('pause', onPause);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', play);
      clearInterval(iv);
    };
  }, [isClient]);

  const handleHover = (id: string | null) => { if (!isTouchDevice) setHoveredCard(id); };
  const handleSvcHover = (id: string | null) => { if (!isTouchDevice) setHoveredSvc(id); };

  if (!isClient) {
    return (
      <div className="flex w-full h-screen items-center justify-center" style={{ background: 'var(--background, #0a0a0a)' }}>
        <div style={{ color: 'var(--color-gray-4)' }}>Loading...</div>
      </div>
    );
  }

  const hoveredColor = hoveredCard ? colorMap[hoveredCard] ?? null : null;
  const isSvcHovered = hoveredCard === 'services';
  const isNewsHovered = hoveredCard === 'newsletter';

  return (
    <div className="shn-s-outer" style={{ background: 'var(--background, #0a0a0a)' }}>
      {/* SVG clip-path for L-shape */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="shn-hero-l-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.031 0 H0.969 C0.986 0 1 0.012 1 0.026 V0.686 C1 0.700 0.986 0.712 0.969 0.712 H0.581 C0.564 0.712 0.555 0.724 0.555 0.738 V0.974 C0.555 0.988 0.541 1 0.524 1 H0.031 C0.014 1 0 0.988 0 0.974 V0.026 C0 0.012 0.014 0 0.031 0 Z" />
          </clipPath>
        </defs>
      </svg>

      <style>{`
        @keyframes shnSCardIn {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shnSHeroIn {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shnSAwardsScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes shnSSvcIn {
          from { opacity: 0; transform: translate(-50%, -50%) translateY(14px) scale(0.6); }
          to   { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(1); }
        }

        .shn-s-outer {
          width: 100%;
          min-height: 100vh;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }

        /* ── Single container — all children absolutely positioned ── */
        .shn-s-layout {
          position: relative;
          width: 100%;
          height: calc(100vh - 48px);
        }

        /* ── L-shaped hero: 62% wide, full height, clipped ── */
        .shn-s-hero-l {
          position: absolute;
          top: 0; left: 0;
          width: 62%;
          height: 100%;
          clip-path: url(#shn-hero-l-clip);
          animation: shnSHeroIn 0.9s ease-out both 0.1s;
        }

        /* ── Right column: services + newsletter, top 70% ── */
        .shn-s-right {
          position: absolute;
          top: 0;
          right: 0;
          width: 36%;
          height: 70%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ── Awards + Button: in the cutout, bottom-right ── */
        .shn-s-cutout {
          position: absolute;
          bottom: 0;
          right: 0;
          /* left edge aligns with L-shape inner corner:
             0.555 × 62% hero width ≈ 34.4% + gap */
          left: 36%;
          height: 27%;
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 12px 0 12px 16px;
          animation: shnSCardIn 0.7s ease-out both 0.5s;
        }

        /* ── Dark glass card ── */
        .shn-s-glass {
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .shn-s-glass-link { cursor: pointer; }
        .shn-s-glass-link:hover {
          background: rgba(255, 255, 255, 0.045);
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px) scale(1.005);
        }

        .shn-s-awards-track {
          display: flex;
          gap: 24px;
          animation: shnSAwardsScroll 18s linear infinite;
        }
        .shn-s-awards-track:hover { animation-play-state: paused; }

        @media (min-width: 1200px) {
          .shn-s-outer { padding: 40px; }
          .shn-s-layout { height: calc(100vh - 80px); }
          .shn-s-right { gap: 16px; }
          .shn-s-cutout { gap: 32px; }
        }

        @media (max-width: 768px) {
          .shn-s-outer { padding: 16px; }
          .shn-s-layout { height: auto; display: flex; flex-direction: column; gap: 12px; }
          .shn-s-hero-l {
            position: relative;
            width: 100%;
            height: 400px;
            clip-path: none;
            border-radius: 24px;
            overflow: hidden;
          }
          .shn-s-right {
            position: relative;
            width: 100%;
            height: auto;
            gap: 12px;
          }
          .shn-s-glass { min-height: 200px; }
          .shn-s-cutout {
            position: relative;
            left: auto;
            right: auto;
            bottom: auto;
            height: auto;
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
            padding: 16px 0;
          }
        }
      `}</style>

      {/* Page-level background glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: hoveredColor
            ? `radial-gradient(ellipse 80% 50% at 50% 100%, ${hoveredColor}12, ${hoveredColor}06 40%, transparent 70%)`
            : 'transparent',
          zIndex: 0,
        }}
      />

      <div className="shn-s-layout" style={{ zIndex: 1, position: 'relative' }}>
        {/* ━━━ L-SHAPED HERO (video fills everything) ━━━ */}
        <div className="shn-s-hero-l">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay loop muted playsInline
          >
            <source
              src="https://player.vimeo.com/progressive_redirect/playback/1161946524/rendition/720p/file.mp4%20%28720p%29.mp4?loc=external&log_user=0&signature=ff985305bacd44ceec1d96f384a10daa44f54d5055afc72a0b9ec4ab171053ab"
              type="video/mp4"
            />
          </video>

          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 100%)' }}
          />

          {/* Heading text — sits above the bcorp tail */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10 lg:p-12" style={{ paddingBottom: '34%' }}>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9]"
              style={{ color: '#fff' }}
            >
              Activating Purpose
            </h1>
            <p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light tracking-tight mt-2"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Accelerating Impact
            </p>
          </div>

          {/* B Corp white logo — bottom-left of the L tail */}
          <div className="absolute left-0 bottom-0 p-8 md:p-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bcorp-logo.svg"
              alt="Certified B Corporation"
              className="h-14 md:h-16 lg:h-20 w-auto"
              style={{ opacity: 0.5, filter: 'brightness(10)' }}
            />
          </div>
        </div>

        {/* ━━━ RIGHT COLUMN — services + newsletter (top 70%) ━━━ */}
        <div className="shn-s-right">
          {/* SERVICES — globe + 4 orbiting circles */}
          <div
            className="shn-s-glass shn-s-glass-link flex-1 flex flex-col"
            style={{
              animation: 'shnSCardIn 0.7s ease-out both 0.2s',
              borderColor: isSvcHovered ? `${colorMap.services}30` : undefined,
              boxShadow: isSvcHovered ? `0 0 24px ${colorMap.services}10` : undefined,
            }}
            onMouseEnter={() => handleHover('services')}
            onMouseLeave={() => handleHover(null)}
          >
            <div
              className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
              style={{
                opacity: isSvcHovered ? 1 : 0,
                background: `radial-gradient(ellipse at 50% 100%, ${colorMap.services}12, transparent 60%)`,
                borderRadius: 'inherit',
              }}
            />

            <div className="relative z-10 flex flex-col h-full p-4 md:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--color-gray-4)' }}>Services</p>
                <ArrowUpRight
                  size={16} weight="bold"
                  className="transition-all duration-300"
                  style={{
                    color: isSvcHovered ? colorMap.services : 'transparent',
                    transform: isSvcHovered ? 'translate(0,0) scale(1.15)' : 'translate(-2px,2px) scale(1)',
                  }}
                />
              </div>

              <div className="relative flex-1 mt-2">
                <div
                  className="absolute pointer-events-none"
                  style={{ left: '50%', top: '55%', transform: 'translate(-50%, -50%)', width: '62%', aspectRatio: '1' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/sphere.svg" alt="" className="w-full h-full" />
                </div>

                {serviceItems.map((svc, i) => {
                  const isHovered = hoveredSvc === svc.id;
                  const pos = svcPositions[i];
                  return (
                    <a
                      key={svc.id}
                      href={svc.url}
                      className="absolute flex flex-col items-center gap-1.5 no-underline"
                      style={{
                        left: pos.left,
                        top: pos.top,
                        animation: `shnSSvcIn 0.6s ease-out both`,
                        animationDelay: `${0.4 + i * 0.12}s`,
                      }}
                      onMouseEnter={() => handleSvcHover(svc.id)}
                      onMouseLeave={() => handleSvcHover(null)}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(svc.url, isTouchDevice ? '_self' : '_blank'); }}
                    >
                      <div
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full shrink-0 flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: `${svc.color}${isHovered ? '25' : '10'}`,
                          border: `1.5px solid ${svc.color}${isHovered ? '60' : '25'}`,
                          boxShadow: isHovered ? `0 0 20px ${svc.color}40` : 'none',
                          transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                        }}
                      >
                        <svc.icon size={16} weight="bold" style={{ color: svc.color }} />
                      </div>
                      <span
                        className="text-[10px] md:text-xs font-medium whitespace-nowrap transition-all duration-300"
                        style={{
                          color: isHovered ? 'var(--color-white)' : 'var(--color-gray-4)',
                          opacity: isHovered ? 1 : 0,
                          transform: isHovered ? 'translateY(0)' : 'translateY(-4px)',
                        }}
                      >
                        {svc.label}
                      </span>
                    </a>
                  );
                })}
              </div>

              <p className="text-[10px] md:text-[11px] leading-relaxed mt-2" style={{ color: 'var(--color-gray-4)' }}>
                Moving the needle &mdash; culturally, socially, environmentally and behaviorally.
              </p>
            </div>
          </div>

          {/* NEWSLETTER */}
          <a
            href="/newsletter"
            className="shn-s-glass shn-s-glass-link flex-1 flex items-center no-underline"
            style={{
              animation: 'shnSCardIn 0.7s ease-out both 0.3s',
              borderColor: isNewsHovered ? `${colorMap.newsletter}30` : undefined,
              boxShadow: isNewsHovered ? `0 0 24px ${colorMap.newsletter}10` : undefined,
            }}
            onMouseEnter={() => handleHover('newsletter')}
            onMouseLeave={() => handleHover(null)}
          >
            <div
              className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
              style={{
                opacity: isNewsHovered ? 1 : 0,
                background: `radial-gradient(ellipse at 50% 100%, ${colorMap.newsletter}12, transparent 60%)`,
                borderRadius: 'inherit',
              }}
            />
            <div className="relative z-10 flex flex-col justify-center h-full w-full p-5 md:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--color-gray-4)' }}>Newsletter</p>
                <ArrowUpRight
                  size={16} weight="bold"
                  className="transition-all duration-300"
                  style={{
                    color: isNewsHovered ? colorMap.newsletter : 'transparent',
                    transform: isNewsHovered ? 'translate(0,0) scale(1.15)' : 'translate(-2px,2px) scale(1)',
                  }}
                />
              </div>
              <div className="flex items-center gap-3">
                <Envelope
                  size={28} weight="duotone"
                  className="shrink-0 transition-colors duration-300"
                  style={{ color: isNewsHovered ? colorMap.newsletter : 'rgba(255,255,255,0.2)' }}
                />
                <div>
                  <p className="text-sm md:text-base lg:text-lg font-semibold transition-colors duration-300" style={{ color: isNewsHovered ? 'var(--color-white)' : 'var(--color-gray-3)' }}>
                    Weekly purpose-driven insights
                  </p>
                  <p className="text-[10px] md:text-[11px] mt-1" style={{ color: 'var(--color-gray-4)' }}>Subscribe to stay in the loop</p>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* ━━━ CUTOUT AREA — Awards + Button in the L-shape gap ━━━ */}
        <div className="shn-s-cutout">
          {/* Awards marquee */}
          <div
            className="flex-1 min-w-0 overflow-hidden"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
            }}
          >
            <div className="shn-s-awards-track">
              {[...Array(2)].map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={`${setIndex}-${i}`}
                      className="shrink-0 rounded-md flex items-center justify-center"
                      style={{
                        width: i % 3 === 0 ? 88 : 72,
                        height: 40,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>Award</span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Primary CTA */}
          <div className="shrink-0">
            <Button href="/contact">Get in Touch</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHeroNavSimple;
