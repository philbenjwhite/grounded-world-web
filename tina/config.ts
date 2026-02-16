import { defineConfig, LocalAuthProvider } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

// Check if running in local mode
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

/* ── Reusable inner templates for slot-based layouts ── */

const innerRichTextTemplate = {
  name: "richText" as const,
  label: "Rich Text",
  fields: [
    {
      type: "rich-text" as const,
      name: "body",
      label: "Content",
    },
  ],
};

const innerImageTemplate = {
  name: "image" as const,
  label: "Image",
  fields: [
    {
      type: "image" as const,
      name: "src",
      label: "Image",
    },
    {
      type: "string" as const,
      name: "alt",
      label: "Alt Text",
    },
    {
      type: "string" as const,
      name: "caption",
      label: "Caption",
    },
    {
      type: "boolean" as const,
      name: "rounded",
      label: "Rounded Corners",
    },
  ],
};

export default defineConfig({
  // Use local content API when running locally
  contentApiUrlOverride: isLocal ? "/api/tina/gql" : undefined,
  authProvider: isLocal ? new LocalAuthProvider() : undefined,

  branch,

  // TinaCloud configuration (required for production)
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "service",
        label: "Services",
        path: "content/services",
        format: "json",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.label
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "label",
            label: "Label",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "serviceId",
            label: "Service ID",
            required: true,
            description: "Unique identifier used for hover states and routing (e.g. 'research', 'strategy')",
          },
          {
            type: "string",
            name: "color",
            label: "Brand Color",
            required: true,
            ui: {
              component: "color",
            },
          },
          {
            type: "string",
            name: "description",
            label: "Short Description",
            required: true,
          },
          {
            type: "string",
            name: "url",
            label: "URL",
            required: true,
          },
          {
            type: "string",
            name: "icon",
            label: "Icon",
            required: true,
            description: "Phosphor icon name",
            options: [
              { value: "MagnifyingGlass", label: "Magnifying Glass (Research)" },
              { value: "Compass", label: "Compass (Strategy)" },
              { value: "Lightning", label: "Lightning (Activation)" },
              { value: "ChartLineUp", label: "Chart Line Up (Impact)" },
              { value: "Globe", label: "Globe" },
              { value: "Users", label: "Users" },
              { value: "Megaphone", label: "Megaphone" },
              { value: "Target", label: "Target" },
              { value: "Lightbulb", label: "Lightbulb" },
              { value: "Rocket", label: "Rocket" },
            ],
          },
          {
            type: "number",
            name: "order",
            label: "Display Order",
            description: "Controls the position on the arc (0 = bottom-left, 3 = bottom-right)",
          },
        ],
      },
      {
        name: "category",
        label: "Categories",
        path: "content/categories",
        format: "json",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.name
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
            description: "URL-friendly version of the name (lowercase, hyphens only)",
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "reference",
            name: "parent",
            label: "Parent Category",
            collections: ["category"],
            description: "Optional parent category for hierarchy",
          },
          {
            type: "image",
            name: "image",
            label: "Category Image",
          },
          {
            type: "string",
            name: "textColor",
            label: "Text Color",
            ui: {
              component: "color",
            },
          },
          {
            type: "string",
            name: "hoverTextColor",
            label: "Hover Text Color",
            ui: {
              component: "color",
            },
          },
          {
            type: "string",
            name: "backgroundColor",
            label: "Background Color",
            ui: {
              component: "color",
            },
          },
          {
            type: "string",
            name: "hoverBackgroundColor",
            label: "Hover Background Color",
            ui: {
              component: "color",
            },
          },
        ],
      },
      {
        name: "work",
        label: "Work",
        path: "content/work",
        format: "md",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.title
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
                .substring(0, 100);
            },
          },
        },
        defaultItem: () => ({
          date: new Date().toISOString(),
        }),
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "client",
            label: "Client",
            required: true,
            description:
              "Client or brand name (e.g. 'LYCRA + QIRA', 'Tribes On The Edge')",
          },
          {
            type: "reference",
            name: "service",
            label: "Service",
            collections: ["service"],
            description: "Primary service type for this work",
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            description: "Brief project description / excerpt (1-2 sentences)",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "featuredImage",
            label: "Featured Image",
            description:
              "Main image displayed in work listings and social sharing",
          },
          {
            type: "string",
            name: "videoUrl",
            label: "Video URL",
            description: "Vimeo or YouTube embed URL",
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            ui: {
              dateFormat: "MMMM D, YYYY",
            },
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            ui: {
              component: "tags",
            },
          },
          {
            type: "string",
            name: "seoTitle",
            label: "SEO Title",
            description:
              "Custom title for search engines (defaults to title if empty)",
          },
          {
            type: "string",
            name: "seoDescription",
            label: "SEO Description",
            description:
              "Custom meta description for search engines (max 160 characters)",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured",
            description: "Display this work in featured/hero sections",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        format: "md",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.title
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
                .substring(0, 100);
            },
          },
        },
        defaultItem: () => ({
          date: new Date().toISOString(),
        }),
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "Publish Date",
            required: true,
            ui: {
              dateFormat: "MMMM D, YYYY",
            },
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            description: "Brief summary for SEO and social sharing (max 160 characters)",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "featuredImage",
            label: "Featured Image",
            description: "Main image displayed in post listings and social sharing",
          },
          {
            type: "string",
            name: "author",
            label: "Author",
            options: [
              { value: "phil-white", label: "Phil White" },
              { value: "matt-deasy", label: "Matt Deasy" },
              { value: "paloma-jacome", label: "Paloma Jacome" },
              { value: "andrew-yates", label: "Andrew Yates" },
            ],
          },
          {
            type: "reference",
            name: "category",
            label: "Category",
            collections: ["category"],
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
            ui: {
              component: "tags",
            },
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured Post",
            description: "Display this post in featured sections",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "json",
        ui: {
          router: ({ document }) => {
            const slug = document._sys.filename;
            if (slug === "home") return "/";
            if (slug === "our-work") return "/our-work";
            if (slug === "services") return "/services";
            return `/${slug}`;
          },
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.title
                ?.toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true,
            description: "URL path for this page (e.g. 'about', 'services')",
          },
          {
            type: "object",
            name: "sections",
            label: "Page Sections",
            list: true,
            templates: [
              /* ── Video Hero ────────────────────────── */
              {
                name: "videoHero",
                label: "Video Hero",
                fields: [
                  {
                    type: "string",
                    name: "backgroundVideoUrl",
                    label: "Background Video URL",
                    description:
                      "Direct MP4 URL for the looping background video",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "vimeoId",
                    label: "Vimeo Video ID",
                    description:
                      "Vimeo video ID for the play modal (e.g. '1153662802')",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "heading",
                    label: "Heading",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "subheading",
                    label: "Subheading",
                  },
                ],
              },
              /* ── Hero Banner ─────────────────────────── */
              {
                name: "heroBanner",
                label: "Hero Banner",
                fields: [
                  {
                    type: "string",
                    name: "backgroundType",
                    label: "Background Type",
                    required: true,
                    options: [
                      { value: "vimeo", label: "Vimeo Video" },
                      { value: "image", label: "Image" },
                      { value: "canvas", label: "Animated Canvas" },
                    ],
                  },
                  {
                    type: "string",
                    name: "vimeoUrl",
                    label: "Vimeo URL",
                    description: "Full Vimeo URL (standard or unlisted)",
                  },
                  {
                    type: "image",
                    name: "posterSrc",
                    label: "Poster Image",
                    description: "Fallback image shown while video loads",
                  },
                  {
                    type: "image",
                    name: "imageSrc",
                    label: "Background Image",
                  },
                  {
                    type: "string",
                    name: "imageAlt",
                    label: "Background Image Alt Text",
                  },
                  {
                    type: "string",
                    name: "title",
                    label: "Headline",
                  },
                  {
                    type: "string",
                    name: "subtitle",
                    label: "Subtitle",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "string",
                    name: "ctaLabel",
                    label: "Primary CTA Text",
                  },
                  {
                    type: "string",
                    name: "ctaHref",
                    label: "Primary CTA Link",
                  },
                  {
                    type: "string",
                    name: "ctaVariant",
                    label: "Primary CTA Style",
                    options: ["solid", "outline"],
                  },
                  {
                    type: "string",
                    name: "secondaryCtaLabel",
                    label: "Secondary CTA Text",
                  },
                  {
                    type: "string",
                    name: "secondaryCtaHref",
                    label: "Secondary CTA Link",
                  },
                  {
                    type: "string",
                    name: "overlayOpacity",
                    label: "Overlay Darkness",
                    options: [
                      { value: "light", label: "Light" },
                      { value: "medium", label: "Medium" },
                      { value: "heavy", label: "Heavy" },
                    ],
                  },
                  {
                    type: "string",
                    name: "contentAlign",
                    label: "Content Alignment",
                    options: [
                      { value: "center", label: "Center" },
                      { value: "left", label: "Left" },
                    ],
                  },
                  {
                    type: "string",
                    name: "minHeight",
                    label: "Minimum Height",
                    options: [
                      { value: "full", label: "Full Screen" },
                      { value: "large", label: "Large" },
                      { value: "medium", label: "Medium" },
                    ],
                  },
                  {
                    type: "boolean",
                    name: "bottomFade",
                    label: "Bottom Fade",
                    description: "Show a gradient that bleeds into the next section",
                  },
                ],
              },
              /* ── Showcase Grid ───────────────────────── */
              {
                name: "showcaseGrid",
                label: "Showcase Grid",
                fields: [
                  {
                    type: "string",
                    name: "sectionTitle",
                    label: "Section Title",
                  },
                  {
                    type: "string",
                    name: "sectionSubtitle",
                    label: "Section Subtitle",
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Items",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => ({
                        label: item?.title || "New Item",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "title",
                        label: "Title",
                      },
                      {
                        type: "string",
                        name: "description",
                        label: "Description",
                        ui: { component: "textarea" },
                      },
                      {
                        type: "image",
                        name: "imageSrc",
                        label: "Image",
                      },
                      {
                        type: "string",
                        name: "imageAlt",
                        label: "Image Alt Text",
                      },
                      {
                        type: "string",
                        name: "glowColor",
                        label: "Glow Color",
                        ui: { component: "color" },
                      },
                      {
                        type: "string",
                        name: "href",
                        label: "Link",
                      },
                    ],
                  },
                ],
              },
              /* ── Expanding Card Panel ────────────────── */
              {
                name: "expandingCardPanel",
                label: "Expanding Card Panel",
                fields: [
                  {
                    type: "string",
                    name: "sectionTitle",
                    label: "Section Title",
                  },
                  {
                    type: "string",
                    name: "sectionSubtitle",
                    label: "Section Subtitle",
                  },
                  {
                    type: "number",
                    name: "defaultActiveIndex",
                    label: "Default Expanded Card",
                    description: "Index of the card expanded on page load (0-based)",
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Items",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => ({
                        label: item?.name || "New Item",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "name",
                        label: "Name",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "color",
                        label: "Color",
                        required: true,
                        ui: { component: "color" },
                      },
                      {
                        type: "string",
                        name: "icon",
                        label: "Icon",
                        options: [
                          { value: "MagnifyingGlass", label: "Magnifying Glass" },
                          { value: "Compass", label: "Compass" },
                          { value: "Lightning", label: "Lightning" },
                          { value: "ChartLineUp", label: "Chart Line Up" },
                          { value: "Globe", label: "Globe" },
                          { value: "Users", label: "Users" },
                          { value: "Megaphone", label: "Megaphone" },
                          { value: "Target", label: "Target" },
                          { value: "Lightbulb", label: "Lightbulb" },
                          { value: "Rocket", label: "Rocket" },
                        ],
                      },
                      {
                        type: "string",
                        name: "tagline",
                        label: "Tagline",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "bullets",
                        label: "Bullet Points",
                        list: true,
                      },
                      {
                        type: "string",
                        name: "ctaHref",
                        label: "CTA Link",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "ctaLabel",
                        label: "CTA Text",
                        description: "Default: 'Find Out More'",
                      },
                      {
                        type: "image",
                        name: "imageSrc",
                        label: "Image",
                      },
                      {
                        type: "string",
                        name: "imageAlt",
                        label: "Image Alt Text",
                      },
                    ],
                  },
                ],
              },
              /* ── Media Section ───────────────────────── */
              {
                name: "mediaSection",
                label: "Media Section",
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Section Title",
                  },
                  {
                    type: "string",
                    name: "categories",
                    label: "Filter Categories",
                    list: true,
                    description: "'All' is prepended automatically",
                  },
                  {
                    type: "string",
                    name: "defaultCategory",
                    label: "Default Category",
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Media Items",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => ({
                        label: item?.title || "New Media Item",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "id",
                        label: "ID",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "title",
                        label: "Title",
                      },
                      {
                        type: "string",
                        name: "category",
                        label: "Category",
                      },
                      {
                        type: "image",
                        name: "imageUrl",
                        label: "Image",
                      },
                      {
                        type: "string",
                        name: "imageAlt",
                        label: "Image Alt Text",
                      },
                      {
                        type: "string",
                        name: "href",
                        label: "Link",
                      },
                    ],
                  },
                ],
              },
              /* ── Logo Carousel ───────────────────────── */
              {
                name: "logoCarousel",
                label: "Logo Carousel",
                fields: [
                  {
                    type: "number",
                    name: "speed",
                    label: "Scroll Speed",
                    description: "Pixels per second (default: 40)",
                  },
                  {
                    type: "object",
                    name: "logos",
                    label: "Logos",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => ({
                        label: item?.alt || "New Logo",
                      }),
                    },
                    fields: [
                      {
                        type: "image",
                        name: "src",
                        label: "Logo Image",
                        description: "SVG or PNG with transparent background recommended",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "alt",
                        label: "Alt Text",
                        required: true,
                      },
                    ],
                  },
                ],
              },
              /* ── Carousel ────────────────────────────── */
              {
                name: "carousel",
                label: "Carousel",
                fields: [
                  {
                    type: "boolean",
                    name: "loop",
                    label: "Loop",
                  },
                  {
                    type: "boolean",
                    name: "showArrows",
                    label: "Show Navigation Arrows",
                  },
                  {
                    type: "boolean",
                    name: "showDots",
                    label: "Show Dot Indicators",
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Carousel Items",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => ({
                        label: item?.title || "New Slide",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "id",
                        label: "ID",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "title",
                        label: "Title",
                      },
                      {
                        type: "image",
                        name: "imageUrl",
                        label: "Image",
                      },
                      {
                        type: "string",
                        name: "imageAlt",
                        label: "Image Alt Text",
                      },
                    ],
                  },
                ],
              },
              /* ── Work Carousel ───────────────────────── */
              {
                name: "workCarousel",
                label: "Work Carousel",
                fields: [
                  {
                    type: "string",
                    name: "sectionTitle",
                    label: "Section Title",
                  },
                  {
                    type: "boolean",
                    name: "loop",
                    label: "Loop",
                  },
                  {
                    type: "boolean",
                    name: "showArrows",
                    label: "Show Navigation Arrows",
                  },
                  {
                    type: "boolean",
                    name: "showDots",
                    label: "Show Dot Indicators",
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Work Items",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => {
                        const ref = item?.work;
                        if (!ref) return { label: "Select a work item" };
                        const name = ref
                          .replace(/^content\/work\//, "")
                          .replace(/\.md$/, "")
                          .replace(/-/g, " ");
                        // Title-case each word
                        const label = name
                          .split(" ")
                          .map(
                            (w: string) =>
                              w.charAt(0).toUpperCase() + w.slice(1)
                          )
                          .join(" ");
                        return { label };
                      },
                    },
                    fields: [
                      {
                        type: "reference",
                        name: "work",
                        label: "Work",
                        collections: ["work"],
                      },
                    ],
                  },
                ],
              },
              /* ── Intro Section ───────────────────────── */
              {
                name: "introSection",
                label: "Intro Section",
                fields: [
                  {
                    type: "string",
                    name: "heading",
                    label: "Heading",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "paragraphs",
                    label: "Paragraphs",
                    list: true,
                    ui: {
                      component: "textarea",
                    },
                  },
                ],
              },
              /* ── Accordion FAQ ────────────────────────── */
              {
                name: "accordionFAQ",
                label: "Accordion FAQ",
                fields: [
                  {
                    type: "string",
                    name: "sectionTitle",
                    label: "Section Title",
                  },
                  {
                    type: "string",
                    name: "sectionSubtitle",
                    label: "Section Subtitle",
                  },
                  {
                    type: "boolean",
                    name: "allowMultiple",
                    label: "Allow Multiple Open",
                    description: "Let users open multiple FAQ items at once",
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "FAQ Items",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => ({
                        label: item?.question || "New FAQ",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "question",
                        label: "Question",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "answer",
                        label: "Answer",
                        required: true,
                        ui: { component: "textarea" },
                      },
                    ],
                  },
                ],
              },
              /* ── Rich Text ───────────────────────────── */
              {
                name: "richText",
                label: "Rich Text",
                fields: [
                  {
                    type: "rich-text",
                    name: "body",
                    label: "Content",
                  },
                ],
              },
              /* ── Split Layout ─────────────────────────── */
              {
                name: "splitLayout",
                label: "Split Layout",
                fields: [
                  {
                    type: "string",
                    name: "ratio",
                    label: "Column Ratio",
                    options: ["50/50", "40/60", "60/40", "30/70", "70/30"],
                  },
                  {
                    type: "string",
                    name: "gap",
                    label: "Gap",
                    options: ["none", "sm", "md", "lg", "xl"],
                  },
                  {
                    type: "string",
                    name: "verticalAlign",
                    label: "Vertical Alignment",
                    options: ["start", "center", "end", "stretch"],
                  },
                  {
                    type: "boolean",
                    name: "reverseOnMobile",
                    label: "Reverse on Mobile",
                  },
                  {
                    type: "object",
                    name: "left",
                    label: "Left Column",
                    list: true,
                    templates: [innerRichTextTemplate, innerImageTemplate],
                  },
                  {
                    type: "object",
                    name: "right",
                    label: "Right Column",
                    list: true,
                    templates: [innerRichTextTemplate, innerImageTemplate],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
