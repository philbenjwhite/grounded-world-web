import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import CarouselPagination from "./CarouselPagination";

const meta = {
  title: "Atoms/CarouselPagination",
  component: CarouselPagination,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#000000" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    total: { control: { type: "range", min: 2, max: 12, step: 1 } },
    activeIndex: { control: { type: "range", min: 0, max: 11, step: 1 } },
  },
} satisfies Meta<typeof CarouselPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    total: 6,
    activeIndex: 0,
  },
};

export const MiddleActive: Story = {
  args: {
    total: 8,
    activeIndex: 3,
  },
};

export const Interactive: Story = {
  args: {
    total: 6,
    activeIndex: 0,
  },
  render: (args) => {
    const [active, setActive] = useState(args.activeIndex);
    return (
      <div className="flex flex-col items-center gap-6">
        <p className="text-white/60 text-sm">Click a dot to navigate</p>
        <CarouselPagination
          total={args.total}
          activeIndex={active}
          onSelect={setActive}
        />
        <p className="text-white text-xs">
          Slide {active + 1} of {args.total}
        </p>
      </div>
    );
  },
};

export const FewItems: Story = {
  args: {
    total: 3,
    activeIndex: 1,
  },
};

export const ManyItems: Story = {
  args: {
    total: 12,
    activeIndex: 5,
  },
};
