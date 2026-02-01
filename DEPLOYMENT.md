# Deployment Guide

## Vercel Deployment Setup

### Required Environment Variables

To deploy this application to Vercel, you need to configure the following environment variables:

#### 1. TinaCMS Configuration

Go to your Vercel project **Settings** → **Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `TINA_TOKEN` | Your TinaCMS token from [tina.io](https://tina.io) | Production, Preview, Development |
| `NEXT_PUBLIC_TINA_CLIENT_ID` | `a4ccb5ba-cc43-4405-9416-f3c25272c9d8` | Production, Preview, Development |

#### How to Get Your TINA_TOKEN:

1. Go to [tina.io](https://tina.io)
2. Sign in to your TinaCMS account
3. Navigate to your project
4. Go to **Settings** → **Tokens**
5. Create a new token or copy your existing token
6. Add this token to Vercel as `TINA_TOKEN`

### Build Configuration

The project is configured with [vercel.json](vercel.json) to use the Next.js framework and run the custom build command.

The build process includes:
1. TinaCMS schema generation (`tinacms build`)
2. Next.js build (`next build`)
3. Storybook static build (`build-storybook`)

If you need to build without TinaCMS (for testing):
```bash
npm run build:no-tina
```

### Vercel Configuration

The [vercel.json](vercel.json) file specifies:
- Framework: Next.js (handles output directory automatically)
- Build command: `npm run build` (includes TinaCMS and Storybook)

### Storybook Access

After deployment, Storybook will be accessible at:
```
https://your-domain.vercel.app/storybook
```

The static Storybook files are built during the deployment process and served from the `public/storybook` directory.

## Local Development

For local development, TinaCMS runs in local mode:

```bash
npm run dev
```

This sets `TINA_PUBLIC_IS_LOCAL=true` which uses local authentication and content API.

## Troubleshooting

### Build fails with "No Output Directory named 'dist' found"

**Cause:** Vercel doesn't recognize the Next.js framework automatically.

**Solution:** The [vercel.json](vercel.json) file has been added to specify the Next.js framework. This should be automatically detected on the next deployment.

### Build fails with "Missing token" error

**Cause:** `TINA_TOKEN` is not set in Vercel environment variables.

**Solution:** Add the `TINA_TOKEN` environment variable in Vercel dashboard as described above.

### Storybook not accessible after deployment

**Cause:** Storybook wasn't built during the deployment.

**Solution:** The build script automatically runs `build-storybook`. Ensure the build completes successfully. Check Vercel build logs.

### TinaCMS Admin not loading

**Cause:** Client ID or token misconfiguration.

**Solution:**
1. Verify `NEXT_PUBLIC_TINA_CLIENT_ID` is set correctly
2. Verify `TINA_TOKEN` is valid and not expired
3. Check [tina/config.ts](tina/config.ts) for configuration issues

## Additional Resources

- [TinaCMS Documentation](https://tina.io/docs/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Storybook Documentation](https://storybook.js.org/docs)
