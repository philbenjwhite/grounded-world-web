# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with TinaCMS integration (requires TINA_PUBLIC_IS_LOCAL=true)
- `npm run build` - Build production app with TinaCMS and Storybook
- `npm run build:no-tina` - Build without TinaCMS for local testing
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run storybook` - Start Storybook development server on port 6006
- `npm run build-storybook` - Build static Storybook to public/storybook

## Architecture Overview

This is a Next.js 16 application using the App Router with TinaCMS for content management and Storybook for component development.

### Core Technologies
- **Next.js 16** with App Router (TypeScript)
- **TinaCMS** for headless content management
- **Tailwind CSS v4** for styling with custom design tokens
- **Storybook** for component library and development
- **Vitest + Playwright** for testing

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components with collocated stories
- `content/` - Markdown content files managed by TinaCMS (posts and pages)
- `tina/` - TinaCMS configuration and schema definitions
- `docs/` - Comprehensive project documentation
- `public/storybook/` - Built Storybook accessible at /storybook in production

### Component Architecture
Components follow a collocated structure:
```
src/components/ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.stories.tsx  # Storybook stories
└── index.ts                  # Barrel export
```

### Design System
Uses CSS custom properties for design tokens defined in `src/app/globals.css`. Components use Figma design token variables:
- `--color-primary`, `--color-primary-hover`, `--color-primary-active`
- `--size-*` for spacing and sizing
- `--stroke-*` and `--surface-*` for UI colors
- `--text-*` for text colors

Access design tokens via Tailwind: `bg-[var(--color-primary)]` or through Tailwind config extensions.

### Content Management
TinaCMS configuration in `tina/config.ts` defines:
- Collections: "post" (blog posts) and "page" (static pages)
- Content stored as markdown in `content/posts/` and `content/pages/`
- Local development uses local auth (`TINA_PUBLIC_IS_LOCAL=true`)
- Production requires `TINA_TOKEN` and `NEXT_PUBLIC_TINA_CLIENT_ID`
- Admin interface accessible at `/admin`

### Key Development Notes
- Use `npm run dev` for full development with TinaCMS
- Storybook runs independently on port 6006 for component development
- ESLint configuration uses Next.js and Storybook plugins
- Built Storybook is served at `/storybook` in production
- Design tokens should be used consistently across all components