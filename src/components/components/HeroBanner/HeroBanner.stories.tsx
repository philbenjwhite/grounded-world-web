import type { Meta, StoryObj } from "@storybook/react";
import HeroBanner from "./HeroBanner";

const meta = {
  title: "Components/HeroBanner",
  component: HeroBanner,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    backgroundType: {
      control: "select",
      options: ["vimeo", "image", "canvas"],
    },
    vimeoUrl: { control: "text", if: { arg: "backgroundType", eq: "vimeo" } },
    posterSrc: { control: "text", if: { arg: "backgroundType", eq: "vimeo" } },
    imageSrc: { control: "text", if: { arg: "backgroundType", eq: "image" } },
    imageAlt: { control: "text", if: { arg: "backgroundType", eq: "image" } },
    title: { control: "text" },
    subtitle: { control: "text" },
    ctaLabel: { control: "text" },
    ctaHref: { control: "text" },
    ctaVariant: { control: "select", options: ["solid", "outline"] },
    secondaryCtaLabel: { control: "text" },
    secondaryCtaHref: { control: "text" },
    overlayOpacity: { control: "select", options: ["light", "medium", "heavy"] },
    contentAlign: { control: "select", options: ["center", "left"] },
    minHeight: { control: "select", options: ["full", "large", "medium"] },
  },
} satisfies Meta<typeof HeroBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Vimeo background — mimics a services page hero */
export const VimeoBackground: Story = {
  args: {
    backgroundType: "vimeo",
    vimeoUrl: "https://vimeo.com/1001182645/7bc8093073",
    posterSrc: "https://picsum.photos/1920/1080",
    title: "Our Services",
    subtitle:
      "Everything we do is designed to move the needle culturally, socially, environmentally and behaviorally — inside and out.",
    ctaLabel: "Discovery Call",
    ctaHref: "/contact",
    ctaVariant: "solid",
    secondaryCtaLabel: "Explore Services",
    secondaryCtaHref: "#services",
    overlayOpacity: "medium",
    contentAlign: "center",
    minHeight: "full",
  },
};

/** Image background with heavy overlay */
export const ImageBackground: Story = {
  args: {
    backgroundType: "image",
    imageSrc: "https://picsum.photos/1920/1080",
    imageAlt: "Abstract dark background",
    title: "About Us",
    subtitle:
      "We\u2019re a B Corp certified boutique agency at the intersection of brand purpose, commercial strategy, and social impact.",
    ctaLabel: "Meet the Team",
    ctaHref: "/about-us#team",
    ctaVariant: "solid",
    overlayOpacity: "heavy",
    contentAlign: "center",
    minHeight: "full",
  },
};

/** Left-aligned content with outline CTA */
export const LeftAligned: Story = {
  args: {
    backgroundType: "image",
    imageSrc: "https://picsum.photos/1920/1080",
    imageAlt: "Workshop in progress",
    title: "Brand Activism",
    subtitle: "Stand for something before taking a stand.",
    ctaLabel: "Learn More",
    ctaHref: "/brand-activism",
    ctaVariant: "outline",
    overlayOpacity: "heavy",
    contentAlign: "left",
    minHeight: "large",
  },
};

/** Minimal — no subtitle, single CTA */
export const Minimal: Story = {
  args: {
    backgroundType: "image",
    imageSrc: "https://picsum.photos/1920/1080",
    imageAlt: "Dark texture",
    title: "It\u2019s time to get grounded",
    ctaLabel: "Contact Us",
    ctaHref: "/contact",
    ctaVariant: "solid",
    overlayOpacity: "medium",
    contentAlign: "center",
    minHeight: "medium",
  },
};

/** Canvas background — interactive Three.js plexus animation */
export const CanvasBackground: Story = {
  args: {
    backgroundType: "canvas",
    title: "Our Services",
    subtitle:
      "Everything we do is designed to move the needle culturally, socially, environmentally and behaviorally — inside and out.",
    ctaLabel: "Discovery Call",
    ctaHref: "/contact",
    ctaVariant: "solid",
    secondaryCtaLabel: "Explore Services",
    secondaryCtaHref: "#services",
    overlayOpacity: "light",
    contentAlign: "center",
    minHeight: "full",
  },
};

/** Vimeo unlisted video — tests hash parsing in the URL */
export const VimeoUnlisted: Story = {
  args: {
    backgroundType: "vimeo",
    vimeoUrl: "https://vimeo.com/1001182645/7bc8093073",
    posterSrc: "https://picsum.photos/1920/1080",
    title: "Our Impact",
    subtitle:
      "Measuring progress, sparking engagement, and facilitating partnerships at scale.",
    ctaLabel: "See Case Studies",
    ctaHref: "/our-work",
    overlayOpacity: "light",
    contentAlign: "center",
    minHeight: "full",
  },
};
