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
    {
      type: "string" as const,
      name: "maxWidth",
      label: "Max Width",
      description: "e.g. 300px, 24rem",
    },
    {
      type: "boolean" as const,
      name: "contain",
      label: "Contain (for logos/diagrams)",
    },
    {
      type: "string" as const,
      name: "layout",
      label: "Layout",
      options: [
        { value: "fill", label: "Fill (default)" },
        { value: "centered", label: "Centered with padding" },
      ],
    },
    {
      type: "string" as const,
      name: "animate",
      label: "Animation",
      options: [
        { value: "float", label: "Float (gentle bob)" },
      ],
    },
  ],
};

const innerIntentionStatsTemplate = {
  name: "intentionStats" as const,
  label: "97% vs 13% Animated Pie Charts",
  fields: [
    {
      type: "string" as const,
      name: "_placeholder",
      label: "No configuration needed — renders the animated 97% vs 13% intention-action gap charts",
    },
  ],
};

const innerEmbedTemplate = {
  name: "embed" as const,
  label: "Embed (iframe)",
  fields: [
    {
      type: "string" as const,
      name: "code",
      label: "Embed Code (HTML)",
      ui: { component: "textarea" as const },
    },
  ],
};

const innerButtonGroupTemplate = {
  name: "buttonGroup" as const,
  label: "Button Group",
  fields: [
    {
      type: "object" as const,
      name: "buttons",
      label: "Buttons",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({
          label: item?.label || "New Button",
        }),
      },
      fields: [
        {
          type: "string" as const,
          name: "label",
          label: "Label",
          required: true,
        },
        {
          type: "string" as const,
          name: "href",
          label: "Link",
          required: true,
        },
        {
          type: "image" as const,
          name: "uploadedFile",
          label: "Upload File (PDF)",
          description: "Upload a PDF — overrides the Link field above when set",
        },
        {
          type: "string" as const,
          name: "variant",
          label: "Style",
          options: ["primary", "secondary", "outline"],
        },
        {
          type: "boolean" as const,
          name: "external",
          label: "Open in New Tab",
        },
      ],
    },
  ],
};

/* Icon options for Phosphor icon picker fields */
const iconOptions = [
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
  { value: "Trophy", label: "Trophy" },
  { value: "Leaf", label: "Leaf" },
  { value: "MicrophoneStage", label: "Microphone Stage" },
  { value: "Article", label: "Article" },
  { value: "BookOpenText", label: "Book Open Text" },
  { value: "EnvelopeSimple", label: "Envelope" },
  { value: "ChatCircleDots", label: "Chat Bubble" },
  { value: "Handshake", label: "Handshake" },
  { value: "ShoppingBag", label: "Shopping Bag" },
];

const innerExpandingCardsTemplate = {
  name: "expandingCards" as const,
  label: "Expanding Cards",
  fields: [
    {
      type: "number" as const,
      name: "defaultActiveIndex",
      label: "Default Expanded Card",
      description: "Index of the card expanded on page load (0-based)",
    },
    {
      type: "object" as const,
      name: "items",
      label: "Card Items",
      list: true,
      ui: {
        itemProps: (item: Record<string, string>) => ({
          label: item?.name || "New Item",
        }),
      },
      fields: [
        {
          type: "string" as const,
          name: "name",
          label: "Name",
          required: true,
        },
        {
          type: "string" as const,
          name: "color",
          label: "Color",
          required: true,
          ui: { component: "color" as const },
        },
        {
          type: "string" as const,
          name: "icon",
          label: "Icon",
          options: iconOptions,
        },
        {
          type: "string" as const,
          name: "tagline",
          label: "Tagline",
          required: true,
        },
        {
          type: "string" as const,
          name: "bullets",
          label: "Bullet Points",
          list: true,
        },
        {
          type: "string" as const,
          name: "ctaHref",
          label: "CTA Link",
          required: true,
        },
        {
          type: "string" as const,
          name: "ctaLabel",
          label: "CTA Text",
          description: "Default: 'Find Out More'",
        },
        {
          type: "image" as const,
          name: "imageSrc",
          label: "Image",
        },
        {
          type: "string" as const,
          name: "imageAlt",
          label: "Image Alt Text",
        },
      ],
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

  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN || null,
      stopwordLanguages: ["eng"],
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
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
            options: iconOptions,
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
        name: "teamMember",
        label: "Team Members",
        path: "content/team-members",
        format: "json",
        ui: {
          router: ({ document }) => {
            return `/about-us/${document._sys.filename}`;
          },
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
            name: "role",
            label: "Role / Title",
            required: true,
          },
          {
            type: "string",
            name: "shortBio",
            label: "Short Bio",
            description: "Brief bio shown in article sidebars (1-2 sentences)",
            ui: { component: "textarea" },
          },
          {
            type: "rich-text",
            name: "bio",
            label: "Full Bio",
            description: "Full biography shown on the team member profile page",
          },
          {
            type: "image",
            name: "photoUrl",
            label: "Photo",
            description: "Headshot image for team member and author bio sections",
          },
          {
            type: "string",
            name: "linkedinUrl",
            label: "LinkedIn URL",
          },
          {
            type: "number",
            name: "displayOrder",
            label: "Display Order",
            description: "Order in team listings (lower numbers appear first)",
          },
          {
            type: "boolean",
            name: "active",
            label: "Active",
            description: "Show this team member on the site",
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
            name: "icon",
            label: "Placeholder Icon",
            description: "Icon shown on article cards when no featured image is set",
            options: iconOptions,
          },
          {
            type: "string",
            name: "placeholderColor",
            label: "Placeholder Color",
            description: "Accent color for the placeholder icon and gradient (hex, e.g. #00AEEF)",
            ui: {
              component: "color",
            },
          },
        ],
      },
      {
        name: "project",
        label: "Projects",
        path: "content/projects",
        format: "json",
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
            description:
              "Heading displayed on the carousel card and project page",
          },
          {
            type: "string",
            name: "client",
            label: "Client",
            required: true,
            description: "Client or brand name (e.g. 'Plan International')",
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
              "Background image displayed on carousel cards and social sharing",
          },
          {
            type: "image",
            name: "logoImage",
            label: "Logo Image",
            description:
              "Client logo displayed on carousel cards (white/transparent PNG recommended)",
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
          },
          {
            type: "string",
            name: "seoDescription",
            label: "SEO Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "sections",
            label: "Page Sections",
            list: true,
            templates: [
              {
                name: "heroImage",
                label: "Hero Image",
                fields: [
                  {
                    type: "image",
                    name: "src",
                    label: "Image",
                  },
                  {
                    type: "string",
                    name: "alt",
                    label: "Alt Text",
                  },
                ],
              },
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
              {
                name: "image",
                label: "Image",
                fields: [
                  {
                    type: "image",
                    name: "src",
                    label: "Image",
                  },
                  {
                    type: "string",
                    name: "alt",
                    label: "Alt Text",
                  },
                  {
                    type: "string",
                    name: "caption",
                    label: "Caption",
                  },
                ],
              },
              {
                name: "video",
                label: "Video Embed",
                fields: [
                  {
                    type: "string",
                    name: "videoUrl",
                    label: "Video URL",
                    description: "Vimeo or YouTube URL",
                  },
                ],
              },
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
                    templates: [innerRichTextTemplate, innerImageTemplate, innerButtonGroupTemplate],
                  },
                  {
                    type: "object",
                    name: "right",
                    label: "Right Column",
                    list: true,
                    templates: [innerRichTextTemplate, innerImageTemplate, innerButtonGroupTemplate],
                  },
                ],
              },
              {
                name: "ctaBanner",
                label: "CTA Banner",
                fields: [
                  {
                    type: "image",
                    name: "backgroundSrc",
                    label: "Background Image",
                  },
                  {
                    type: "string",
                    name: "heading",
                    label: "Heading",
                  },
                  {
                    type: "string",
                    name: "buttonText",
                    label: "Button Text",
                  },
                  {
                    type: "string",
                    name: "buttonUrl",
                    label: "Button URL",
                  },
                ],
              },
              {
                name: "linkCards",
                label: "Link Cards",
                fields: [
                  {
                    type: "object",
                    name: "cards",
                    label: "Cards",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => ({
                        label: item?.heading || "New Card",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "heading",
                        label: "Heading",
                      },
                      {
                        type: "string",
                        name: "buttonLabel",
                        label: "Button Label",
                      },
                      {
                        type: "string",
                        name: "href",
                        label: "URL",
                      },
                      {
                        type: "boolean",
                        name: "external",
                        label: "Open in New Tab",
                      },
                      {
                        type: "image",
                        name: "backgroundSrc",
                        label: "Background Image",
                      },
                    ],
                  },
                ],
              },
            ],
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
          router: ({ document }) => `/resources/articles/${document._sys.filename}`,
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
            type: "reference",
            name: "author",
            label: "Author",
            collections: ["teamMember"],
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
            templates: [
              {
                name: "ctaBanner",
                label: "CTA Banner",
                fields: [
                  {
                    type: "image" as const,
                    name: "backgroundSrc",
                    label: "Background Image",
                    required: true,
                  },
                  {
                    type: "string" as const,
                    name: "heading",
                    label: "Heading",
                    required: true,
                  },
                  {
                    type: "string" as const,
                    name: "subtext",
                    label: "Subtext",
                  },
                  {
                    type: "string" as const,
                    name: "primaryLabel",
                    label: "Button Label",
                    required: true,
                  },
                  {
                    type: "string" as const,
                    name: "primaryHref",
                    label: "Button Link",
                    required: true,
                  },
                  {
                    type: "boolean" as const,
                    name: "primaryExternal",
                    label: "Open in New Tab",
                  },
                  {
                    type: "string" as const,
                    name: "overlayOpacity",
                    label: "Overlay Opacity",
                    options: ["light", "medium", "heavy"],
                  },
                ],
              },
              {
                name: "splitLayout",
                label: "Split Layout",
                fields: [
                  {
                    type: "image" as const,
                    name: "imageSrc",
                    label: "Image",
                    required: true,
                  },
                  {
                    type: "string" as const,
                    name: "imageAlt",
                    label: "Image Alt Text",
                  },
                  {
                    type: "rich-text" as const,
                    name: "content",
                    label: "Content",
                  },
                  {
                    type: "string" as const,
                    name: "imagePosition",
                    label: "Image Position",
                    options: [
                      { value: "left", label: "Left" },
                      { value: "right", label: "Right" },
                    ],
                  },
                  {
                    type: "string" as const,
                    name: "ratio",
                    label: "Column Ratio",
                    options: [
                      { value: "50/50", label: "50 / 50" },
                      { value: "40/60", label: "40 / 60" },
                      { value: "60/40", label: "60 / 40" },
                    ],
                  },
                ],
              },
              {
                name: "imageGallery",
                label: "Image Gallery",
                fields: [
                  {
                    type: "string" as const,
                    name: "layout",
                    label: "Layout",
                    options: [
                      { value: "grid-2", label: "2 Columns" },
                      { value: "grid-3", label: "3 Columns" },
                    ],
                  },
                  {
                    type: "object" as const,
                    name: "images",
                    label: "Images",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => ({
                        label: item?.alt || item?.caption || "Image",
                      }),
                    },
                    fields: [
                      {
                        type: "image" as const,
                        name: "src",
                        label: "Image",
                        required: true,
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
                    ],
                  },
                ],
              },
              {
                name: "pullQuote",
                label: "Pull Quote",
                fields: [
                  {
                    type: "string" as const,
                    name: "quote",
                    label: "Quote Text",
                    required: true,
                    ui: {
                      component: "textarea",
                    },
                  },
                  {
                    type: "string" as const,
                    name: "attribution",
                    label: "Attribution",
                    description: "Who said this (optional)",
                  },
                  {
                    type: "string" as const,
                    name: "style",
                    label: "Style",
                    options: [
                      { value: "default", label: "Default" },
                      { value: "highlight", label: "Highlight" },
                      { value: "bordered", label: "Bordered" },
                    ],
                  },
                ],
              },
            ],
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
            if (slug === "gaia") return "/gaia";
            if (slug === "itshouldntbethishard") return "/resources/podcast";
            if (slug.startsWith("resources-")) return `/${slug.replace("resources-", "resources/")}`;
            if (slug.startsWith("services-")) return `/${slug.replace("services-", "services/")}`;
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
            type: "string",
            name: "seoTitle",
            label: "SEO Title",
            description:
              "Custom title for search engines (defaults to page title if empty)",
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
            type: "image",
            name: "seoImage",
            label: "Social Share Image",
            description:
              "Image shown when this page is shared on social media (recommended 1200x630px)",
          },
          {
            type: "boolean",
            name: "noIndex",
            label: "Hide from Search Engines",
            description:
              "When enabled, this page will not be indexed by search engines",
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
                    name: "canvasVariant",
                    label: "Canvas Variant",
                    description: "Optional custom canvas background (leave empty for default plexus)",
                    options: [
                      { value: "podcastWaves", label: "Podcast Waves (Cyan & Magenta)" },
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
                      { value: "condensed", label: "Condensed" },
                      { value: "fit", label: "Fit Content" },
                    ],
                  },
                  {
                    type: "boolean",
                    name: "bottomFade",
                    label: "Bottom Fade",
                    description: "Show a gradient that bleeds into the next section",
                  },
                  {
                    type: "image",
                    name: "featureImageSrc",
                    label: "Feature Image",
                    description: "Decorative image shown on the right side of the hero",
                  },
                  {
                    type: "string",
                    name: "featureImageAlt",
                    label: "Feature Image Alt Text",
                  },
                  {
                    type: "image",
                    name: "badgeSrc",
                    label: "Badge Image",
                    description:
                      "Small overlay badge shown in the bottom-left corner of the hero (e.g. B Corp logo)",
                  },
                  {
                    type: "string",
                    name: "badgeAlt",
                    label: "Badge Alt Text",
                  },
                  {
                    type: "string",
                    name: "highlightsDescription",
                    label: "Highlights Box Description",
                    description: "Optional paragraph shown inside the highlights box above the bullet items",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "string",
                    name: "highlights",
                    label: "Highlight Items",
                    list: true,
                    description: "Service items shown in a bordered box on the hero",
                  },
                  {
                    type: "string",
                    name: "highlightColor",
                    label: "Highlight Border Color",
                    description: "Accent color for the highlight box border and bullet dots",
                    options: [
                      { value: "var(--color-magenta)", label: "Magenta" },
                      { value: "var(--color-cyan)", label: "Cyan" },
                      { value: "var(--color-gold)", label: "Gold" },
                    ],
                  },
                  {
                    type: "boolean",
                    name: "highlightsInRight",
                    label: "Highlights on Right",
                    description: "Move the highlights box (and feature image) to a right column, keeping title/subtitle/CTA on the left",
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
                    type: "number",
                    name: "columns",
                    label: "Columns",
                    description: "Number of columns (1, 2, 3, or 4). Default 3.",
                  },
                  {
                    type: "string",
                    name: "variant",
                    label: "Card Variant",
                    description: "overlay = text over image, stacked = text below image",
                    options: ["overlay", "stacked"],
                  },
                  {
                    type: "string",
                    name: "sectionVariant",
                    label: "Section Background",
                    options: ["default", "alt", "dark"],
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
                      {
                        type: "boolean",
                        name: "imageContain",
                        label: "Contain Image (logos/diagrams)",
                      },
                      {
                        type: "string",
                        name: "imageBg",
                        label: "Image Background Color",
                        ui: { component: "color" },
                      },
                      {
                        type: "number",
                        name: "typingDelay",
                        label: "Typing Delay (ms)",
                        description: "Start delay for Gaia typing animation (e.g. 1200, 5000)",
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
                        options: iconOptions,
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
              /* ── Project Carousel ─────────────────────── */
              {
                name: "projectCarousel",
                label: "Project Carousel",
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
                    label: "Project Items",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => {
                        const ref = item?.project;
                        if (!ref) return { label: "Select a project" };
                        const name = ref
                          .replace(/^content\/projects\//, "")
                          .replace(/\.(md|json)$/, "")
                          .replace(/-/g, " ");
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
                        name: "project",
                        label: "Project",
                        collections: ["project"],
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
                    name: "sectionLabel",
                    label: "Section Label",
                    description: "Small uppercase label above the content",
                  },
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
                    type: "boolean",
                    name: "stickyLeft",
                    label: "Sticky Left Column",
                    description: "Make the left column sticky on desktop scroll",
                  },
                  {
                    type: "boolean",
                    name: "fullBleedImage",
                    label: "Full-Bleed Image",
                    description: "Make the right-side image extend edge-to-edge with no container padding",
                  },
                  {
                    type: "string",
                    name: "sectionVariant",
                    label: "Section Background",
                    description: "Background color variant for visual separation",
                    options: ["default", "alt", "dark"],
                  },
                  {
                    type: "object",
                    name: "left",
                    label: "Left Column",
                    list: true,
                    templates: [innerRichTextTemplate, innerImageTemplate, innerButtonGroupTemplate, innerExpandingCardsTemplate, innerEmbedTemplate, innerIntentionStatsTemplate],
                  },
                  {
                    type: "object",
                    name: "right",
                    label: "Right Column",
                    list: true,
                    templates: [innerRichTextTemplate, innerImageTemplate, innerButtonGroupTemplate, innerExpandingCardsTemplate, innerEmbedTemplate, innerIntentionStatsTemplate],
                  },
                ],
              },
              /* ── Feature Cards ─────────────────────────── */
              {
                name: "featureCards",
                label: "Feature Cards",
                fields: [
                  {
                    type: "string",
                    name: "sectionLabel",
                    label: "Section Label",
                    description: "Small uppercase label above heading",
                  },
                  {
                    type: "string",
                    name: "heading",
                    label: "Heading",
                    required: true,
                  },
                  {
                    type: "number",
                    name: "columns",
                    label: "Columns",
                    description: "Number of columns (default: 3)",
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Cards",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => ({
                        label: item?.title || "New Card",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "icon",
                        label: "Icon",
                        options: iconOptions,
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
                        name: "title",
                        label: "Title",
                      },
                      {
                        type: "string",
                        name: "body",
                        label: "Body Text",
                        ui: { component: "textarea" },
                      },
                    ],
                  },
                ],
              },
              /* ── Podcast Hero ──────────────────────────── */
              {
                name: "podcastHero",
                label: "Podcast Hero",
                fields: [
                  {
                    type: "string",
                    name: "podcastLabel",
                    label: "Label",
                  },
                  {
                    type: "string",
                    name: "podcastTitle",
                    label: "Title",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "podcastSubtitle",
                    label: "Subtitle",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "image",
                    name: "podcastThumbnail",
                    label: "Thumbnail Image",
                  },
                  {
                    type: "string",
                    name: "podcastThumbnailAlt",
                    label: "Thumbnail Alt Text",
                  },
                  {
                    type: "string",
                    name: "podcastYoutubeId",
                    label: "YouTube Video ID",
                  },
                ],
              },
              /* ── Podcast Apply Section ─────────────────── */
              {
                name: "podcastApply",
                label: "Podcast Apply Section",
                fields: [
                  {
                    type: "string",
                    name: "applyHeading",
                    label: "Heading",
                  },
                  {
                    type: "string",
                    name: "applyDescription",
                    label: "Description",
                    ui: { component: "textarea" },
                  },
                ],
              },
              /* ── Contact Section ───────────────────────── */
              {
                name: "contactSection",
                label: "Contact Section",
                fields: [
                  {
                    type: "string",
                    name: "heading",
                    label: "Heading",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Description",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "string",
                    name: "bookingUrl",
                    label: "Booking URL",
                  },
                  {
                    type: "string",
                    name: "bookingLabel",
                    label: "Booking Button Label",
                  },
                  {
                    type: "string",
                    name: "email",
                    label: "Contact Email",
                  },
                ],
              },
              /* ── Content Tabs ──────────────────────────── */
              {
                name: "contentTabs",
                label: "Content Tabs",
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
                    label: "Default Active Tab",
                    description: "Index of the tab active on page load (0-based)",
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Tabs",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => ({
                        label: item?.title || "New Tab",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "title",
                        label: "Tab Title",
                      },
                      {
                        type: "string",
                        name: "icon",
                        label: "Icon",
                        options: iconOptions,
                      },
                      {
                        type: "string",
                        name: "color",
                        label: "Accent Color",
                        required: true,
                        ui: { component: "color" },
                      },
                      {
                        type: "string",
                        name: "subtitle",
                        label: "Content Heading",
                      },
                      {
                        type: "string",
                        name: "body",
                        label: "Body Text",
                        description: "Use **bold** for emphasis. Separate paragraphs with blank lines. Start lines with 1. 2. etc. for numbered lists.",
                        ui: { component: "textarea" },
                      },
                      {
                        type: "string",
                        name: "videoSrc",
                        label: "Video URL",
                        description: "Vimeo or YouTube URL to embed",
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
                        name: "buttonLabel",
                        label: "Button Label",
                      },
                      {
                        type: "string",
                        name: "buttonHref",
                        label: "Button Link",
                      },
                      {
                        type: "boolean",
                        name: "buttonExternal",
                        label: "Open Button in New Tab",
                      },
                      {
                        type: "object",
                        name: "subsections",
                        label: "Subsections",
                        list: true,
                        ui: {
                          itemProps: (item: Record<string, string>) => ({
                            label: item?.heading || "New Subsection",
                          }),
                        },
                        fields: [
                          {
                            type: "string",
                            name: "heading",
                            label: "Heading",
                          },
                          {
                            type: "string",
                            name: "body",
                            label: "Body Text",
                            ui: { component: "textarea" },
                          },
                          {
                            type: "string",
                            name: "videoSrc",
                            label: "Video URL",
                            description: "Vimeo or YouTube URL to embed",
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
                ],
              },
              /* ── Testimonial Section ───────────────────── */
              {
                name: "testimonialSection",
                label: "Testimonial Section",
                fields: [
                  {
                    type: "string",
                    name: "quote",
                    label: "Quote",
                    required: true,
                    ui: { component: "textarea" },
                  },
                  {
                    type: "string",
                    name: "author",
                    label: "Author Name",
                  },
                  {
                    type: "string",
                    name: "role",
                    label: "Role / Title",
                  },
                  {
                    type: "string",
                    name: "company",
                    label: "Company",
                  },
                  {
                    type: "number",
                    name: "rating",
                    label: "Star Rating (1-5)",
                    description: "Number of filled stars to display",
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
              /* ── Image Carousel ────────────────────────── */
              {
                name: "imageCarousel",
                label: "Image Carousel",
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
                    ui: { component: "textarea" },
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Slides",
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
                        type: "string",
                        name: "description",
                        label: "Description",
                        ui: { component: "textarea" },
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
              /* ── CTA Banner ────────────────────────────── */
              {
                name: "ctaBanner",
                label: "CTA Banner",
                fields: [
                  {
                    type: "image",
                    name: "backgroundSrc",
                    label: "Background Image",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "backgroundAlt",
                    label: "Background Alt Text",
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
                    name: "heading",
                    label: "Heading",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "subtext",
                    label: "Subtext (optional)",
                    ui: { component: "textarea" },
                  },
                  /* ── Primary button ── */
                  {
                    type: "string",
                    name: "primaryLabel",
                    label: "Primary Button Label",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "primaryHref",
                    label: "Primary Button Link",
                    description: "Use /page-slug for internal pages, or https://... for external URLs",
                    required: true,
                  },
                  {
                    type: "boolean",
                    name: "primaryExternal",
                    label: "Open primary link in a new tab",
                  },
                  /* ── Secondary button (optional — leave blank to show only one button) ── */
                  {
                    type: "string",
                    name: "secondaryLabel",
                    label: "Secondary Button Label (optional)",
                    description: "Leave blank to show only one button",
                  },
                  {
                    type: "string",
                    name: "secondaryHref",
                    label: "Secondary Button Link",
                    description: "Use /page-slug for internal pages, or https://... for external URLs",
                  },
                  {
                    type: "boolean",
                    name: "secondaryExternal",
                    label: "Open secondary link in a new tab",
                  },
                  {
                    type: "string",
                    name: "className",
                    label: "Custom CSS Classes",
                  },
                ],
              },
              /* ── Newsletter CTA ─────────────────────────── */
              {
                name: "newsletterCta",
                label: "Newsletter CTA",
                fields: [
                  {
                    type: "image",
                    name: "backgroundSrc",
                    label: "Background Image",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "backgroundAlt",
                    label: "Background Alt Text",
                  },
                  {
                    type: "string",
                    name: "newsletterHeading",
                    label: "Heading",
                  },
                  {
                    type: "string",
                    name: "newsletterSubtext",
                    label: "Subtext",
                    ui: { component: "textarea" },
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
                    name: "bookingEyebrow",
                    label: "Booking CTA Eyebrow",
                  },
                  {
                    type: "string",
                    name: "bookingHeading",
                    label: "Booking CTA Heading",
                  },
                  {
                    type: "string",
                    name: "bookingSubtext",
                    label: "Booking CTA Subtext",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "string",
                    name: "bookingLabel",
                    label: "Booking Button Label",
                  },
                  {
                    type: "string",
                    name: "bookingHref",
                    label: "Booking Button URL",
                  },
                ],
              },
              /* ── Embed Section ──────────────────────────── */
              {
                name: "embedSection",
                label: "Embed Section",
                fields: [
                  {
                    type: "string",
                    name: "embedHeading",
                    label: "Heading",
                  },
                  {
                    type: "string",
                    name: "embedDescription",
                    label: "Description",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "string",
                    name: "embedMode",
                    label: "Mode",
                    options: [
                      { value: "placeholder", label: "Placeholder" },
                      { value: "embed", label: "Embed Code" },
                      { value: "gaiaChat", label: "Gaia Chat" },
                    ],
                  },
                  {
                    type: "string",
                    name: "embedCode",
                    label: "Embed Code (HTML / Script)",
                    description: "Paste an iframe or script tag. Only shown when Mode is 'Embed Code'.",
                    ui: { component: "textarea" },
                  },
                  {
                    type: "number",
                    name: "embedMinHeight",
                    label: "Minimum Height (px)",
                    description: "Minimum height of the embed area in pixels (default 600)",
                  },
                ],
              },
              /* ── Logo Grid ─────────────────────────────── */
              {
                name: "logoGrid",
                label: "Logo Grid",
                fields: [
                  {
                    type: "object",
                    name: "logos",
                    label: "Logos",
                    list: true,
                    fields: [
                      {
                        type: "image",
                        name: "src",
                        label: "Logo Image",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "alt",
                        label: "Alt Text",
                        required: true,
                      },
                      {
                        type: "string",
                        name: "href",
                        label: "Link URL",
                        description: "Optional link when the logo is clicked",
                      },
                    ],
                  },
                ],
              },
              /* ── Card Grid ─────────────────────────────── */
              {
                name: "cardGrid",
                label: "Card Grid",
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
                    ui: { component: "textarea" },
                  },
                  {
                    type: "number",
                    name: "columns",
                    label: "Columns",
                    description: "Number of columns (default: 2)",
                  },
                  {
                    type: "object",
                    name: "items",
                    label: "Cards",
                    list: true,
                    ui: {
                      itemProps: (item: Record<string, string>) => ({
                        label: item?.title || "New Card",
                      }),
                    },
                    fields: [
                      {
                        type: "string",
                        name: "icon",
                        label: "Icon",
                        options: iconOptions,
                      },
                      {
                        type: "string",
                        name: "iconColor",
                        label: "Icon Color",
                        description: "CSS color value (e.g. var(--color-azure-1), #FF08CC)",
                      },
                      {
                        type: "string",
                        name: "title",
                        label: "Title",
                      },
                      {
                        type: "string",
                        name: "subtitle",
                        label: "Subtitle",
                      },
                      {
                        type: "string",
                        name: "body",
                        label: "Body Text",
                        ui: { component: "textarea" },
                      },
                      {
                        type: "string",
                        name: "href",
                        label: "Link",
                        description: "URL the card links to (e.g. /resources/podcast)",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      /* ── Global Settings (singleton) ───────────────────── */
      {
        name: "global",
        label: "Global Settings",
        path: "content/global",
        format: "json",
        ui: {
          global: true,
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        match: {
          include: "index",
        },
        fields: [
          {
            type: "string",
            name: "siteTitle",
            label: "Default Site Title",
            description:
              "Used when a page doesn't set its own SEO title",
          },
          {
            type: "string",
            name: "siteDescription",
            label: "Default Site Description",
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "titleTemplate",
            label: "Title Template",
            description:
              "Pattern for page titles, e.g. '%s | Grounded World'",
          },
          {
            type: "image",
            name: "defaultOgImage",
            label: "Default Social Share Image",
            description:
              "Fallback image for social sharing when a page doesn't set its own (recommended 1200x630px)",
          },
          {
            type: "object",
            name: "social",
            label: "Social Links",
            fields: [
              {
                type: "string",
                name: "linkedin",
                label: "LinkedIn URL",
              },
              {
                type: "string",
                name: "instagram",
                label: "Instagram URL",
              },
              {
                type: "string",
                name: "twitter",
                label: "Twitter / X URL",
              },
            ],
          },
          {
            type: "object",
            name: "newsletter",
            label: "Newsletter",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
              },
              {
                type: "string",
                name: "body",
                label: "Body Copy",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "successMessage",
                label: "Success Message",
                description: "Shown after successful subscription (e.g. \"You're now Grounded!\")",
              },
              {
                type: "string",
                name: "emailPlaceholder",
                label: "Email Placeholder",
                description: "Placeholder text for the email input",
              },
              {
                type: "string",
                name: "buttonLabel",
                label: "Button Label",
                description: "Text on the subscribe button",
              },
              {
                type: "string",
                name: "disclaimer",
                label: "Disclaimer Text",
                description: "Small print below the form (e.g. \"No spam, ever. Unsubscribe anytime.\")",
              },
            ],
          },
          /* ── Navigation ── */
          {
            type: "object",
            name: "navigation",
            label: "Navigation",
            fields: [
              {
                type: "object",
                name: "mainLinks",
                label: "Main Navigation Links",
                list: true,
                ui: {
                  itemProps: (item: Record<string, string>) => ({
                    label: item?.label || "New Link",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "href",
                    label: "URL",
                    required: true,
                  },
                ],
              },
              {
                type: "object",
                name: "resourceLinks",
                label: "Resource Dropdown Links",
                list: true,
                ui: {
                  itemProps: (item: Record<string, string>) => ({
                    label: item?.label || "New Link",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "href",
                    label: "URL",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "color",
                    label: "Accent Color",
                    ui: { component: "color" },
                  },
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon",
                    options: iconOptions,
                  },
                ],
              },
              {
                type: "string",
                name: "subscribeLabel",
                label: "Subscribe Button Label",
                description: "Text on the header subscribe button",
              },
              {
                type: "string",
                name: "contactLabel",
                label: "Contact Button Label",
                description: "Text on the header contact CTA",
              },
              {
                type: "string",
                name: "contactHref",
                label: "Contact Button URL",
              },
            ],
          },
          /* ── Footer ── */
          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [
              {
                type: "object",
                name: "serviceLinks",
                label: "Service Links",
                list: true,
                ui: {
                  itemProps: (item: Record<string, string>) => ({
                    label: item?.label || "New Link",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "href",
                    label: "URL",
                    required: true,
                  },
                ],
              },
              {
                type: "object",
                name: "companyLinks",
                label: "Company Links",
                list: true,
                ui: {
                  itemProps: (item: Record<string, string>) => ({
                    label: item?.label || "New Link",
                  }),
                },
                fields: [
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "href",
                    label: "URL",
                    required: true,
                  },
                ],
              },
              {
                type: "string",
                name: "servicesHeading",
                label: "Services Column Heading",
              },
              {
                type: "string",
                name: "resourcesHeading",
                label: "Resources Column Heading",
              },
              {
                type: "string",
                name: "companyHeading",
                label: "Company Column Heading",
              },
              {
                type: "string",
                name: "copyrightText",
                label: "Copyright Text",
                description: "Use {year} for the current year, e.g. '\u00a9 {year} Grounded World'",
              },
            ],
          },
          /* ── Contact Form ── */
          {
            type: "object",
            name: "contactForm",
            label: "Contact Form",
            fields: [
              {
                type: "string",
                name: "heading",
                label: "Heading",
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "eyebrow",
                label: "Eyebrow Text",
                description: "Small uppercase text above the heading",
              },
              {
                type: "string",
                name: "bookingLabel",
                label: "Booking Button Label",
              },
              {
                type: "string",
                name: "email",
                label: "Contact Email Address",
              },
              {
                type: "string",
                name: "emailContextText",
                label: "Email Context Text",
                description: "Text around the email link (use {email} as placeholder)",
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "interestOptions",
                label: "Interest Dropdown Options",
                list: true,
                description: "Options in the 'What are you interested in?' dropdown",
              },
              {
                type: "string",
                name: "successHeading",
                label: "Success Heading",
                description: "Shown after form submission",
              },
              {
                type: "string",
                name: "successMessage",
                label: "Success Message",
                description: "Shown below the success heading",
              },
              {
                type: "string",
                name: "submitLabel",
                label: "Submit Button Label",
              },
              {
                type: "string",
                name: "sendingLabel",
                label: "Sending Button Label",
                description: "Text shown while form is submitting",
              },
              {
                type: "string",
                name: "errorMessage",
                label: "Error Message",
              },
              {
                type: "boolean",
                name: "textWrapBalance",
                label: "Balance Text Wrapping",
                description: "Apply text-wrap: balance to paragraph text for more even line lengths",
              },
            ],
          },
        ],
      },
    ],
  },
});
