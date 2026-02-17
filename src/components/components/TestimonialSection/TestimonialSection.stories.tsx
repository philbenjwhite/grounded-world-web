import type { Meta, StoryObj } from "@storybook/react";
import TestimonialSection from "./TestimonialSection";

const meta: Meta<typeof TestimonialSection> = {
  title: "Components/TestimonialSection",
  component: TestimonialSection,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialSection>;

export const Default: Story = {
  args: {
    quote:
      "Coupled with the testing, it really brought to light the challenges we are facing and helped define the most impactful way to reach our shoppers through packaging, design and retail activation.",
    rating: 5,
    author: "Brand Director",
    company: "Fortune 500 CPG Company",
  },
};

export const WithImage: Story = {
  args: {
    quote:
      "Coupled with the testing, it really brought to light the challenges we are facing and helped define the most impactful way to reach our shoppers through packaging, design and retail activation.",
    rating: 5,
    author: "Brand Director",
    company: "Fortune 500 CPG Company",
    imageSrc: "/images/services/activation-testimonial.jpg",
    imageAlt: "Brand activation project result",
  },
};

export const NoRating: Story = {
  args: {
    quote:
      "Their sprint-based approach transformed our sustainability messaging into something commercially compelling and authentic.",
    author: "VP Marketing",
    role: "Head of Sustainability",
    company: "Global Retailer",
  },
};
