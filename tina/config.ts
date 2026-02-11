import { defineConfig, LocalAuthProvider } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

// Check if running in local mode
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

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
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
