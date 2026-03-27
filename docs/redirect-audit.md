# Redirect Audit: WordPress to Next.js

**Date:** 2026-03-27
**Sources:** Production sitemap crawl, client-annotated spreadsheet, local codebase verification
**Production:** https://grounded.world (WordPress)
**New site:** Next.js App Router

---

## Discrepancies Between Client Spreadsheet and Actual Codebase

The client's Google Sheet has some mappings that don't match what's built. These need to be resolved before implementing redirects.

### Service page slugs

| Client Spreadsheet Says | Actual Local Slug | File |
|---|---|---|
| [/services/activation](https://grounded-world-web-staging.vercel.app/services/activation) | [/services/activate](https://grounded-world-web-staging.vercel.app/services/activate) | `services-activate.json` |
| [/services/strategy](https://grounded-world-web-staging.vercel.app/services/strategy) | [/services/articulate](https://grounded-world-web-staging.vercel.app/services/articulate) | `services-articulate.json` |
| [/services/impact](https://grounded-world-web-staging.vercel.app/services/impact) | [/services/accelerate](https://grounded-world-web-staging.vercel.app/services/accelerate) | `services-accelerate.json` |
| [/services/research](https://grounded-world-web-staging.vercel.app/services/research) | [/services/discover](https://grounded-world-web-staging.vercel.app/services/discover) | `services-discover.json` |

**Decision needed:** Rename the content files to match the client's preferred slugs, or update the spreadsheet to match what's built?

### About page path

| Client Spreadsheet Says | Actual Local Path |
|---|---|
| [/about-us/](https://grounded-world-web-staging.vercel.app/about-us/) -> [/about](https://grounded-world-web-staging.vercel.app/about) | [/about-us](https://grounded-world-web-staging.vercel.app/about-us) exists as a page route |

The local site has `/about-us` (matching WordPress). The existing redirect in `next.config.ts` goes `/about` -> `/about-us`, which is the opposite of what the spreadsheet says. The current code looks correct — keep `/about-us` as the canonical path.

### Contact page path

| Client Spreadsheet Says | Actual Local Path |
|---|---|
| [/contact-us/](https://grounded-world-web-staging.vercel.app/contact-us/) -> [/contact](https://grounded-world-web-staging.vercel.app/contact) | [/contact-us](https://grounded-world-web-staging.vercel.app/contact-us) (via TinaCMS page `contact-us.json`) |

No `/contact` route exists. The local site serves `/contact-us` matching WordPress. No redirect needed unless the path is intentionally changing.

### Missing team member

The client spreadsheet includes [/about-us/heidi-schoeneck/](https://grounded.world/about-us/heidi-schoeneck/) marked "need to create". No `heidi-schoeneck.json` exists in `content/team-members/`.

### "How To Guide" pages

The client wants these kept and placed under a new Resources "How To" section (marked as critical for E-E-A-T):

- [/activating-brand-purpose-agency/](https://grounded.world/activating-brand-purpose-agency/) — TinaCMS page exists (`activating-brand-purpose-agency.json`)
- [/sustainability-marketing-agency/](https://grounded.world/sustainability-marketing-agency/) — TinaCMS page exists (`sustainability-marketing-agency.json`)
- [/brand-activism-agency-new/](https://grounded.world/brand-activism-agency-new/) — **No local page exists**
- [/social-impact-agency/](https://grounded.world/social-impact-agency/) — **No local page exists**

Two "How To Guide" pages exist as TinaCMS content (`guides-brand-activism.json`, `guides-social-impact.json`) but it's unclear if these are wired to routes.

### Blog post URL structure — UNRESOLVED (from March 3 + March 20 calls)

Matt raised a significant concern about stripping category keywords from blog post URLs. The posts under `/brand-purpose-agency/...`, `/brand-activation/...`, etc. were **intentionally structured for topical authority** — their category-rich URLs contributed to getting the homepage to #1 for "brand purpose agency."

> "I do think the URLs in those ones were playing a role because they were like grounded.world/brand-purpose-agency/subcategory/sub-subcategory" — Matt, March 20

> "given that all of those blog posts...because they all say brand purpose in the URL, I wonder if taking away brand purpose URL might affect that homepage ranking?" — Matt, March 3

Matt distinguishes between two types of posts:
- **Topical authority / resource-based posts** (under `/brand-purpose-agency/`, `/brand-activation/`) — Matt says these URLs "were playing a role" in SEO rankings. Stripping categories may hurt topical authority signals.
- **Regular thought leadership posts** (under `/activating-brand-purpose-and-sustainability/`, `/featured/`, etc.) — Matt confirmed "these can all be changed."

Matt said he wanted to **discuss with Phil before making a final decision** (March 3). It's unclear if that conversation happened. The current plan redirects all 86 posts to `/resources/articles/{slug}`, which strips all category keywords.

**Options:**
1. Keep `/resources/articles/{slug}` for all posts (current plan — simplest, but may affect SEO)
2. Preserve category in URL for topical authority posts: `/resources/brand-purpose-agency/{slug}`, `/resources/brand-activation/{slug}`
3. Keep original URLs entirely for the resource-based posts (no redirect needed if slug stays the same)

**This must be resolved with Matt/Phil before implementing blog post redirects.**

### Podcast page — strategy undecided

Matt mentioned on March 3 that "Phil is planning on stopping the podcast anyway." On March 20, the action item was to "Confirm podcast page strategy w/ Phil & Heidi; then implement tabs or remove." Currently exists at both `/itshouldntbethishard` and `/resources/podcast`. Decision pending.

### `/project/` vs `/our-work/` URL confusion

On March 20, Alec noticed some items go to `/project/{slug}` while case studies go to `/our-work/{slug}`. There may be stray `/project/` URLs that need redirecting to `/our-work/`.

---

## Summary

| Category | Count | Redirect Implemented | Missing |
|----------|------:|---------------------:|--------:|
| Page path changes | 7 | 1 | 6 |
| Case study slug changes | 24 | 0 | 24 |
| Blog post redirects | 86 | 0 | 86 |
| Old sitemap URLs | 4 | 0 | 4 |
| Category landing pages | 9 | 0 | 9 |
| Pages to delete (404) | 7 | n/a | n/a |
| Pages to create | 3 | n/a | n/a |
| **Total redirects needed** | **~130** | **1** | **~129** |

### Currently implemented in `next.config.ts`

```
/about -> /about-us (301 permanent)
```

That's it. Everything else is missing.

---

## 1. Page Path Changes (need 301 redirects)

| WordPress Path | Next.js Path | Status |
|---|---|---|
| [/brand-marketing-agency-services/](https://grounded.world/brand-marketing-agency-services/) | [/services](https://grounded-world-web-staging.vercel.app/services) | **Missing** |
| [/brand-marketing-agency-services__trashed/brand-activation-agency/](https://grounded.world/brand-marketing-agency-services__trashed/brand-activation-agency/) | [/services/activate](https://grounded-world-web-staging.vercel.app/services/activate) | **Missing** |
| [/brand-marketing-agency-services__trashed/brand-strategy-agency/](https://grounded.world/brand-marketing-agency-services__trashed/brand-strategy-agency/) | [/services/articulate](https://grounded-world-web-staging.vercel.app/services/articulate) | **Missing** |
| [/brand-marketing-agency-services__trashed/creative-impact-agency/](https://grounded.world/brand-marketing-agency-services__trashed/creative-impact-agency/) | [/services/accelerate](https://grounded-world-web-staging.vercel.app/services/accelerate) | **Missing** |
| [/brand-marketing-agency-services__trashed/market-research-agency/](https://grounded.world/brand-marketing-agency-services__trashed/market-research-agency/) | [/services/discover](https://grounded-world-web-staging.vercel.app/services/discover) | **Missing** |
| [/newsletter-sign-up/](https://grounded.world/newsletter-sign-up/) | [/newsletter](https://grounded-world-web-staging.vercel.app/newsletter) | **Missing** |
| [/about](https://grounded.world/about) | [/about-us](https://grounded-world-web-staging.vercel.app/about-us) | Implemented |

## 2. Old Sitemap URLs (need 301 redirects)

These are indexed by Google via the production sitemap:

| WordPress Path | Redirect To |
|---|---|
| [/our-voice/](https://grounded.world/our-voice/) | [/resources](https://grounded-world-web-staging.vercel.app/resources) |
| [/our-latest-thinking/](https://grounded.world/our-latest-thinking/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/our-latest-thinking/startup-nonprofits-branding-new/](https://grounded.world/our-latest-thinking/startup-nonprofits-branding-new/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/our-latest-thinking/activating-brand-purpose/](https://grounded.world/our-latest-thinking/activating-brand-purpose/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/our-latest-thinking/brand-activism-new/](https://grounded.world/our-latest-thinking/brand-activism-new/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/our-latest-thinking/social-impact-agencies-new/](https://grounded.world/our-latest-thinking/social-impact-agencies-new/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |

## 3. Case Study Slug Changes (need 301 redirects)

All 24 case studies had `our-work-` or `our-work_` prefixes stripped. Can be handled with regex redirects:

```
/our-work/our-work-_:slug  ->  /our-work/:slug
/our-work/our-work-:slug   ->  /our-work/:slug
/our-work/our-work_:slug   ->  /our-work/:slug
```

| WordPress Path | Next.js Path |
|---|---|
| [/our-work/our-work-_mule-men/](https://grounded.world/our-work/our-work-_mule-men/) | [/our-work/mule-men](https://grounded-world-web-staging.vercel.app/our-work/mule-men) |
| [/our-work/our-work-_slumberland-ergo-smart-base/](https://grounded.world/our-work/our-work-_slumberland-ergo-smart-base/) | [/our-work/slumberland-ergo-smart-base](https://grounded-world-web-staging.vercel.app/our-work/slumberland-ergo-smart-base) |
| [/our-work/our-work-_slumberland-tsi/](https://grounded.world/our-work/our-work-_slumberland-tsi/) | [/our-work/slumberland-tsi](https://grounded-world-web-staging.vercel.app/our-work/slumberland-tsi) |
| [/our-work/our-work-_tempur-sealy-ashley-furniture/](https://grounded.world/our-work/our-work-_tempur-sealy-ashley-furniture/) | [/our-work/tempur-sealy-ashley-furniture](https://grounded-world-web-staging.vercel.app/our-work/tempur-sealy-ashley-furniture) |
| [/our-work/our-work-fresh-air-fund/](https://grounded.world/our-work/our-work-fresh-air-fund/) | [/our-work/fresh-air-fund](https://grounded-world-web-staging.vercel.app/our-work/fresh-air-fund) |
| [/our-work/our-work-interdesign/](https://grounded.world/our-work/our-work-interdesign/) | [/our-work/interdesign](https://grounded-world-web-staging.vercel.app/our-work/interdesign) |
| [/our-work/our-work-lycra/](https://grounded.world/our-work/our-work-lycra/) | [/our-work/lycra](https://grounded-world-web-staging.vercel.app/our-work/lycra) |
| [/our-work/our-work-marys-center/](https://grounded.world/our-work/our-work-marys-center/) | [/our-work/marys-center](https://grounded-world-web-staging.vercel.app/our-work/marys-center) |
| [/our-work/our-work-network-of-executive-women/](https://grounded.world/our-work/our-work-network-of-executive-women/) | [/our-work/network-of-executive-women](https://grounded-world-web-staging.vercel.app/our-work/network-of-executive-women) |
| [/our-work/our-work-onesight/](https://grounded.world/our-work/our-work-onesight/) | [/our-work/onesight](https://grounded-world-web-staging.vercel.app/our-work/onesight) |
| [/our-work/our-work-plan-x-unsplash/](https://grounded.world/our-work/our-work-plan-x-unsplash/) | [/our-work/plan-x-unsplash](https://grounded-world-web-staging.vercel.app/our-work/plan-x-unsplash) |
| [/our-work/our-work-points4purpose/](https://grounded.world/our-work/our-work-points4purpose/) | [/our-work/points4purpose](https://grounded-world-web-staging.vercel.app/our-work/points4purpose) |
| [/our-work/our-work-safeground/](https://grounded.world/our-work/our-work-safeground/) | [/our-work/safeground](https://grounded-world-web-staging.vercel.app/our-work/safeground) |
| [/our-work/our-work-she-should-run/](https://grounded.world/our-work/our-work-she-should-run/) | [/our-work/she-should-run](https://grounded-world-web-staging.vercel.app/our-work/she-should-run) |
| [/our-work/our-work-tree-free/](https://grounded.world/our-work/our-work-tree-free/) | [/our-work/tree-free](https://grounded-world-web-staging.vercel.app/our-work/tree-free) |
| [/our-work/our-work-tribes-on-the-edge/](https://grounded.world/our-work/our-work-tribes-on-the-edge/) | [/our-work/tribes-on-the-edge](https://grounded-world-web-staging.vercel.app/our-work/tribes-on-the-edge) |
| [/our-work/our-work-whistlepig/](https://grounded.world/our-work/our-work-whistlepig/) | [/our-work/whistlepig](https://grounded-world-web-staging.vercel.app/our-work/whistlepig) |
| [/our-work/our-work_lycra_qira-farm-to-fiber-vr-tour/](https://grounded.world/our-work/our-work_lycra_qira-farm-to-fiber-vr-tour/) | [/our-work/lycra-qira-farm-to-fiber-vr-tour](https://grounded-world-web-staging.vercel.app/our-work/lycra-qira-farm-to-fiber-vr-tour) |
| [/our-work/our-work_lycra_qira-farm-to-fiber/](https://grounded.world/our-work/our-work_lycra_qira-farm-to-fiber/) | [/our-work/lycra-qira-farm-to-fiber](https://grounded-world-web-staging.vercel.app/our-work/lycra-qira-farm-to-fiber) |
| [/our-work/our-work_lycra_qira-farmer-docuseries/](https://grounded.world/our-work/our-work_lycra_qira-farmer-docuseries/) | [/our-work/lycra-qira-farmer-docuseries](https://grounded-world-web-staging.vercel.app/our-work/lycra-qira-farmer-docuseries) |
| [/our-work/our-work_lycra_qira-transforming-field-corn-to-fiber/](https://grounded.world/our-work/our-work_lycra_qira-transforming-field-corn-to-fiber/) | [/our-work/lycra-qira-transforming-field-corn-to-fiber](https://grounded-world-web-staging.vercel.app/our-work/lycra-qira-transforming-field-corn-to-fiber) |
| [/our-work/our-work_qira/](https://grounded.world/our-work/our-work_qira/) | [/our-work/qira](https://grounded-world-web-staging.vercel.app/our-work/qira) |
| [/our-work/our-work_the-lycra-company/](https://grounded.world/our-work/our-work_the-lycra-company/) | [/our-work/the-lycra-company](https://grounded-world-web-staging.vercel.app/our-work/the-lycra-company) |
| [/our-work/our-work_wasu/](https://grounded.world/our-work/our-work_wasu/) | [/our-work/wasu](https://grounded-world-web-staging.vercel.app/our-work/wasu) |
| [/our-work/our-work_whistlepig-pit-viper/](https://grounded.world/our-work/our-work_whistlepig-pit-viper/) | [/our-work/whistlepig-pit-viper](https://grounded-world-web-staging.vercel.app/our-work/whistlepig-pit-viper) |

## 4. Blog Post Category Redirects (86 posts)

All posts moved from `/{category}/{slug}/` to `/resources/articles/{slug}`. Can be handled with wildcard redirects per category prefix.

| WordPress Path | Next.js Path |
|---|---|
| [/activating-brand-purpose-and-sustainability/61-b-corp-gift-ideas-for-green-friday/](https://grounded.world/activating-brand-purpose-and-sustainability/61-b-corp-gift-ideas-for-green-friday/) | [/resources/articles/61-b-corp-gift-ideas-for-green-friday](https://grounded-world-web-staging.vercel.app/resources/articles/61-b-corp-gift-ideas-for-green-friday) |
| [/activating-brand-purpose-and-sustainability/a-future-without-cigarettes-shouldnt-be-this-hard-jennifer-motles/](https://grounded.world/activating-brand-purpose-and-sustainability/a-future-without-cigarettes-shouldnt-be-this-hard-jennifer-motles/) | [/resources/articles/a-future-without-cigarettes-shouldnt-be-this-hard-jennifer-motles](https://grounded-world-web-staging.vercel.app/resources/articles/a-future-without-cigarettes-shouldnt-be-this-hard-jennifer-motles) |
| [/activating-brand-purpose-and-sustainability/avoid-greenwashing/](https://grounded.world/activating-brand-purpose-and-sustainability/avoid-greenwashing/) | [/resources/articles/avoid-greenwashing](https://grounded-world-web-staging.vercel.app/resources/articles/avoid-greenwashing) |
| [/activating-brand-purpose-and-sustainability/bridging-the-intention-action-gap-in-sustainable-behavior/](https://grounded.world/activating-brand-purpose-and-sustainability/bridging-the-intention-action-gap-in-sustainable-behavior/) | [/resources/articles/bridging-the-intention-action-gap-in-sustainable-behavior](https://grounded-world-web-staging.vercel.app/resources/articles/bridging-the-intention-action-gap-in-sustainable-behavior) |
| [/activating-brand-purpose-and-sustainability/cancel-culture-in-climate/](https://grounded.world/activating-brand-purpose-and-sustainability/cancel-culture-in-climate/) | [/resources/articles/cancel-culture-in-climate](https://grounded-world-web-staging.vercel.app/resources/articles/cancel-culture-in-climate) |
| [/activating-brand-purpose-and-sustainability/circular-brand-activation-in-switzerland-how-qwstion-id-geneve-and-zuriga-are-building-regenerative-brands/](https://grounded.world/activating-brand-purpose-and-sustainability/circular-brand-activation-in-switzerland-how-qwstion-id-geneve-and-zuriga-are-building-regenerative-brands/) | [/resources/articles/circular-brand-activation-in-switzerland-how-qwstion-id-geneve-and-zuriga-are-building-regenerative-brands](https://grounded-world-web-staging.vercel.app/resources/articles/circular-brand-activation-in-switzerland-how-qwstion-id-geneve-and-zuriga-are-building-regenerative-brands) |
| [/activating-brand-purpose-and-sustainability/circular-cities-switzerland-urban-design-innovation/](https://grounded.world/activating-brand-purpose-and-sustainability/circular-cities-switzerland-urban-design-innovation/) | [/resources/articles/circular-cities-switzerland-urban-design-innovation](https://grounded-world-web-staging.vercel.app/resources/articles/circular-cities-switzerland-urban-design-innovation) |
| [/activating-brand-purpose-and-sustainability/circular-economy-in-switzerland/](https://grounded.world/activating-brand-purpose-and-sustainability/circular-economy-in-switzerland/) | [/resources/articles/circular-economy-in-switzerland](https://grounded-world-web-staging.vercel.app/resources/articles/circular-economy-in-switzerland) |
| [/activating-brand-purpose-and-sustainability/closing-the-intention-action-gap-why-good-intentions-arent-always-enough-during-earth-month/](https://grounded.world/activating-brand-purpose-and-sustainability/closing-the-intention-action-gap-why-good-intentions-arent-always-enough-during-earth-month/) | [/resources/articles/closing-the-intention-action-gap-why-good-intentions-arent-always-enough-during-earth-month](https://grounded-world-web-staging.vercel.app/resources/articles/closing-the-intention-action-gap-why-good-intentions-arent-always-enough-during-earth-month) |
| [/activating-brand-purpose-and-sustainability/convenience-without-conscience-the-sustainability-gap-in-grocery-delivery/](https://grounded.world/activating-brand-purpose-and-sustainability/convenience-without-conscience-the-sustainability-gap-in-grocery-delivery/) | [/resources/articles/convenience-without-conscience-the-sustainability-gap-in-grocery-delivery](https://grounded-world-web-staging.vercel.app/resources/articles/convenience-without-conscience-the-sustainability-gap-in-grocery-delivery) |
| [/activating-brand-purpose-and-sustainability/fair-price-for-coffee-shouldnt-be-this-hard-bob-michelle-fish/](https://grounded.world/activating-brand-purpose-and-sustainability/fair-price-for-coffee-shouldnt-be-this-hard-bob-michelle-fish/) | [/resources/articles/fair-price-for-coffee-shouldnt-be-this-hard-bob-michelle-fish](https://grounded-world-web-staging.vercel.app/resources/articles/fair-price-for-coffee-shouldnt-be-this-hard-bob-michelle-fish) |
| [/activating-brand-purpose-and-sustainability/fighting-food-waste-shouldnt-be-this-hard/](https://grounded.world/activating-brand-purpose-and-sustainability/fighting-food-waste-shouldnt-be-this-hard/) | [/resources/articles/fighting-food-waste-shouldnt-be-this-hard](https://grounded-world-web-staging.vercel.app/resources/articles/fighting-food-waste-shouldnt-be-this-hard) |
| [/activating-brand-purpose-and-sustainability/gender-equality-5-ways-brands-can-take-action/](https://grounded.world/activating-brand-purpose-and-sustainability/gender-equality-5-ways-brands-can-take-action/) | [/resources/articles/gender-equality-5-ways-brands-can-take-action](https://grounded-world-web-staging.vercel.app/resources/articles/gender-equality-5-ways-brands-can-take-action) |
| [/activating-brand-purpose-and-sustainability/get-grounded-in-the-plastic-reality-project-with-paloma-jacome/](https://grounded.world/activating-brand-purpose-and-sustainability/get-grounded-in-the-plastic-reality-project-with-paloma-jacome/) | [/resources/articles/get-grounded-in-the-plastic-reality-project-with-paloma-jacome](https://grounded-world-web-staging.vercel.app/resources/articles/get-grounded-in-the-plastic-reality-project-with-paloma-jacome) |
| [/activating-brand-purpose-and-sustainability/going-circular-the-story-of-decathlon/](https://grounded.world/activating-brand-purpose-and-sustainability/going-circular-the-story-of-decathlon/) | [/resources/articles/going-circular-the-story-of-decathlon](https://grounded-world-web-staging.vercel.app/resources/articles/going-circular-the-story-of-decathlon) |
| [/activating-brand-purpose-and-sustainability/green-friday-brand-activation-inspiring-sustainable-choices-instead-of-black-friday/](https://grounded.world/activating-brand-purpose-and-sustainability/green-friday-brand-activation-inspiring-sustainable-choices-instead-of-black-friday/) | [/resources/articles/green-friday-brand-activation-inspiring-sustainable-choices-instead-of-black-friday](https://grounded-world-web-staging.vercel.app/resources/articles/green-friday-brand-activation-inspiring-sustainable-choices-instead-of-black-friday) |
| [/activating-brand-purpose-and-sustainability/how-social-innovation-is-closing-the-wellness-gap/](https://grounded.world/activating-brand-purpose-and-sustainability/how-social-innovation-is-closing-the-wellness-gap/) | [/resources/articles/how-social-innovation-is-closing-the-wellness-gap](https://grounded-world-web-staging.vercel.app/resources/articles/how-social-innovation-is-closing-the-wellness-gap) |
| [/activating-brand-purpose-and-sustainability/making-earth-day-every-day-shouldnt-be-this-hard-kathleen-rogers/](https://grounded.world/activating-brand-purpose-and-sustainability/making-earth-day-every-day-shouldnt-be-this-hard-kathleen-rogers/) | [/resources/articles/making-earth-day-every-day-shouldnt-be-this-hard-kathleen-rogers](https://grounded-world-web-staging.vercel.app/resources/articles/making-earth-day-every-day-shouldnt-be-this-hard-kathleen-rogers) |
| [/activating-brand-purpose-and-sustainability/mental-health-meets-marketing/](https://grounded.world/activating-brand-purpose-and-sustainability/mental-health-meets-marketing/) | [/resources/articles/mental-health-meets-marketing](https://grounded-world-web-staging.vercel.app/resources/articles/mental-health-meets-marketing) |
| [/activating-brand-purpose-and-sustainability/plastic-free-july-unoc3-insights/](https://grounded.world/activating-brand-purpose-and-sustainability/plastic-free-july-unoc3-insights/) | [/resources/articles/plastic-free-july-unoc3-insights](https://grounded-world-web-staging.vercel.app/resources/articles/plastic-free-july-unoc3-insights) |
| [/activating-brand-purpose-and-sustainability/pride-2025-beige-pride-pinkhushing-brand-activism-at-its-best/](https://grounded.world/activating-brand-purpose-and-sustainability/pride-2025-beige-pride-pinkhushing-brand-activism-at-its-best/) | [/resources/articles/pride-2025-beige-pride-pinkhushing-brand-activism-at-its-best](https://grounded-world-web-staging.vercel.app/resources/articles/pride-2025-beige-pride-pinkhushing-brand-activism-at-its-best) |
| [/activating-brand-purpose-and-sustainability/stopping-plastic-pollution-shouldnt-be-this-hard-david-katz/](https://grounded.world/activating-brand-purpose-and-sustainability/stopping-plastic-pollution-shouldnt-be-this-hard-david-katz/) | [/resources/articles/stopping-plastic-pollution-shouldnt-be-this-hard-david-katz](https://grounded-world-web-staging.vercel.app/resources/articles/stopping-plastic-pollution-shouldnt-be-this-hard-david-katz) |
| [/activating-brand-purpose-and-sustainability/sustainable-holiday-tips-reducing-waste-during-the-most-wonderful-excessive-time-of-the-year/](https://grounded.world/activating-brand-purpose-and-sustainability/sustainable-holiday-tips-reducing-waste-during-the-most-wonderful-excessive-time-of-the-year/) | [/resources/articles/sustainable-holiday-tips-reducing-waste-during-the-most-wonderful-excessive-time-of-the-year](https://grounded-world-web-staging.vercel.app/resources/articles/sustainable-holiday-tips-reducing-waste-during-the-most-wonderful-excessive-time-of-the-year) |
| [/activating-brand-purpose-and-sustainability/top-5-brands-helping-keep-our-oceans-clean-plastic-free/](https://grounded.world/activating-brand-purpose-and-sustainability/top-5-brands-helping-keep-our-oceans-clean-plastic-free/) | [/resources/articles/top-5-brands-helping-keep-our-oceans-clean-plastic-free](https://grounded-world-web-staging.vercel.app/resources/articles/top-5-brands-helping-keep-our-oceans-clean-plastic-free) |
| [/activating-brand-purpose-and-sustainability/understanding-activating-brand-purpose-in-retail/](https://grounded.world/activating-brand-purpose-and-sustainability/understanding-activating-brand-purpose-in-retail/) | [/resources/articles/understanding-activating-brand-purpose-in-retail](https://grounded-world-web-staging.vercel.app/resources/articles/understanding-activating-brand-purpose-in-retail) |
| [/activating-brand-purpose-and-sustainability/universal-flourishing-shouldnt-be-this-hard-karimah-huddah/](https://grounded.world/activating-brand-purpose-and-sustainability/universal-flourishing-shouldnt-be-this-hard-karimah-huddah/) | [/resources/articles/universal-flourishing-shouldnt-be-this-hard-karimah-huddah](https://grounded-world-web-staging.vercel.app/resources/articles/universal-flourishing-shouldnt-be-this-hard-karimah-huddah) |
| [/activating-brand-purpose-and-sustainability/what-is-circular-fashion-the-future-of-fashion/](https://grounded.world/activating-brand-purpose-and-sustainability/what-is-circular-fashion-the-future-of-fashion/) | [/resources/articles/what-is-circular-fashion-the-future-of-fashion](https://grounded-world-web-staging.vercel.app/resources/articles/what-is-circular-fashion-the-future-of-fashion) |
| [/activating-brand-purpose-and-sustainability/what-the-eus-sustainability-reporting-directves-mean-for-your-business-csrd-cs3d/](https://grounded.world/activating-brand-purpose-and-sustainability/what-the-eus-sustainability-reporting-directves-mean-for-your-business-csrd-cs3d/) | [/resources/articles/what-the-eus-sustainability-reporting-directves-mean-for-your-business-csrd-cs3d](https://grounded-world-web-staging.vercel.app/resources/articles/what-the-eus-sustainability-reporting-directves-mean-for-your-business-csrd-cs3d) |
| [/brand-activation/partnerships-community/cause-marketing-campaigns/](https://grounded.world/brand-activation/partnerships-community/cause-marketing-campaigns/) | [/resources/articles/cause-marketing-campaigns](https://grounded-world-web-staging.vercel.app/resources/articles/cause-marketing-campaigns) |
| [/brand-activation/partnerships-community/cause-related-marketing/](https://grounded.world/brand-activation/partnerships-community/cause-related-marketing/) | [/resources/articles/cause-related-marketing](https://grounded-world-web-staging.vercel.app/resources/articles/cause-related-marketing) |
| [/brand-activation/partnerships-community/community-engagement-strategy/](https://grounded.world/brand-activation/partnerships-community/community-engagement-strategy/) | [/resources/articles/community-engagement-strategy](https://grounded-world-web-staging.vercel.app/resources/articles/community-engagement-strategy) |
| [/brand-activation/partnerships-community/stakeholder-engagement-strategy/](https://grounded.world/brand-activation/partnerships-community/stakeholder-engagement-strategy/) | [/resources/articles/stakeholder-engagement-strategy](https://grounded-world-web-staging.vercel.app/resources/articles/stakeholder-engagement-strategy) |
| [/brand-activation/retail-shopper/brand-activation-at-retail/](https://grounded.world/brand-activation/retail-shopper/brand-activation-at-retail/) | [/resources/articles/brand-activation-at-retail](https://grounded-world-web-staging.vercel.app/resources/articles/brand-activation-at-retail) |
| [/brand-activation/retail-shopper/retail-activation/](https://grounded.world/brand-activation/retail-shopper/retail-activation/) | [/resources/articles/retail-activation](https://grounded-world-web-staging.vercel.app/resources/articles/retail-activation) |
| [/brand-activation/retail-shopper/retail-marketing-campaigns/](https://grounded.world/brand-activation/retail-shopper/retail-marketing-campaigns/) | [/resources/articles/retail-marketing-campaigns](https://grounded-world-web-staging.vercel.app/resources/articles/retail-marketing-campaigns) |
| [/brand-activation/retail-shopper/shopper-behaviour-insights/](https://grounded.world/brand-activation/retail-shopper/shopper-behaviour-insights/) | [/resources/articles/shopper-behaviour-insights](https://grounded-world-web-staging.vercel.app/resources/articles/shopper-behaviour-insights) |
| [/brand-activation/retail-shopper/shopper-marketing/](https://grounded.world/brand-activation/retail-shopper/shopper-marketing/) | [/resources/articles/shopper-marketing](https://grounded-world-web-staging.vercel.app/resources/articles/shopper-marketing) |
| [/brand-activation/retail-shopper/sustainability-market-research/](https://grounded.world/brand-activation/retail-shopper/sustainability-market-research/) | [/resources/articles/sustainability-market-research](https://grounded-world-web-staging.vercel.app/resources/articles/sustainability-market-research) |
| [/brand-activation/strategy/brand-activation-strategy/](https://grounded.world/brand-activation/strategy/brand-activation-strategy/) | [/resources/articles/brand-activation-strategy](https://grounded-world-web-staging.vercel.app/resources/articles/brand-activation-strategy) |
| [/brand-activation/strategy/brand-experience-strategy/](https://grounded.world/brand-activation/strategy/brand-experience-strategy/) | [/resources/articles/brand-experience-strategy](https://grounded-world-web-staging.vercel.app/resources/articles/brand-experience-strategy) |
| [/brand-activation/strategy/customer-engagement-strategy/](https://grounded.world/brand-activation/strategy/customer-engagement-strategy/) | [/resources/articles/customer-engagement-strategy](https://grounded-world-web-staging.vercel.app/resources/articles/customer-engagement-strategy) |
| [/brand-activation/strategy/human-centered-marketing/](https://grounded.world/brand-activation/strategy/human-centered-marketing/) | [/resources/articles/human-centered-marketing](https://grounded-world-web-staging.vercel.app/resources/articles/human-centered-marketing) |
| [/brand-activation/strategy/integrated-marketing-strategy/](https://grounded.world/brand-activation/strategy/integrated-marketing-strategy/) | [/resources/articles/integrated-marketing-strategy](https://grounded-world-web-staging.vercel.app/resources/articles/integrated-marketing-strategy) |
| [/brand-activation/strategy/purpose-driven-marketing/](https://grounded.world/brand-activation/strategy/purpose-driven-marketing/) | [/resources/articles/purpose-driven-marketing](https://grounded-world-web-staging.vercel.app/resources/articles/purpose-driven-marketing) |
| [/brand-purpose-agency/foundations/brand-mission/](https://grounded.world/brand-purpose-agency/foundations/brand-mission/) | [/resources/articles/brand-mission](https://grounded-world-web-staging.vercel.app/resources/articles/brand-mission) |
| [/brand-purpose-agency/foundations/brand-purpose-examples/](https://grounded.world/brand-purpose-agency/foundations/brand-purpose-examples/) | [/resources/articles/brand-purpose-examples](https://grounded-world-web-staging.vercel.app/resources/articles/brand-purpose-examples) |
| [/brand-purpose-agency/foundations/brand-values/](https://grounded.world/brand-purpose-agency/foundations/brand-values/) | [/resources/articles/brand-values](https://grounded-world-web-staging.vercel.app/resources/articles/brand-values) |
| [/brand-purpose-agency/foundations/brand-vision/](https://grounded.world/brand-purpose-agency/foundations/brand-vision/) | [/resources/articles/brand-vision](https://grounded-world-web-staging.vercel.app/resources/articles/brand-vision) |
| [/brand-purpose-agency/foundations/purpose-driven-brands-why-consumer-demand-for-values-is-reshaping-business-strategy/](https://grounded.world/brand-purpose-agency/foundations/purpose-driven-brands-why-consumer-demand-for-values-is-reshaping-business-strategy/) | [/resources/articles/purpose-driven-brands-why-consumer-demand-for-values-is-reshaping-business-strategy](https://grounded-world-web-staging.vercel.app/resources/articles/purpose-driven-brands-why-consumer-demand-for-values-is-reshaping-business-strategy) |
| [/brand-purpose-agency/foundations/understanding-brand-purpose/](https://grounded.world/brand-purpose-agency/foundations/understanding-brand-purpose/) | [/resources/articles/understanding-brand-purpose](https://grounded-world-web-staging.vercel.app/resources/articles/understanding-brand-purpose) |
| [/brand-purpose-agency/foundations/z-impact-measurement-test/](https://grounded.world/brand-purpose-agency/foundations/z-impact-measurement-test/) | [/resources/articles/z-impact-measurement-test](https://grounded-world-web-staging.vercel.app/resources/articles/z-impact-measurement-test) |
| [/brand-purpose-agency/people-and-planet/cultural-relevance/](https://grounded.world/brand-purpose-agency/people-and-planet/cultural-relevance/) | [/resources/articles/cultural-relevance](https://grounded-world-web-staging.vercel.app/resources/articles/cultural-relevance) |
| [/brand-purpose-agency/people-and-planet/employee-satisfaction/](https://grounded.world/brand-purpose-agency/people-and-planet/employee-satisfaction/) | [/resources/articles/employee-satisfaction](https://grounded-world-web-staging.vercel.app/resources/articles/employee-satisfaction) |
| [/brand-purpose-agency/people-and-planet/ethical-practices/](https://grounded.world/brand-purpose-agency/people-and-planet/ethical-practices/) | [/resources/articles/ethical-practices](https://grounded-world-web-staging.vercel.app/resources/articles/ethical-practices) |
| [/brand-purpose-agency/people-and-planet/ethical-sourcing/](https://grounded.world/brand-purpose-agency/people-and-planet/ethical-sourcing/) | [/resources/articles/ethical-sourcing](https://grounded-world-web-staging.vercel.app/resources/articles/ethical-sourcing) |
| [/brand-purpose-agency/people-and-planet/sustainability-initiatives/](https://grounded.world/brand-purpose-agency/people-and-planet/sustainability-initiatives/) | [/resources/articles/sustainability-initiatives](https://grounded-world-web-staging.vercel.app/resources/articles/sustainability-initiatives) |
| [/brand-purpose-agency/purpose-in-action/brand-activation-strategy-transform-purpose-into-profit-through-meaningful-engagement/](https://grounded.world/brand-purpose-agency/purpose-in-action/brand-activation-strategy-transform-purpose-into-profit-through-meaningful-engagement/) | [/resources/articles/brand-activation-strategy-transform-purpose-into-profit-through-meaningful-engagement](https://grounded-world-web-staging.vercel.app/resources/articles/brand-activation-strategy-transform-purpose-into-profit-through-meaningful-engagement) |
| [/brand-purpose-agency/purpose-in-action/cause-marketing/](https://grounded.world/brand-purpose-agency/purpose-in-action/cause-marketing/) | [/resources/articles/cause-marketing](https://grounded-world-web-staging.vercel.app/resources/articles/cause-marketing) |
| [/brand-purpose-agency/purpose-in-action/csr-strategy-build-corporate-social-responsibility-that-drives-purpose-and-profit/](https://grounded.world/brand-purpose-agency/purpose-in-action/csr-strategy-build-corporate-social-responsibility-that-drives-purpose-and-profit/) | [/resources/articles/csr-strategy-build-corporate-social-responsibility-that-drives-purpose-and-profit](https://grounded-world-web-staging.vercel.app/resources/articles/csr-strategy-build-corporate-social-responsibility-that-drives-purpose-and-profit) |
| [/brand-purpose-agency/purpose-in-action/impact-measurement/](https://grounded.world/brand-purpose-agency/purpose-in-action/impact-measurement/) | [/resources/articles/impact-measurement](https://grounded-world-web-staging.vercel.app/resources/articles/impact-measurement) |
| [/brand-purpose-agency/purpose-in-action/social-impact-campaigns/](https://grounded.world/brand-purpose-agency/purpose-in-action/social-impact-campaigns/) | [/resources/articles/social-impact-campaigns](https://grounded-world-web-staging.vercel.app/resources/articles/social-impact-campaigns) |
| [/brand-purpose-agency/purpose-in-business/brand-identity/](https://grounded.world/brand-purpose-agency/purpose-in-business/brand-identity/) | [/resources/articles/brand-identity](https://grounded-world-web-staging.vercel.app/resources/articles/brand-identity) |
| [/brand-purpose-agency/purpose-in-business/brand-purpose-agency-purpose-in-business-brand-identity/](https://grounded.world/brand-purpose-agency/purpose-in-business/brand-purpose-agency-purpose-in-business-brand-identity/) | [/resources/articles/brand-purpose-agency-purpose-in-business-brand-identity](https://grounded-world-web-staging.vercel.app/resources/articles/brand-purpose-agency-purpose-in-business-brand-identity) |
| [/brand-purpose-agency/purpose-in-business/brand-purpose-agency-purpose-in-business-marketing-campaigns/](https://grounded.world/brand-purpose-agency/purpose-in-business/brand-purpose-agency-purpose-in-business-marketing-campaigns/) | [/resources/articles/brand-purpose-agency-purpose-in-business-marketing-campaigns](https://grounded-world-web-staging.vercel.app/resources/articles/brand-purpose-agency-purpose-in-business-marketing-campaigns) |
| [/brand-purpose-agency/purpose-in-business/company-culture/](https://grounded.world/brand-purpose-agency/purpose-in-business/company-culture/) | [/resources/articles/company-culture](https://grounded-world-web-staging.vercel.app/resources/articles/company-culture) |
| [/brand-purpose-agency/purpose-in-business/corporate-responsibility/](https://grounded.world/brand-purpose-agency/purpose-in-business/corporate-responsibility/) | [/resources/articles/corporate-responsibility](https://grounded-world-web-staging.vercel.app/resources/articles/corporate-responsibility) |
| [/brand-purpose-agency/purpose-in-business/marketing-campaigns/](https://grounded.world/brand-purpose-agency/purpose-in-business/marketing-campaigns/) | [/resources/articles/marketing-campaigns](https://grounded-world-web-staging.vercel.app/resources/articles/marketing-campaigns) |
| [/brand-purpose-agency/purpose-in-business/mission-values/](https://grounded.world/brand-purpose-agency/purpose-in-business/mission-values/) | [/resources/articles/mission-values](https://grounded-world-web-staging.vercel.app/resources/articles/mission-values) |
| [/brand-purpose-agency/purpose-in-business/purpose-driven-companies/](https://grounded.world/brand-purpose-agency/purpose-in-business/purpose-driven-companies/) | [/resources/articles/purpose-driven-companies](https://grounded-world-web-staging.vercel.app/resources/articles/purpose-driven-companies) |
| [/brand-purpose-agency/sustainability-communication/sustainability-communication/](https://grounded.world/brand-purpose-agency/sustainability-communication/sustainability-communication/) | [/resources/articles/sustainability-communication](https://grounded-world-web-staging.vercel.app/resources/articles/sustainability-communication) |
| [/activism/worst-examples-of-queerbaiting-best-examples-of-pride-month-marketing/](https://grounded.world/activism/worst-examples-of-queerbaiting-best-examples-of-pride-month-marketing/) | [/resources/articles/worst-examples-of-queerbaiting-best-examples-of-pride-month-marketing](https://grounded-world-web-staging.vercel.app/resources/articles/worst-examples-of-queerbaiting-best-examples-of-pride-month-marketing) |
| [/brand-activism-and-storytelling/the-unlikely-connection-between-poetry-and-advertising/](https://grounded.world/brand-activism-and-storytelling/the-unlikely-connection-between-poetry-and-advertising/) | [/resources/articles/the-unlikely-connection-between-poetry-and-advertising](https://grounded-world-web-staging.vercel.app/resources/articles/the-unlikely-connection-between-poetry-and-advertising) |
| [/featured/articulating_brand_purpose_statements/](https://grounded.world/featured/articulating_brand_purpose_statements/) | [/resources/articles/articulating_brand_purpose_statements](https://grounded-world-web-staging.vercel.app/resources/articles/articulating_brand_purpose_statements) |
| [/featured/b-corp-month-2023/](https://grounded.world/featured/b-corp-month-2023/) | [/resources/articles/b-corp-month-2023](https://grounded-world-web-staging.vercel.app/resources/articles/b-corp-month-2023) |
| [/featured/earth-day-campaigns/](https://grounded.world/featured/earth-day-campaigns/) | [/resources/articles/earth-day-campaigns](https://grounded-world-web-staging.vercel.app/resources/articles/earth-day-campaigns) |
| [/featured/green-friday-the-sustainable-black-friday/](https://grounded.world/featured/green-friday-the-sustainable-black-friday/) | [/resources/articles/green-friday-the-sustainable-black-friday](https://grounded-world-web-staging.vercel.app/resources/articles/green-friday-the-sustainable-black-friday) |
| [/featured/purpose-driven-leadership-with-matthew-mccarthy/](https://grounded.world/featured/purpose-driven-leadership-with-matthew-mccarthy/) | [/resources/articles/purpose-driven-leadership-with-matthew-mccarthy](https://grounded-world-web-staging.vercel.app/resources/articles/purpose-driven-leadership-with-matthew-mccarthy) |
| [/featured/sustainable-fashion-4-ways-fashion-brands-can-be-more-sustainable/](https://grounded.world/featured/sustainable-fashion-4-ways-fashion-brands-can-be-more-sustainable/) | [/resources/articles/sustainable-fashion-4-ways-fashion-brands-can-be-more-sustainable](https://grounded-world-web-staging.vercel.app/resources/articles/sustainable-fashion-4-ways-fashion-brands-can-be-more-sustainable) |
| [/featured/value-brand-authenticity/](https://grounded.world/featured/value-brand-authenticity/) | [/resources/articles/value-brand-authenticity](https://grounded-world-web-staging.vercel.app/resources/articles/value-brand-authenticity) |
| [/featured/what-social-justice-means/](https://grounded.world/featured/what-social-justice-means/) | [/resources/articles/what-social-justice-means](https://grounded-world-web-staging.vercel.app/resources/articles/what-social-justice-means) |
| [/social-impact/ep-1-journalism-shouldnt-be-this-hard/](https://grounded.world/social-impact/ep-1-journalism-shouldnt-be-this-hard/) | [/resources/articles/ep-1-journalism-shouldnt-be-this-hard](https://grounded-world-web-staging.vercel.app/resources/articles/ep-1-journalism-shouldnt-be-this-hard) |
| [/social-impact/exploring-mental-health-and-culture/](https://grounded.world/social-impact/exploring-mental-health-and-culture/) | [/resources/articles/exploring-mental-health-and-culture](https://grounded-world-web-staging.vercel.app/resources/articles/exploring-mental-health-and-culture) |
| [/sustainability-marketing/back-to-school-supplies-where-retail-meets-responsibility/](https://grounded.world/sustainability-marketing/back-to-school-supplies-where-retail-meets-responsibility/) | [/resources/articles/back-to-school-supplies-where-retail-meets-responsibility](https://grounded-world-web-staging.vercel.app/resources/articles/back-to-school-supplies-where-retail-meets-responsibility) |
| [/sustainability-marketing/convenience-without-conscience-the-sustainability-gap-in-grocery-delivery/](https://grounded.world/sustainability-marketing/convenience-without-conscience-the-sustainability-gap-in-grocery-delivery/) | [/resources/articles/convenience-without-conscience-the-sustainability-gap-in-grocery-delivery](https://grounded-world-web-staging.vercel.app/resources/articles/convenience-without-conscience-the-sustainability-gap-in-grocery-delivery) |
| [/sustainability-marketing/fighting-food-waste-shouldnt-be-this-hard/](https://grounded.world/sustainability-marketing/fighting-food-waste-shouldnt-be-this-hard/) | [/resources/articles/fighting-food-waste-shouldnt-be-this-hard](https://grounded-world-web-staging.vercel.app/resources/articles/fighting-food-waste-shouldnt-be-this-hard) |
| [/sustainability-marketing/get-grounded-in-the-plastic-reality-project-with-paloma-jacome/](https://grounded.world/sustainability-marketing/get-grounded-in-the-plastic-reality-project-with-paloma-jacome/) | [/resources/articles/get-grounded-in-the-plastic-reality-project-with-paloma-jacome](https://grounded-world-web-staging.vercel.app/resources/articles/get-grounded-in-the-plastic-reality-project-with-paloma-jacome) |
| [/sustainability-marketing/learn-about-composting-a-radical-act-of-mental-health-through-circularity/](https://grounded.world/sustainability-marketing/learn-about-composting-a-radical-act-of-mental-health-through-circularity/) | [/resources/articles/learn-about-composting-a-radical-act-of-mental-health-through-circularity](https://grounded-world-web-staging.vercel.app/resources/articles/learn-about-composting-a-radical-act-of-mental-health-through-circularity) |
| [/sustainability-marketing/stopping-plastic-pollution-shouldnt-be-this-hard-david-katz/](https://grounded.world/sustainability-marketing/stopping-plastic-pollution-shouldnt-be-this-hard-david-katz/) | [/resources/articles/stopping-plastic-pollution-shouldnt-be-this-hard-david-katz](https://grounded-world-web-staging.vercel.app/resources/articles/stopping-plastic-pollution-shouldnt-be-this-hard-david-katz) |
| [/sustainability-marketing/sustainability-buzzwords/](https://grounded.world/sustainability-marketing/sustainability-buzzwords/) | [/resources/articles/sustainability-buzzwords](https://grounded-world-web-staging.vercel.app/resources/articles/sustainability-buzzwords) |
| [/sustainability/top-5-brands-helping-keep-our-oceans-clean-plastic-free/](https://grounded.world/sustainability/top-5-brands-helping-keep-our-oceans-clean-plastic-free/) | [/resources/articles/top-5-brands-helping-keep-our-oceans-clean-plastic-free](https://grounded-world-web-staging.vercel.app/resources/articles/top-5-brands-helping-keep-our-oceans-clean-plastic-free) |
| [/template/brand-storytelling-how-purpose-driven-narratives-build-commercial-value/](https://grounded.world/template/brand-storytelling-how-purpose-driven-narratives-build-commercial-value/) | [/resources/articles/brand-storytelling-how-purpose-driven-narratives-build-commercial-value](https://grounded-world-web-staging.vercel.app/resources/articles/brand-storytelling-how-purpose-driven-narratives-build-commercial-value) |

## 5. Category Landing Pages (need 301 redirects)

These WordPress category index pages may receive organic traffic:

| Path | Redirect To |
|---|---|
| [/activating-brand-purpose-and-sustainability/](https://grounded.world/activating-brand-purpose-and-sustainability/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/brand-activation/](https://grounded.world/brand-activation/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/brand-purpose-agency/](https://grounded.world/brand-purpose-agency/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/activism/](https://grounded.world/activism/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/brand-activism-and-storytelling/](https://grounded.world/brand-activism-and-storytelling/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/featured/](https://grounded.world/featured/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/social-impact/](https://grounded.world/social-impact/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/sustainability-marketing/](https://grounded.world/sustainability-marketing/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |
| [/sustainability/](https://grounded.world/sustainability/) | [/resources/articles](https://grounded-world-web-staging.vercel.app/resources/articles) |

## 6. Pages to Delete (let 404 or generic redirect)

Per client decision:

| Path | Title | Client Decision |
|---|---|---|
| [/brand-activism-agency/](https://grounded.world/brand-activism-agency/) | Brand Activism (old version) | Delete |
| [/non-profit-marketing-services/](https://grounded.world/non-profit-marketing-services/) | Non-profit Marketing | Delete |
| [/nonprofit-branding-agency/](https://grounded.world/nonprofit-branding-agency/) | Nonprofits Branding | Delete |
| [/start-up-branding-agency/](https://grounded.world/start-up-branding-agency/) | Branding for Startups | Delete |
| [/sustainable-fashion/](https://grounded.world/sustainable-fashion/) | Sustainable Fashion | Delete |
| [/terms/](https://grounded.world/terms/) | Terms & Conditions | Delete |
| [/thank-you/](https://grounded.world/thank-you/) | Thank You | Delete |
| [/grounded-sizzle-video/](https://grounded.world/grounded-sizzle-video/) | Sizzle Reel | Delete |

**Recommendation:** Even "delete" pages should get a 301 to `/` or `/services` rather than hard 404, to preserve any link equity.

## 7. Pages to Create

| Path | Title | Client Notes |
|---|---|---|
| [/about-us/heidi-schoeneck](https://grounded-world-web-staging.vercel.app/about-us/heidi-schoeneck) | Heidi Schoeneck | New team member, needs to be created |
| /privacy-policy | Privacy Policy | Client wants footer link; legally required |
| "How To Guide" section under Resources | How To Guides | Critical for E-E-A-T per client |

---

## Next Steps

1. **Resolve discrepancies** (service slugs, about/contact paths) with the client
2. **Create missing pages** (Heidi Schoeneck, privacy policy, How To section)
3. **Implement all redirects** in `next.config.ts`
4. **Test every redirect** before DNS cutover
5. **Submit updated sitemap** to Google Search Console after launch
