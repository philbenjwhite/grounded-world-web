# Route Migration Summary: WordPress to Next.js

## Overview

| Category | Count |
|----------|-------|
| WordPress published pages | 58 |
| WordPress published posts | 86 |
| **Total WordPress routes** | **144** |
| New site routes | 133 |
| Routes that exist (with or without path change) | 127 |
| Routes missing from new site | 16 |
| Routes to skip (maintenance page) | 1 |

---

## Redirects Needed for Vercel

Every WordPress route that maps to a new site route with a different path needs a redirect. These fall into three categories:

### 1. Page Path Changes (need 301 redirects)

| Old Path | New Path |
|----------|----------|
| `/about-us/` | `/about` |
| `/brand-marketing-agency-services/` | `/services` |
| `/brand-marketing-agency-services__trashed/brand-activation-agency/` | `/services/activation` |
| `/brand-marketing-agency-services__trashed/brand-strategy-agency/` | `/services/strategy` |
| `/brand-marketing-agency-services__trashed/creative-impact-agency/` | `/services/impact` |
| `/brand-marketing-agency-services__trashed/market-research-agency/` | `/services/research` |
| `/contact-us/` | `/contact` |
| `/newsletter-sign-up/` | `/newsletter` |

### 2. Our Work Slug Changes (need 301 redirects)

All `/our-work/` case studies had prefixes like `our-work-` or `our-work_` stripped:

| Old Path | New Path |
|----------|----------|
| `/our-work/our-work-_mule-men/` | `/our-work/mule-men` |
| `/our-work/our-work-_slumberland-ergo-smart-base/` | `/our-work/slumberland-ergo-smart-base` |
| `/our-work/our-work-_slumberland-tsi/` | `/our-work/slumberland-tsi` |
| `/our-work/our-work-_tempur-sealy-ashley-furniture/` | `/our-work/tempur-sealy-ashley-furniture` |
| `/our-work/our-work-fresh-air-fund/` | `/our-work/fresh-air-fund` |
| `/our-work/our-work-interdesign/` | `/our-work/interdesign` |
| `/our-work/our-work-lycra/` | `/our-work/lycra` |
| `/our-work/our-work-marys-center/` | `/our-work/marys-center` |
| `/our-work/our-work-network-of-executive-women/` | `/our-work/network-of-executive-women` |
| `/our-work/our-work-onesight/` | `/our-work/onesight` |
| `/our-work/our-work-plan-x-unsplash/` | `/our-work/plan-x-unsplash` |
| `/our-work/our-work-points4purpose/` | `/our-work/points4purpose` |
| `/our-work/our-work-safeground/` | `/our-work/safeground` |
| `/our-work/our-work-she-should-run/` | `/our-work/she-should-run` |
| `/our-work/our-work-tree-free/` | `/our-work/tree-free` |
| `/our-work/our-work-tribes-on-the-edge/` | `/our-work/tribes-on-the-edge` |
| `/our-work/our-work-whistlepig/` | `/our-work/whistlepig` |
| `/our-work/our-work_lycra_qira-farm-to-fiber-vr-tour/` | `/our-work/lycra-qira-farm-to-fiber-vr-tour` |
| `/our-work/our-work_lycra_qira-farm-to-fiber/` | `/our-work/lycra-qira-farm-to-fiber` |
| `/our-work/our-work_lycra_qira-farmer-docuseries/` | `/our-work/lycra-qira-farmer-docuseries` |
| `/our-work/our-work_lycra_qira-transforming-field-corn-to-fiber/` | `/our-work/lycra-qira-transforming-field-corn-to-fiber` |
| `/our-work/our-work_qira/` | `/our-work/qira` |
| `/our-work/our-work_the-lycra-company/` | `/our-work/the-lycra-company` |
| `/our-work/our-work_wasu/` | `/our-work/wasu` |
| `/our-work/our-work_whistlepig-pit-viper/` | `/our-work/whistlepig-pit-viper` |

### 3. Blog Post Category Prefix Changes (need 301 redirects)

ALL 86 blog posts moved from `/{category-slug}/{post-slug}/` to `/resources/articles/{post-slug}`. The WordPress category prefixes include:
- `/activating-brand-purpose-and-sustainability/`
- `/brand-activation/partnerships-community/`
- `/brand-activation/retail-shopper/`
- `/brand-activation/strategy/`
- `/brand-purpose-agency/foundations/`
- `/brand-purpose-agency/people-and-planet/`
- `/brand-purpose-agency/purpose-in-action/`
- `/brand-purpose-agency/purpose-in-business/`
- `/brand-purpose-agency/sustainability-communication/`
- `/activism/`
- `/brand-activism-and-storytelling/`
- `/featured/`
- `/social-impact/`
- `/sustainability-marketing/`
- `/sustainability/`
- `/template/`

---

## Missing Routes (Decision Needed)

These WordPress pages have NO equivalent in the new site. The client needs to decide: redirect to a related page, recreate, or let 404.

| WordPress Path | Title | Suggested Action |
|---------------|-------|-----------------|
| `/about-us/matt-deasy/` | Matt Deasy (bio) | Redirect to `/about` or recreate as section |
| `/about-us/paloma-jacome/` | Paloma Jacome (bio) | Redirect to `/about` or recreate as section |
| `/about-us/phil-white/` | Phil White (bio) | Redirect to `/about` or recreate as section |
| `/activating-brand-purpose-agency/` | How To: Activating Brand Purpose | Redirect to `/services` or `/resources/articles` |
| `/brand-activism-agency-new/` | How To: Brand Activism Agency | Redirect to `/services` or `/resources/articles` |
| `/brand-activism-agency/` | How To: Brand Activism | Redirect to `/services` or `/resources/articles` |
| `/grounded-sizzle-video/` | Sizzle Reel | Redirect to `/` or `/about` |
| `/non-profit-marketing-services/` | Non-profit Marketing | Redirect to `/services` |
| `/nonprofit-branding-agency/` | How To: Nonprofits Branding | Redirect to `/services` or `/resources/articles` |
| `/privacy-policy-its-time-to-get-grounded/` | Privacy Policy | Recreate or redirect to footer link |
| `/social-impact-agency/` | How To: Social Impact Agency | Redirect to `/services` |
| `/start-up-branding-agency/` | How To: Branding for Startups | Redirect to `/services` or `/resources/articles` |
| `/sustainability-marketing-agency/` | How To: Sustainability Marketing | Redirect to `/services` |
| `/sustainable-fashion/` | Sustainable Fashion | Redirect to `/resources/articles` |
| `/terms/` | Terms & Conditions | Recreate or redirect |
| `/thank-you/` | Thank You (form confirmation) | Recreate as inline confirmation or create page |

---

## Notes

- WordPress uses trailing slashes; Vercel/Next.js typically does not. Vercel handles this automatically.
- The `hello-world` post exists in the new site content but was not found in the WordPress export (likely a WordPress default post that was deleted).
- The `z-impact-measurement-test` post appears to be test content in both sites.
- WordPress category landing pages (e.g., `/brand-activation/`, `/brand-purpose-agency/`) may also receive traffic and should redirect to `/resources/articles`.
