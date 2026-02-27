#!/usr/bin/env node
/**
 * Import featured images from WordPress XML exports.
 *
 * 1. Parse media XML → build map of attachment ID → image URL
 * 2. Parse posts XML → get each post's slug + _thumbnail_id
 * 3. For posts missing featuredImage in their .md frontmatter:
 *    a. Download the image from WordPress
 *    b. Save to public/images/blog/
 *    c. Add featuredImage to the post's frontmatter
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { readdirSync } from "fs";
import { join, basename, extname } from "path";
import { execSync } from "child_process";

const ROOT = join(import.meta.dirname, "..");
const POSTS_XML = join(ROOT, "wordpress", "grounded.WordPress.2026-02-05-posts.xml");
const MEDIA_XML = join(ROOT, "wordpress", "grounded.WordPress.2026-02-05-media.xml");
const CONTENT_DIR = join(ROOT, "content", "posts");
const IMAGE_DIR = join(ROOT, "public", "images", "blog");

// Ensure image directory exists
if (!existsSync(IMAGE_DIR)) {
  mkdirSync(IMAGE_DIR, { recursive: true });
}

// ─── Parse Media XML ────────────────────────────────────
// Build map: attachment post_id → attachment_url
function parseMediaXml() {
  const xml = readFileSync(MEDIA_XML, "utf-8");
  const map = new Map();

  // Split into items
  const items = xml.split("<item>").slice(1);
  for (const item of items) {
    const idMatch = item.match(/<wp:post_id>(\d+)<\/wp:post_id>/);
    const urlMatch = item.match(/<wp:attachment_url><!\[CDATA\[(.+?)\]\]><\/wp:attachment_url>/);
    if (idMatch && urlMatch) {
      map.set(idMatch[1], urlMatch[1]);
    }
  }

  console.log(`Parsed ${map.size} media attachments from XML`);
  return map;
}

// ─── Parse Posts XML ────────────────────────────────────
// Build map: post slug → { title, thumbnailId }
function parsePostsXml() {
  const xml = readFileSync(POSTS_XML, "utf-8");
  const posts = [];

  const items = xml.split("<item>").slice(1);
  for (const item of items) {
    // Only process published posts (not pages, attachments, etc.)
    const typeMatch = item.match(/<wp:post_type><!\[CDATA\[(.+?)\]\]><\/wp:post_type>/);
    if (!typeMatch || typeMatch[1] !== "post") continue;

    const statusMatch = item.match(/<wp:status><!\[CDATA\[(.+?)\]\]><\/wp:status>/);
    if (!statusMatch || statusMatch[1] !== "publish") continue;

    // Get the slug (post_name)
    const slugMatch = item.match(/<wp:post_name><!\[CDATA\[(.+?)\]\]><\/wp:post_name>/);
    if (!slugMatch) continue;

    // Get thumbnail ID from postmeta
    const thumbMatch = item.match(
      /<wp:meta_key><!\[CDATA\[_thumbnail_id\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(\d+)\]\]><\/wp:meta_value>/
    );

    const titleMatch = item.match(/<title><!\[CDATA\[(.+?)\]\]><\/title>/);

    posts.push({
      slug: slugMatch[1],
      title: titleMatch ? titleMatch[1] : slugMatch[1],
      thumbnailId: thumbMatch ? thumbMatch[1] : null,
    });
  }

  console.log(`Parsed ${posts.length} published posts from XML`);
  console.log(`  ${posts.filter((p) => p.thumbnailId).length} have thumbnail IDs`);
  return posts;
}

// ─── Match post slugs to .md files ──────────────────────
// WordPress slugs may differ from .md filenames, so try several matching strategies
function findMdFile(slug) {
  // Direct match
  const direct = join(CONTENT_DIR, `${slug}.md`);
  if (existsSync(direct)) return direct;

  // Try with underscores instead of hyphens
  const underscore = join(CONTENT_DIR, `${slug.replace(/-/g, "_")}.md`);
  if (existsSync(underscore)) return underscore;

  // Try with hyphens instead of underscores
  const hyphen = join(CONTENT_DIR, `${slug.replace(/_/g, "-")}.md`);
  if (existsSync(hyphen)) return hyphen;

  return null;
}

// ─── Check if post already has featuredImage ────────────
function hasFeaturedImage(filePath) {
  const content = readFileSync(filePath, "utf-8");
  return /^featuredImage:/m.test(content);
}

// ─── Download image ─────────────────────────────────────
function downloadImage(url, filename) {
  const dest = join(IMAGE_DIR, filename);
  if (existsSync(dest)) {
    console.log(`  Image already exists: ${filename}`);
    return true;
  }

  try {
    execSync(`curl -sL -o "${dest}" "${url}"`, { timeout: 30000 });
    // Verify the file was actually downloaded (not a 404 HTML page)
    const size = readFileSync(dest).length;
    if (size < 1000) {
      // Probably an error page
      const content = readFileSync(dest, "utf-8");
      if (content.includes("<html") || content.includes("<!DOCTYPE")) {
        console.log(`  Download failed (got HTML): ${url}`);
        execSync(`rm "${dest}"`);
        return false;
      }
    }
    console.log(`  Downloaded: ${filename} (${Math.round(size / 1024)}KB)`);
    return true;
  } catch (error) {
    console.log(`  Download failed: ${url}`);
    return false;
  }
}

// ─── Add featuredImage to frontmatter ───────────────────
function addFeaturedImage(filePath, imagePath) {
  const content = readFileSync(filePath, "utf-8");

  // Find the closing --- of frontmatter
  const secondDash = content.indexOf("---", 3);
  if (secondDash === -1) return false;

  const before = content.slice(0, secondDash);
  const after = content.slice(secondDash);

  const updated = before + `featuredImage: '${imagePath}'\n` + after;
  writeFileSync(filePath, updated);
  return true;
}

// ─── Sanitize filename ──────────────────────────────────
function sanitizeFilename(url) {
  // Get the filename from the URL path
  const urlPath = new URL(url).pathname;
  let filename = basename(urlPath);

  // Remove any query params that might be in the filename
  filename = filename.split("?")[0];

  // Ensure it has a valid image extension
  const ext = extname(filename).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext)) {
    filename += ".jpg";
  }

  return filename;
}

// ─── Main ───────────────────────────────────────────────
async function main() {
  const mediaMap = parseMediaXml();
  const wpPosts = parsePostsXml();

  let updated = 0;
  let skipped = 0;
  let noMatch = 0;
  let noThumb = 0;
  let downloadFailed = 0;

  for (const post of wpPosts) {
    if (!post.thumbnailId) {
      noThumb++;
      continue;
    }

    const mdFile = findMdFile(post.slug);
    if (!mdFile) {
      noMatch++;
      console.log(`  No .md file found for slug: ${post.slug}`);
      continue;
    }

    if (hasFeaturedImage(mdFile)) {
      skipped++;
      continue;
    }

    const imageUrl = mediaMap.get(post.thumbnailId);
    if (!imageUrl) {
      console.log(`  No media URL for attachment ID ${post.thumbnailId} (post: ${post.slug})`);
      continue;
    }

    const filename = sanitizeFilename(imageUrl);
    console.log(`\nProcessing: ${post.slug}`);
    console.log(`  Image URL: ${imageUrl}`);

    const downloaded = downloadImage(imageUrl, filename);
    if (!downloaded) {
      downloadFailed++;
      continue;
    }

    const localPath = `/images/blog/${filename}`;
    const added = addFeaturedImage(mdFile, localPath);
    if (added) {
      updated++;
      console.log(`  Updated frontmatter: ${basename(mdFile)}`);
    }
  }

  console.log("\n─── Summary ───────────────────────────");
  console.log(`Posts updated with featuredImage: ${updated}`);
  console.log(`Posts already had featuredImage: ${skipped}`);
  console.log(`Posts without thumbnail in WP: ${noThumb}`);
  console.log(`Posts with no matching .md file: ${noMatch}`);
  console.log(`Download failures: ${downloadFailed}`);
}

main().catch(console.error);
