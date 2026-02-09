# WordPress to TinaCMS Migration

This document describes the migration process used to import blog posts from WordPress into TinaCMS.

## Overview

- **Source**: WordPress XML export files
- **Destination**: TinaCMS markdown files in `content/posts/`
- **Images**: Downloaded to `public/images/blog/`

## Migration Results

| Metric | Value |
|--------|-------|
| Posts migrated | 86 |
| Images downloaded | 157 |
| Image storage | 125 MB |
| Markdown files updated | 28 |

## Scripts

Two scripts were created in `scripts/`:

### 1. migrate-wordpress.js

Converts WordPress XML exports to TinaCMS-compatible markdown files.

**Usage:**
```bash
node scripts/migrate-wordpress.js [options]
```

**Options:**
- `--input, -i` - Input XML file path (default: `wordpress/grounded.WordPress.2026-02-05-posts.xml`)
- `--output, -o` - Output directory (default: `content/posts`)
- `--dry-run` - Preview without writing files
- `--verbose, -v` - Show detailed output

**What it does:**
- Parses WordPress WXR (XML) export format
- Extracts only published posts (filters drafts, pages, attachments)
- Strips Divi/Elementor shortcodes (`[et_pb_section]`, etc.)
- Converts HTML to Markdown (links, bold, italics, images, headers)
- Creates TinaCMS frontmatter (title, date, description)
- Generates clean filenames based on WordPress slugs
- Decodes HTML entities in titles and content

### 2. download-media.js

Downloads images from external URLs and updates markdown files to use local paths.

**Usage:**
```bash
node scripts/download-media.js [options]
```

**Options:**
- `--dry-run` - Preview without downloading or modifying files
- `--verbose, -v` - Show detailed output
- `--skip-download` - Skip download, only rewrite URLs (if images already exist)

**What it does:**
- Scans markdown files for image URLs
- Downloads images to `public/images/blog/`
- Converts WordPress upload paths to flat filenames (e.g., `2023/01/image.png` → `2023-01-image.png`)
- Updates markdown files to use local `/images/blog/` paths
- Handles both inline images and linked full-size versions

## File Structure

```
content/posts/
├── article-slug.md          # Migrated blog posts
├── another-article.md
└── ...

public/images/blog/
├── 2023-01-image.png        # Downloaded images
├── 2024-02-photo.jpg
└── ...

wordpress/
├── grounded.WordPress.2026-02-05-posts.xml   # Source exports
├── grounded.WordPress.2026-02-05-pages.xml
├── grounded.WordPress.2026-02-05-media.xml
└── grounded.WordPress.2026-02-05-all.xml
```

## TinaCMS Schema

Posts use the following frontmatter fields (defined in `tina/config.ts`):

```yaml
---
title: Article Title
date: 2024-01-28T00:00:00.000Z
description: Brief description for SEO and social sharing
featuredImage: /images/blog/featured.jpg
author: phil-white
category: brand-purpose
tags:
  - sustainability
  - brand activism
featured: true
---

Markdown content here...
```

### Available Authors
- `phil-white` - Phil White
- `matt-deasy` - Matt Deasy
- `paloma-jacome` - Paloma Jacome
- `andrew-yates` - Andrew Yates

### Available Categories
- `brand-purpose` - Brand Purpose
- `sustainability` - Sustainability
- `brand-activism` - Brand Activism
- `social-impact` - Social Impact
- `retail-shopper` - Retail & Shopper
- `strategy` - Strategy
- `b-corps` - B-Corps
- `partnerships` - Partnerships & Community

## Re-running Migration

To re-run the migration (e.g., after WordPress export updates):

```bash
# 1. Migrate posts from XML
node scripts/migrate-wordpress.js

# 2. Download images and update URLs
node scripts/download-media.js
```

Use `--dry-run` first to preview changes before applying.

## Known Limitations

- Some images may fail to download (404 errors from removed content)
- Internal links still point to `grounded.world` URLs (not converted to relative paths)
