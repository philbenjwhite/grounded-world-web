# Storybook Setup

Storybook has been successfully set up for your Next.js project with TinaCMS and Tailwind CSS.

## Quick Start

### Development Mode
Run Storybook in development mode:
```bash
npm run storybook
```
This will start Storybook at [http://localhost:6006](http://localhost:6006)

### Production Build
Build Storybook as static files:
```bash
npm run build-storybook
```
This will generate static files in `public/storybook/`

## Accessing Storybook in Production

After building Storybook with `npm run build-storybook`, the static files are placed in the `public/storybook` directory. When you deploy your Next.js app, Storybook will be accessible at:

```
https://your-domain.com/storybook
```

The built Storybook files are served directly by Next.js from the public folder.

### Routing Configuration

The [next.config.ts](next.config.ts) includes a rewrite rule to properly serve the Storybook index page:

```typescript
async rewrites() {
  return {
    beforeFiles: [
      {
        source: '/storybook',
        destination: '/storybook/index.html',
      },
    ],
  };
}
```

This ensures that accessing `/storybook` loads the Storybook UI correctly.

## Configuration

### Files Created
- [.storybook/main.ts](.storybook/main.ts) - Main Storybook configuration
- [.storybook/preview.ts](.storybook/preview.ts) - Preview configuration with Tailwind CSS imports
- [src/components/Button.tsx](src/components/Button.tsx) - Example component
- [src/components/Button.stories.tsx](src/components/Button.stories.tsx) - Example story

### Tailwind CSS Integration

Your custom design system tokens are integrated via [src/app/globals.css](src/app/globals.css):

```css
@theme inline {
  --color-primary: var(--primitive-brand-ca7436, #CA7436);
  --color-primary-hover: var(--primitive-brand-eb7f31, #EB7F31);
  --color-primary-active: var(--primitive-brand-f39552, #F39552);
}
```

Components can use these tokens via Tailwind classes:
```tsx
<button className="bg-primary hover:bg-primary-hover">
  Click me
</button>
```

## Writing Stories

Create new stories by adding files with the pattern `*.stories.tsx` in your `src` directory:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './YourComponent';

const meta = {
  title: 'Components/YourComponent',
  component: YourComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof YourComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Your component props
  },
};
```

## Deployment

When deploying to production:

1. Run `npm run build-storybook` to generate static files
2. The files in `public/storybook/` will be included in your Next.js build
3. Access Storybook at `/storybook` on your deployed site

Note: The `public/storybook` directory is git-ignored to avoid committing build artifacts. Make sure to run `build-storybook` as part of your CI/CD pipeline.

## Design System Integration

Your project uses a semantic token system:
- **Primitives** - Raw values from Figma (e.g., `#CA7436`)
- **Semantic Tokens** - CSS variables that reference primitives (e.g., `--color-primary`)
- **Tailwind Classes** - Utility classes that reference semantic tokens (e.g., `bg-primary`)

This allows AI tools to generate consistent code using standard Tailwind classes while maintaining your custom design system.

## Addons Included

- **@storybook/addon-a11y** - Accessibility testing
- **@storybook/addon-docs** - Automatic documentation
- **@chromatic-com/storybook** - Visual testing integration
- **@storybook/addon-vitest** - Vitest integration for component testing
