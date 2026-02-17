import type { IconProps } from "@phosphor-icons/react";
import {
  MicrophoneStageIcon,
  FileTextIcon,
  CompassIcon,
  ArticleIcon,
} from "@phosphor-icons/react";

export const resourceLinks = [
  {
    label: "Podcast",
    href: "/resources/podcast",
    color: "#00AEEF",
    icon: MicrophoneStageIcon,
  },
  {
    label: "White Papers",
    href: "/resources/white-papers",
    color: "#1CC35B",
    icon: FileTextIcon,
  },
  {
    label: "How To Guides",
    href: "/resources/guides",
    color: "#FF08CC",
    icon: CompassIcon,
  },
  {
    label: "Articles & Blogs",
    href: "/resources/articles",
    color: "#FFA603",
    icon: ArticleIcon,
  },
] satisfies {
  label: string;
  href: string;
  color: string;
  icon: React.ComponentType<IconProps>;
}[];
