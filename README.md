# Grounded World Website

Next.js web application with TinaCMS for content management, Storybook for component development, and a custom design system built with Tailwind CSS.

## 📚 Documentation

- **[Designer's Guide](docs/DESIGNER_GUIDE.md)** - Complete guide for designers creating components with AI
- **[Quick Start Cheat Sheet](docs/DESIGNER_QUICK_START.md)** - One-page reference for designers
- **[Storybook Setup](docs/STORYBOOK_SETUP.md)** - Storybook configuration and usage
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Vercel deployment instructions

## 🚀 Quick Start

### For Designers Creating Components

1. Read the [Designer's Guide](docs/DESIGNER_GUIDE.md) for the full workflow
2. Or jump to the [Quick Start](docs/DESIGNER_QUICK_START.md) for a cheat sheet
3. View components in Storybook: `npm run storybook`

### For Developers

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 🎨 Design System

The project includes a custom design system with:
- **Design Tokens** - Semantic color variables defined in [src/app/globals.css](src/app/globals.css)
- **Tailwind CSS** - Utility-first CSS framework
- **Storybook** - Component library and documentation

### Design Tokens

```css
--color-primary: #CA7436
--color-primary-hover: #EB7F31
--color-primary-active: #F39552
```

Use in components:
```tsx
<button className="bg-primary hover:bg-primary-hover">
  Click me
</button>
```

## 📦 Project Structure

```
grounded-world-web/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   └── Button/      # Example: collocated component structure
│   │       ├── Button.tsx
│   │       ├── Button.stories.tsx
│   │       └── index.ts
│   └── stories/         # Storybook example stories
├── .storybook/          # Storybook configuration
├── tina/                # TinaCMS configuration
└── public/              # Static assets
```

## 🧪 Storybook

View and develop components in isolation:

```bash
# Development
npm run storybook

# Build static Storybook
npm run build-storybook
```

Access Storybook in production: `https://your-domain.com/storybook`

## 📝 Content Management

This project uses [TinaCMS](https://tina.io) for content management:

- **Admin panel**: `/admin`
- **Local development**: Uses local authentication
- **Production**: Requires `TINA_TOKEN` environment variable

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for setup instructions.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
