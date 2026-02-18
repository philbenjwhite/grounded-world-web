// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated files — do not lint
    "tina/__generated__/**",
    // Utility scripts — not part of the Next.js app bundle
    "scripts/**",
  ]),
  ...storybook.configs["flat/recommended"],
  // Stories import types from @storybook/react which is the correct peer-dep
  // of @storybook/nextjs-vite. Downgrade the "use framework package" advisory
  // from error to off so it doesn't block the build.
  {
    files: ["**/*.stories.tsx", "**/*.stories.ts"],
    rules: {
      "storybook/no-renderer-packages": "off",
    },
  },
]);

export default eslintConfig;
