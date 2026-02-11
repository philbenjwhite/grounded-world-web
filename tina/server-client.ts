import { createClient } from "tinacms/dist/client";
import { queries } from "./__generated__/types";

/**
 * TinaCMS client for use in server components.
 *
 * The auto-generated client uses a relative URL (/api/tina/gql) which works
 * in the browser but fails in Node (server components) because there's no
 * host to resolve against. This client points directly at the local TinaCMS
 * GraphQL server for dev, and uses the TinaCloud URL for production.
 */
const serverClient = createClient({
  url:
    process.env.TINA_PUBLIC_IS_LOCAL === "true"
      ? "http://localhost:3000/api/tina/gql"
      : `https://content.tinajs.io/content/${process.env.NEXT_PUBLIC_TINA_CLIENT_ID}/github/${process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || "main"}`,
  token: process.env.TINA_TOKEN || "",
  queries,
});

export default serverClient;
