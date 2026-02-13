"use client";

import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import cn from "classnames";
import Section from "../../layout/Section";
import styles from "./LogoCarousel.module.css";

export interface LogoItem {
  src: string;
  alt: string;
}

export interface LogoCarouselProps {
  logos?: LogoItem[];
  speed?: number;
}

const DEFAULT_LOGOS: LogoItem[] = [
  { src: "/images/client-logos/01-tree-free-greetings-logo-white.png", alt: "Tree Free Greetings" },
  { src: "/images/client-logos/02-points4purpose-logo-white.png", alt: "Points4Purpose" },
  { src: "/images/client-logos/03-innerwill-leadership-institute-logo-white.png", alt: "InnerWill Leadership Institute" },
  { src: "/images/client-logos/04-limavady-irish-whiskey-logo-white.png", alt: "Limavady Irish Whiskey" },
  { src: "/images/client-logos/05-onesight-logo-white.png", alt: "OneSight" },
  { src: "/images/client-logos/06-golden-1-credit-union-logo-white.png", alt: "Golden 1 Credit Union" },
  { src: "/images/client-logos/07-brita-logo-white.png", alt: "Brita" },
  { src: "/images/client-logos/08-ford-logo-white.png", alt: "Ford" },
  { src: "/images/client-logos/09-nestle-logo-white.png", alt: "Nestlé" },
  { src: "/images/client-logos/10-pepsico-logo-white.png", alt: "PepsiCo" },
  { src: "/images/client-logos/11-gsk-logo-white.png", alt: "GSK" },
  { src: "/images/client-logos/12-nespresso-logo-white.png", alt: "Nespresso" },
  { src: "/images/client-logos/13-perrier-logo-white.png", alt: "Perrier" },
  { src: "/images/client-logos/14-lycra-logo-white.png", alt: "Lycra" },
  { src: "/images/client-logos/15-odwalla-logo-white.png", alt: "Odwalla" },
  { src: "/images/client-logos/16-carnation-logo-white.png", alt: "Carnation" },
  { src: "/images/client-logos/17-libbys-logo-white.png", alt: "Libby's" },
  { src: "/images/client-logos/18-idesign-logo-white.png", alt: "iDesign" },
];

const LogoCarousel: React.FC<LogoCarouselProps> = ({
  logos = DEFAULT_LOGOS,
  speed = 40,
}) => {
  return (
    <Section className="!py-12 md:!py-16">
      <Marquee
        speed={speed}
        gradient
        gradientColor="#0a0a0a"
        gradientWidth={120}
        autoFill
        pauseOnHover
        className={cn("group", styles.marquee)}
      >
        {logos.map((logo) => (
          <div key={logo.alt} className="mx-5 md:mx-8 flex items-center">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={160}
              height={60}
              className={cn(
                styles.logo,
                "h-[60px] md:h-[80px] w-auto object-contain opacity-50 transition-opacity duration-300 ease-out group-hover:opacity-30 hover:!opacity-80",
              )}
            />
          </div>
        ))}
      </Marquee>
    </Section>
  );
};

export default LogoCarousel;
