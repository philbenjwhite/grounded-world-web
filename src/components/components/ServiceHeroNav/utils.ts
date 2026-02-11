import React from "react";
import type { Service } from "../../../../tina/__generated__/types";
import {
  MagnifyingGlassIcon,
  CompassIcon,
  LightningIcon,
  ChartLineUpIcon,
  GlobeIcon,
  UsersIcon,
  MegaphoneIcon,
  TargetIcon,
  LightbulbIcon,
  RocketIcon,
  IconProps,
} from "@phosphor-icons/react";

/** Map CMS icon name strings to Phosphor components (tree-shake safe) */
const iconMap: Record<string, React.ComponentType<IconProps>> = {
  MagnifyingGlass: MagnifyingGlassIcon,
  Compass: CompassIcon,
  Lightning: LightningIcon,
  ChartLineUp: ChartLineUpIcon,
  Globe: GlobeIcon,
  Users: UsersIcon,
  Megaphone: MegaphoneIcon,
  Target: TargetIcon,
  Lightbulb: LightbulbIcon,
  Rocket: RocketIcon,
};

export type ServiceItem = Pick<
  Service,
  "label" | "color" | "description" | "url"
> & {
  id: string;
  icon: React.ComponentType<IconProps>;
};

/** Convert CMS services into the shape the component expects */
export function mapCmsServices(cmsItems: Service[]): ServiceItem[] {
  return [...cmsItems]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map(({ serviceId, icon, ...rest }) => ({
      ...rest,
      id: serviceId,
      icon: iconMap[icon] || MagnifyingGlassIcon,
    }));
}
