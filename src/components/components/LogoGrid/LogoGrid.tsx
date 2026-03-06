import React from "react";
import Image from "next/image";
import cn from "classnames";
import Section from "../../layout/Section";
import Container from "../../layout/Container";

export interface LogoGridItem {
  src: string;
  alt: string;
  href?: string;
}

export interface LogoGridProps {
  logos?: LogoGridItem[];
}

const DEFAULT_LOGOS: LogoGridItem[] = [
  {
    src: "/images/badges/B-Corp-Logo-White-RGB.png",
    alt: "Certified B Corporation",
    href: "https://www.bcorporation.net/en-us/certification/",
  },
  {
    src: "/images/badges/RealLeaders_TopImpactCompanies-port-white.png",
    alt: "Real Leaders Top Impact Companies",
    href: "https://real-leaders.com/top-impact-companies-2025/",
  },
  {
    src: "/images/badges/1-planet.png",
    alt: "1% for the Planet",
    href: "https://www.onepercentfortheplanet.org/",
  },
  {
    src: "/images/badges/sbt.png",
    alt: "Science Based Targets",
    href: "https://sciencebasedtargets.org/",
  },
  {
    src: "/images/badges/ANA-300px.png",
    alt: "ANA",
    href: "https://www.ana.net/brandpurpose",
  },
  {
    src: "/images/badges/eea-logo-white.png",
    alt: "Creatives for Climate",
    href: "https://www.creativesforclimate.co/partner",
  },
];

const LogoGrid: React.FC<LogoGridProps> = ({ logos = DEFAULT_LOGOS }) => {
  return (
    <Section className="!py-12 md:!py-16">
      <Container>
        <div
          className={cn(
            "grid grid-cols-2 gap-8",
            "sm:grid-cols-3",
            "lg:grid-cols-6",
          )}
        >
          {logos.map((logo) => {
            const image = (
              <Image
                src={logo.src}
                alt={logo.alt}
                width={200}
                height={200}
                className="h-20 md:h-24 w-auto object-contain opacity-60 transition-opacity duration-300 hover:opacity-90"
              />
            );

            return (
              <div
                key={logo.alt}
                className="flex items-center justify-center max-w-30 max-h-25 mx-auto"
              >
                {logo.href ? (
                  <a
                    href={logo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {image}
                  </a>
                ) : (
                  image
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default LogoGrid;
