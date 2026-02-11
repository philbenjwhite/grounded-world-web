'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from '@phosphor-icons/react';

interface Quadrant {
  id: 'research' | 'strategy' | 'activation' | 'impact';
  label: string;
  color: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  imageUrl: string;
}

const quadrants: Quadrant[] = [
  {
    id: 'research',
    label: 'RESEARCH',
    color: '#00AEEF',
    position: 'top-left',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&h=900&fit=crop' // workspace
  },
  {
    id: 'strategy',
    label: 'STRATEGY',
    color: '#FFA603',
    position: 'top-right',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=900&fit=crop' // cityscape
  },
  {
    id: 'impact',
    label: 'IMPACT',
    color: '#1CC35B',
    position: 'bottom-left',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&h=900&fit=crop' // data visualization, metrics
  },
  {
    id: 'activation',
    label: 'ACTIVATION',
    color: '#FF08CC',
    position: 'bottom-right',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&h=900&fit=crop' // creative energy, campaign launch
  }
];

const ServiceQuadrantNav: React.FC = () => {
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsClient(true);
    const checkTouch = () => {
      return 'ontouchstart' in window ||
             navigator.maxTouchPoints > 0 ||
             /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    setIsTouchDevice(checkTouch());
  }, []);

  // Video playback management
  useEffect(() => {
    if (!videoRef.current || !isClient) return;

    const video = videoRef.current;

    const ensureVideoPlays = async () => {
      try {
        if (video.paused) {
          await video.play();
        }
      } catch (error) {
        console.log('Video autoplay prevented:', error);
      }
    };

    ensureVideoPlays();

    const handlePause = () => {
      setTimeout(() => {
        ensureVideoPlays();
      }, 100);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        ensureVideoPlays();
      }
    };

    video.addEventListener('pause', handlePause);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', ensureVideoPlays);

    const playbackInterval = setInterval(() => {
      if (video.paused) {
        ensureVideoPlays();
      }
    }, 2000);

    return () => {
      video.removeEventListener('pause', handlePause);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', ensureVideoPlays);
      clearInterval(playbackInterval);
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="fixed inset-0 bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white/50">Loading...</div>
        </div>
      </div>
    );
  }

  const getGradientStyle = (quadrant: Quadrant, isHovered: boolean) => {
    if (!isHovered) {
      // Always show a subtle gradient to ensure text readability
      return `radial-gradient(ellipse 120% 120% at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.05) 70%, transparent 100%)`;
    }

    // On hover, create very soft, large gradients that blend naturally
    switch (quadrant.id) {
      case 'research':
        return `radial-gradient(ellipse 150% 150% at 20% 20%, ${quadrant.color}33 0%, ${quadrant.color}1a 25%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.05) 90%, transparent 100%)`;
      case 'strategy':
        return `radial-gradient(ellipse 150% 150% at 80% 20%, ${quadrant.color}33 0%, ${quadrant.color}1a 25%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.05) 90%, transparent 100%)`;
      case 'impact':
        return `radial-gradient(ellipse 150% 150% at 20% 80%, ${quadrant.color}33 0%, ${quadrant.color}1a 25%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.05) 90%, transparent 100%)`;
      case 'activation':
        return `radial-gradient(ellipse 150% 150% at 80% 80%, ${quadrant.color}33 0%, ${quadrant.color}1a 25%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.05) 90%, transparent 100%)`;
      default:
        return `radial-gradient(ellipse 120% 120% at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.05) 70%, transparent 100%)`;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        width: '100vw',
        height: '100vh'
      }}
    >
      {/* CSS for Bebas Neue font and animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        .quadrant-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          letter-spacing: 0.15em;
          font-weight: 400;
          transition: color 0.4s ease;
        }

        .arrow-icon {
          transition: opacity 0.4s ease, transform 0.4s ease;
          opacity: 0;
          transform: translateX(-10px);
        }

        .quadrant:hover .arrow-icon {
          opacity: 1;
          transform: translateX(0);
        }

        @keyframes headerTextIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(20px) scale(0.8);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0px) scale(1);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-10px) scale(0.95);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes quadrantFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes quadrantTextFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      {/* Animated Header Text */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'headerTextIn 2.5s ease-in-out forwards',
          animationDelay: '0.2s',
          opacity: 0
        }}
      >
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white text-center tracking-tight"
          style={{
            textShadow: '0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6)',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            lineHeight: '1.1'
          }}
        >
          <span className="block sm:hidden">
            Activating<br />Purpose
          </span>
          <span className="hidden sm:block whitespace-nowrap">
            Activating Purpose
          </span>
        </h1>
      </div>

      {/* Center Video */}
      <div className="absolute z-5 pointer-events-none" style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'fadeInScale 0.8s ease-out forwards',
        animationDelay: '0.1s',
        opacity: 0
      }}>
        <div
          className="rounded-full overflow-hidden relative"
          style={{
            width: 'min(525px, max(68vw, 340px))',
            height: 'min(525px, max(68vw, 340px))',
            clipPath: 'circle(50%)',
            border: 'none',
            boxShadow: 'none'
          }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source
              src="https://player.vimeo.com/progressive_redirect/playback/1161946524/rendition/720p/file.mp4%20%28720p%29.mp4?loc=external&log_user=0&signature=ff985305bacd44ceec1d96f384a10daa44f54d5055afc72a0b9ec4ab171053ab"
              type="video/mp4"
            />
          </video>
        </div>
      </div>

      {/* Four Quadrants */}
      {quadrants.map((quadrant, index) => {
        const isHovered = hoveredQuadrant === quadrant.id;
        // Start quadrants after header text completes (2.5s) + staggered delay
        const quadrantDelay = 2.7 + (index * 0.15);

        return (
          <a
            key={quadrant.id}
            href="https://visualboston.com"
            target="_blank"
            rel="noopener noreferrer"
            className="quadrant block relative overflow-hidden cursor-pointer flex items-center justify-center"
            style={{
              animation: `quadrantFadeIn 0.8s ease-out forwards`,
              animationDelay: `${quadrantDelay}s`,
              opacity: 0
            }}
            onMouseEnter={() => !isTouchDevice && setHoveredQuadrant(quadrant.id)}
            onMouseLeave={() => !isTouchDevice && setHoveredQuadrant(null)}
            onClick={(e) => {
              e.preventDefault();
              window.open('https://visualboston.com', '_blank');
            }}
          >
            {/* Layer 1: Background Image */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${quadrant.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: isHovered ? 0.08 : 0,
                filter: 'grayscale(50%) brightness(0.4) contrast(1.2)',
                transition: 'opacity 1s ease, transform 1.5s ease',
                transform: isHovered ? 'scale(1.0)' : 'scale(1.15)'
              }}
            />

            {/* Layer 2: Always-visible Gradient Overlay (for text readability) */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: getGradientStyle(quadrant, isHovered),
                transition: 'background 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 15
              }}
            />

            {/* Layer 3: Ultra-subtle color wash */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(ellipse 200% 200% at 50% 50%, ${quadrant.color}08 0%, transparent 60%)`,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 1s ease',
                mixBlendMode: 'soft-light',
                zIndex: 16
              }}
            />

            {/* Layer 4: Text + Arrow (centered, above everything) */}
            <div
              className="relative flex items-center gap-4"
              style={{
                zIndex: 20,
                animation: `quadrantTextFadeIn 0.6s ease-out forwards`,
                animationDelay: `${quadrantDelay + 0.3}s`,
                opacity: 0
              }}
            >
              <span
                className="quadrant-label"
                style={{
                  color: isHovered ? quadrant.color : 'rgba(255, 255, 255, 0.6)',
                  fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                  textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)',
                  transition: 'color 0.6s ease'
                }}
              >
                {quadrant.label}
              </span>
              <ArrowRight
                size={32}
                weight="bold"
                className="arrow-icon"
                style={{
                  color: quadrant.color,
                  filter: isHovered ? `drop-shadow(0 0 10px ${quadrant.color}60)` : 'none'
                }}
              />
            </div>
          </a>
        );
      })}


      {/* Grid lines */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: '50%',
          width: '1px',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          transform: 'translateX(-50%)',
          zIndex: 5
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: '50%',
          width: '100%',
          height: '1px',
          background: 'rgba(255, 255, 255, 0.05)',
          transform: 'translateY(-50%)',
          zIndex: 5
        }}
      />
    </div>
  );
};

export default ServiceQuadrantNav;