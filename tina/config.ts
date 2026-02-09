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
            type: "string",
            name: "category",
            label: "Category",
            options: [
              { value: "brand-purpose", label: "Brand Purpose" },
              { value: "sustainability", label: "Sustainability" },
              { value: "brand-activism", label: "Brand Activism" },
              { value: "social-impact", label: "Social Impact" },
              { value: "retail-shopper", label: "Retail & Shopper" },
              { value: "strategy", label: "Strategy" },
              { value: "b-corps", label: "B-Corps" },
              { value: "partnerships", label: "Partnerships & Community" },
            ],
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
