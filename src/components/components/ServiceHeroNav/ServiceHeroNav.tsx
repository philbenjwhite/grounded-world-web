'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Envelope,
  List,
  MagnifyingGlass,
  Compass,
  Lightning,
  ChartLineUp,
  IconProps,
} from '@phosphor-icons/react';

/* ─── Data ──────────────────────────────────────────── */

interface ServiceItem {
  id: string;
  label: string;
  color: string;
  description: string;
  url: string;
  icon: React.ComponentType<IconProps>;
}

const serviceItems: ServiceItem[] = [
  { id: 'research', label: 'Research', color: '#00AEEF', description: 'User needs & behavioral insights', url: '/services/research', icon: MagnifyingGlass },
  { id: 'strategy', label: 'Strategy', color: '#FFA603', description: 'Roadmaps & strategic frameworks', url: '/services/strategy', icon: Compass },
  { id: 'activation', label: 'Activation', color: '#FF08CC', description: 'Design systems & interfaces', url: '/services/activation', icon: Lightning },
  { id: 'impact', label: 'Impact', color: '#1CC35B', description: 'Analytics & optimization', url: '/services/impact', icon: ChartLineUp },
];

const workPlaceholders = [
  { title: 'Brand Activation Campaign', tag: 'Case Study', accent: '#00AEEF' },
  { title: 'Digital Transformation', tag: 'Featured', accent: '#FF08CC' },
  { title: 'Sustainability Impact Report', tag: 'Research', accent: '#1CC35B' },
  { title: 'Community Platform', tag: 'Product', accent: '#FFA603' },
];

const resourceTypes = [
  { label: 'Podcast', accent: '#00AEEF', url: '/resources/podcast' },
  { label: 'White Papers', accent: '#1CC35B', url: '/resources/white-papers' },
  { label: 'How To Guides', accent: '#FF08CC', url: '/resources/guides' },
  { label: 'Articles & Blogs', accent: '#FFA603', url: '/resources/articles' },
];

const colorMap: Record<string, string> = {
  research: '#00AEEF', strategy: '#FFA603', activation: '#FF08CC', impact: '#1CC35B',
  'about-us': '#4DD9FF', 'our-work': '#B1B3B6', resources: '#0077B5',
  newsletter: '#FFA603',
};

/* ─── Component ─────────────────────────────────────── */

const ServiceHeroNav: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeWork, setActiveWork] = useState(0);
  const svcCanvasRef = useRef<HTMLCanvasElement>(null);
  const svcParticlesRef = useRef<Array<{ x: number; y: number; vy: number; vx: number; size: number; life: number; color: string }>>([]);
  const svcAnimRef = useRef<number>(0);
  const hoveredNavRef = useRef<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setIsTouchDevice(
      'ontouchstart' in window || navigator.maxTouchPoints > 0 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  }, []);

  // Video playback
  useEffect(() => {
    if (!videoRef.current || !isClient) return;
    const video = videoRef.current;
    const play = async () => { try { if (video.paused) await video.play(); } catch { /* silent */ } };
    play();
    const onPause = () => setTimeout(play, 100);
    const onVis = () => { if (!document.hidden) play(); };
    video.addEventListener('pause', onPause);
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', play);
    const iv = setInterval(() => { if (video.paused) play(); }, 2000);
    return () => { video.removeEventListener('pause', onPause); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('focus', play); clearInterval(iv); };
  }, [isClient]);

  // Sync hover state to ref for particle animation loop
  useEffect(() => { hoveredNavRef.current = hoveredNav; }, [hoveredNav]);

  // Particle animation for services card
  useEffect(() => {
    if (!isClient) return;
    const canvas = svcCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;
    const animate = () => {
      if (!running) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const hov = hoveredNavRef.current;
      const svc = hov ? serviceItems.find(s => s.id === hov) : null;
      if (svc && svcParticlesRef.current.length < 35) {
        svcParticlesRef.current.push({
          x: Math.random() * w,
          y: h + 2,
          vy: -(Math.random() * 0.6 + 0.2),
          vx: (Math.random() - 0.5) * 0.2,
          size: Math.random() * 1.5 + 0.5,
          life: 1,
          color: svc.color,
        });
      }
      svcParticlesRef.current = svcParticlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.006;
        if (p.life <= 0) return false;
        const a = Math.min(p.life * 0.4, 0.2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(a * 255).toString(16).padStart(2, '0');
        ctx.fill();
        return true;
      });
      svcAnimRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { running = false; cancelAnimationFrame(svcAnimRef.current); };
  }, [isClient]);

  const handleHover = (id: string | null) => {
    setHoveredNav(id);
  };

  const nextWork = () => setActiveWork((p) => (p + 1) % workPlaceholders.length);

  if (!isClient) {
    return <div className="flex flex-col w-full h-screen overflow-hidden" style={{ background: 'var(--background, #0a0a0a)' }}><div className="flex-1 flex items-center justify-center"><div style={{ color: 'var(--color-gray-4)' }}>Loading...</div></div></div>;
  }

  const hoveredColor = hoveredNav ? colorMap[hoveredNav] : null;
  const isNewsHovered = hoveredNav === 'newsletter';
  const isWorkHovered = hoveredNav === 'our-work';
  const isResourcesHovered = hoveredNav === 'resources';
  const isAboutHovered = hoveredNav === 'about-us';

  return (
    <div className="shn-outer flex flex-col w-full h-screen overflow-hidden" style={{ background: 'var(--background, #0a0a0a)' }}>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes heroIn {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes svcItemIn {
          from { opacity: 0; transform: translate(-50%, -50%) translateY(14px) scale(0.6); }
          to   { opacity: 1; transform: translate(-50%, -50%) translateY(0) scale(1); }
        }
        @keyframes awardsScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes globeDrift {
          0%, 100% { transform: translateX(0px); }
          50%      { transform: translateX(-8px); }
        }
        .bento-grid {
          display: grid;
          grid-template-areas:
            "hero      hero      hero      services  services"
            "hero      hero      hero      services  services"
            "hero      hero      hero      work      work"
            "about     resources resources work      work"
            "about     resources resources work      work"
            "about     resources resources news      news";
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          grid-template-rows: 1fr 0.7fr 1fr 0.7fr 0.7fr 0.4fr;
          gap: 8px;
          width: 100%;
          height: 100%;
        }

        .bcard {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          overflow: hidden;
          position: relative;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .bcard-link { cursor: pointer; }
        .bcard-link:hover {
          background: rgba(255, 255, 255, 0.045);
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px) scale(1.008);
        }

        .awards-track {
          display: flex;
          gap: 32px;
          animation: awardsScroll 20s linear infinite;
        }
        .awards-track:hover { animation-play-state: paused; }

        @media (max-width: 768px) {
          .shn-outer {
            height: auto;
            min-height: 100vh;
            overflow-y: auto;
          }
          .shn-grid-wrap {
            flex: none;
            min-height: auto;
          }
          .bento-grid {
            grid-template-areas:
              "hero"
              "services"
              "work"
              "resources"
              "about"
              "news";
            grid-template-columns: 1fr;
            grid-template-rows: 300px 380px 320px 180px 180px 72px;
            gap: 6px;
          }
        }
      `}</style>

      {/* ─── HEADER ────────────────────────────────────────────────
           TODO: Replace with dedicated <Header /> component.
           This is a placeholder layout — logo + menu icon only.
           Nav links intentionally omitted since this page's bento
           grid already surfaces the same destinations.
           ───────────────────────────────────────────────────────── */}
      <header
        className="shrink-0 flex items-center justify-between px-5 md:px-8 lg:px-10 py-3 md:py-4"
      >
        {/* Logo */}
        <a href="/" className="shrink-0">
          <img
            src="/grounded-logo-light.svg"
            alt="Grounded World"
            className="h-10 md:h-12 lg:h-14 w-auto"
          />
        </a>

        {/* Menu icon */}
        <button
          className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
          style={{
            width: 44,
            height: 44,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          }}
        >
          <List size={22} weight="bold" style={{ color: 'rgba(255,255,255,0.85)' }} />
        </button>
      </header>

      {/* Page-level background glow — responds to hovered card */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: hoveredColor
            ? `radial-gradient(ellipse 80% 50% at 50% 100%, ${hoveredColor}12, ${hoveredColor}06 40%, transparent 70%)`
            : 'transparent',
          zIndex: 0,
        }}
      />

      {/* ─── BENTO GRID ─── */}
      <div className="shn-grid-wrap flex-1 min-h-0 p-2 md:p-3 relative z-10">
        <div className="bento-grid">

          {/* ━━━ HERO (3×3 — dominant) ━━━ */}
          <div
            className="bcard"
            style={{
              gridArea: 'hero',
              borderRadius: '32px 24px 24px 24px',
              animation: 'heroIn 1s ease-out both',
              animationDelay: '0.1s',
              backdropFilter: 'none', WebkitBackdropFilter: 'none',
            }}
          >
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline style={{ borderRadius: 'inherit' }}>
              <source src="https://player.vimeo.com/progressive_redirect/playback/1161946524/rendition/720p/file.mp4%20%28720p%29.mp4?loc=external&log_user=0&signature=ff985305bacd44ceec1d96f384a10daa44f54d5055afc72a0b9ec4ab171053ab" type="video/mp4" />
            </video>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 100%)', borderRadius: 'inherit' }} />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-[0.9]" style={{ color: 'var(--color-white)' }}>
                Activating Purpose
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-light tracking-tight mt-1 md:mt-2" style={{ color: 'var(--color-gray-3)' }}>
                Accelerating Impact
              </p>

              {/* ─── AWARDS MARQUEE ──────────────────────────────────
                   TODO: Replace placeholder rectangles with actual
                   award logos / images. This infinite-scroll carousel
                   auto-animates right→left and pauses on hover.
                   ──────────────────────────────────────────────────── */}
              <div className="mt-4 md:mt-6 overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
                <div className="awards-track">
                  {/* Duplicate set for seamless loop */}
                  {[...Array(2)].map((_, setIndex) => (
                    <React.Fragment key={setIndex}>
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={`${setIndex}-${i}`}
                          className="shrink-0 rounded-md flex items-center justify-center"
                          style={{
                            width: i % 3 === 0 ? 100 : 80,
                            height: 36,
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
            </div>
          </div>

          {/* ━━━ SERVICES (2×2) — Half-circle layout ━━━ */}
          <div
            className="bcard"
            style={{
              gridArea: 'services',
              borderRadius: '24px 32px 24px 24px',
              animation: 'cardIn 0.7s ease-out both',
              animationDelay: '0.2s',
            }}
          >
            {/* Particle canvas — rises from bottom on hover */}
            <canvas
              ref={svcCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ borderRadius: 'inherit', zIndex: 1 }}
            />

            {/* Hover background tint */}
            <div
              className="absolute inset-0 transition-all duration-700 pointer-events-none"
              style={{
                opacity: hoveredNav && serviceItems.some(s => s.id === hoveredNav) ? 1 : 0,
                background: hoveredNav && colorMap[hoveredNav]
                  ? `radial-gradient(ellipse at 50% 100%, ${colorMap[hoveredNav]}18, ${colorMap[hoveredNav]}06 50%, transparent 80%)`
                  : 'transparent',
                borderRadius: 'inherit',
                zIndex: 0,
              }}
            />

            <div className="relative z-10 flex flex-col h-full p-4 md:p-5 lg:p-6">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--color-gray-4)' }}>Services</p>

              {/* ─── HALF-CIRCLE PLACEHOLDER ─────────────────────
                   TODO: Replace with animated SVG graphic.
                   Dotted arc + filled dome + orbiting items.
                   ────────────────────────────────────────────────── */}
              <div className="relative flex-1 mt-2">
                {/* ─── SVG Globe ─── */}
                <div
                  className="absolute pointer-events-none"
                  style={{
                    left: '50%',
                    top: '55%',
                    transform: 'translate(-50%, -50%)',
                    width: '62%',
                    aspectRatio: '1',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/sphere.svg" alt="" className="w-full h-full" />
                </div>

                {/* Service items on the arc — animate in staggered */}
                {serviceItems.map((svc, i) => {
                  const isHovered = hoveredNav === svc.id;
                  // Positions mathematically on the ellipse: center(50,75) rx=35 ry=52
                  // Angles: 155°, 115°, 65°, 25° from right horizontal
                  // Positions on the dotted orbit ellipse
                  const positions = [
                    { left: '18%', top: '72%' },
                    { left: '24%', top: '24%' },
                    { left: '76%', top: '24%' },
                    { left: '82%', top: '72%' },
                  ];
                  const pos = positions[i];
                  return (
                    <a
                      key={svc.id}
                      href={svc.url}
                      className="absolute flex flex-col items-center gap-1.5 no-underline group/svc"
                      style={{
                        left: pos.left,
                        top: pos.top,
                        animation: `svcItemIn 0.6s ease-out both`,
                        animationDelay: `${0.4 + i * 0.12}s`,
                      }}
                      onMouseEnter={() => !isTouchDevice && handleHover(svc.id)}
                      onMouseLeave={() => !isTouchDevice && handleHover(null)}
                      onClick={(e) => { e.preventDefault(); window.open(svc.url, isTouchDevice ? '_self' : '_blank'); }}
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
                      <span className="text-[10px] md:text-xs font-medium whitespace-nowrap transition-all duration-300" style={{ color: isHovered ? 'var(--color-white)' : 'var(--color-gray-4)', opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(-4px)' }}>
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

          {/* ━━━ OUR WORK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
               TODO: Replace this placeholder with a dedicated
               <WorkCarousel /> component fed by real case-study
               data from CMS. The gray image placeholders and
               static titles should be swapped for actual content.
               ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div
            className="bcard bcard-link"
            style={{
              gridArea: 'work',
              borderRadius: '24px',
              animation: 'cardIn 0.7s ease-out both',
              animationDelay: '0.35s',
              borderColor: isWorkHovered ? 'rgba(177, 179, 182, 0.2)' : undefined,
            }}
            onMouseEnter={() => !isTouchDevice && handleHover('our-work')}
            onMouseLeave={() => !isTouchDevice && handleHover(null)}
          >
            <div className="relative z-10 flex flex-col h-full p-4 md:p-4 lg:p-5">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--color-gray-4)' }}>Our Work</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-xs transition-opacity duration-300" style={{ color: 'var(--color-gray-4)', opacity: isWorkHovered ? 1 : 0 }}>View all</span>
                  <ArrowUpRight size={16} weight="bold" className="transition-all duration-300" style={{ color: isWorkHovered ? 'var(--color-gray-3)' : 'transparent', transform: isWorkHovered ? 'translate(0,0) scale(1.15)' : 'translate(-2px, 2px) scale(1)' }} />
                </div>
              </div>

              {/* Stacked cards + vertical bar pagination side-by-side */}
              <div className="flex flex-1 min-h-0 gap-2 md:gap-3">
                {/* Stacked cards container */}
                <div className="relative flex-1 min-w-0 flex flex-col">
                  <div className="relative w-full cursor-pointer" style={{ aspectRatio: '16/9' }} onClick={nextWork}>
                    {workPlaceholders.map((_, i) => {
                      const offset = (i - activeWork + workPlaceholders.length) % workPlaceholders.length;
                      return (
                        <div
                          key={i}
                          className="absolute inset-0 rounded-lg md:rounded-xl overflow-hidden transition-all duration-500 ease-out"
                          style={{
                            opacity: offset === 0 ? 1 : offset === 1 ? 0.5 : offset === 2 ? 0.2 : 0,
                            transform: `translateY(${offset * 6}px) scale(${1 - offset * 0.035})`,
                            zIndex: workPlaceholders.length - offset,
                            pointerEvents: offset === 0 ? 'auto' : 'none',
                          }}
                        >
                          {/* Gray placeholder image */}
                          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a, #1e1e1e)' }}>
                            <span className="text-xs md:text-sm font-medium" style={{ color: 'rgba(255,255,255,0.18)' }}>case study here</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Title area — always visible below card image */}
                  <div className="shrink-0 pt-2 md:pt-3">
                    <span className="text-[9px] md:text-[10px] uppercase tracking-wider font-semibold" style={{ color: workPlaceholders[activeWork].accent }}>{workPlaceholders[activeWork].tag}</span>
                    <p className="text-xs md:text-sm font-semibold mt-0.5 leading-tight" style={{ color: 'var(--color-white)' }}>{workPlaceholders[activeWork].title}</p>
                  </div>
                </div>

                {/* Vertical bar pagination — centered beside cards */}
                <div className="shrink-0 flex flex-col items-center justify-center gap-2">
                  {workPlaceholders.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setActiveWork(i); }}
                      className="transition-all duration-400 rounded-sm"
                      style={{
                        width: 5,
                        height: i === activeWork ? 24 : 12,
                        background: i === activeWork ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ━━━ RESOURCES — Simple 2×2 grid (2×2 area) ━━━ */}
          <div
            className="bcard"
            style={{
              gridArea: 'resources',
              borderRadius: '24px',
              animation: 'cardIn 0.7s ease-out both',
              animationDelay: '0.4s',
              borderColor: isResourcesHovered ? 'rgba(0, 119, 181, 0.2)' : undefined,
            }}
            onMouseEnter={() => !isTouchDevice && handleHover('resources')}
            onMouseLeave={() => !isTouchDevice && handleHover(null)}
          >
            <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{ opacity: isResourcesHovered ? 1 : 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(0, 119, 181, 0.06), transparent 60%)', borderRadius: 'inherit' }} />
            <div className="relative z-10 flex flex-col h-full p-3 md:p-4 lg:p-5">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--color-gray-4)' }}>Resources</p>
                <ArrowUpRight size={16} weight="bold" className="transition-all duration-300" style={{ color: isResourcesHovered ? '#0077B5' : 'transparent', transform: isResourcesHovered ? 'translate(0,0) scale(1.15)' : 'translate(-2px, 2px) scale(1)' }} />
              </div>

              <div className="flex-1 grid grid-cols-2 gap-2 md:gap-3 content-center">
                {resourceTypes.map((rt) => (
                  <a
                    key={rt.label}
                    href={rt.url}
                    className="flex items-center gap-2.5 rounded-lg p-2.5 md:p-3 transition-all duration-300 no-underline group/rt"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = `${rt.accent}25`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; }}
                  >
                    <div className="w-1 h-5 md:h-6 rounded-full shrink-0 transition-all duration-300" style={{ background: rt.accent, opacity: 0.6 }} />
                    <span className="text-[11px] md:text-xs font-medium leading-tight transition-colors duration-300" style={{ color: 'var(--color-gray-3)' }}>{rt.label}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* ━━━ NEWSLETTER ━━━ */}
          <div
            className="bcard bcard-link group"
            style={{
              gridArea: 'news',
              borderRadius: '24px',
              animation: 'cardIn 0.6s ease-out both',
              animationDelay: '0.55s',
              borderColor: isNewsHovered ? 'rgba(255, 166, 3, 0.25)' : undefined,
              boxShadow: isNewsHovered ? '0 0 24px rgba(255, 166, 3, 0.06)' : undefined,
            }}
            onMouseEnter={() => !isTouchDevice && handleHover('newsletter')}
            onMouseLeave={() => !isTouchDevice && handleHover(null)}
          >
            <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{ opacity: isNewsHovered ? 1 : 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(255, 166, 3, 0.08), transparent 60%)', borderRadius: 'inherit' }} />
            <div className="relative z-10 flex items-center gap-3 h-full p-3 md:p-4">
              <Envelope size={20} weight="duotone" className="shrink-0 transition-colors duration-300" style={{ color: isNewsHovered ? '#FFA603' : 'rgba(255,255,255,0.2)' }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-semibold transition-colors duration-300 leading-tight" style={{ color: isNewsHovered ? 'var(--color-white)' : 'var(--color-gray-3)' }}>Newsletter</p>
                <p className="text-[9px] md:text-[10px] leading-snug mt-0.5 truncate" style={{ color: 'var(--color-gray-4)' }}>Weekly purpose-driven insights</p>
              </div>
              <div className="shrink-0 h-7 md:h-8 px-3 rounded-full text-[10px] md:text-xs font-semibold flex items-center transition-all duration-300" style={{ background: isNewsHovered ? '#FFA603' : 'rgba(255,255,255,0.05)', color: isNewsHovered ? '#000' : 'var(--color-gray-4)' }}>Subscribe</div>
            </div>
          </div>

          {/* ━━━ ABOUT US ━━━ */}
          <div
            className="bcard bcard-link group"
            style={{
              gridArea: 'about',
              borderRadius: '24px',
              animation: 'cardIn 0.6s ease-out both',
              animationDelay: '0.5s',
              borderColor: isAboutHovered ? 'rgba(77, 217, 255, 0.2)' : undefined,
              boxShadow: isAboutHovered ? '0 0 24px rgba(77, 217, 255, 0.06)' : undefined,
            }}
            onMouseEnter={() => !isTouchDevice && handleHover('about-us')}
            onMouseLeave={() => !isTouchDevice && handleHover(null)}
            onClick={() => window.open('/about', isTouchDevice ? '_self' : '_blank')}
          >
            <div className="absolute inset-0 transition-opacity duration-500 pointer-events-none" style={{ opacity: isAboutHovered ? 1 : 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(77, 217, 255, 0.08), transparent 60%)', borderRadius: 'inherit' }} />
            <div className="relative z-10 flex flex-col justify-between h-full p-3 md:p-4">
              <div>
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium" style={{ color: 'var(--color-gray-4)' }}>About Us</p>
                  <ArrowUpRight size={16} weight="bold" className="transition-all duration-300" style={{ color: isAboutHovered ? '#4DD9FF' : 'transparent', transform: isAboutHovered ? 'translate(0,0) scale(1.15)' : 'translate(-2px, 2px) scale(1)' }} />
                </div>
                <p className="text-sm md:text-base lg:text-lg font-bold leading-tight tracking-tight" style={{ color: 'var(--color-white)' }}>
                  Big Brand Muscle.
                </p>
                <p className="text-sm md:text-base lg:text-lg font-bold leading-tight tracking-tight" style={{ color: '#4DD9FF' }}>
                  Boutique Hustle.
                </p>
              </div>
              <div className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/bcorp-logo.svg" alt="Certified B Corporation" className="h-14 md:h-16 lg:h-20 w-auto" style={{ opacity: 0.5 }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ServiceHeroNav;
