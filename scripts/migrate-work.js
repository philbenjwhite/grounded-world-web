#!/usr/bin/env node

/**
 * WordPress Work Pages to TinaCMS Migration Script
 *
 * Extracts "our-work" child pages from the WordPress pages XML export
 * and converts them to TinaCMS-compatible markdown files for the Work collection.
 *
 * Usage:
 *   node scripts/migrate-work.js [options]
 *
 * Options:
 *   --input, -i    Input XML file path (default: wordpress/grounded.WordPress.2026-02-05-pages.xml)
 *   --output, -o   Output directory (default: content/work)
 *   --dry-run      Preview without writing files
 *   --verbose, -v  Show detailed output
 */

const fs = require("fs");
const path = require("path");

// The WordPress post ID of the parent "Our Work" page
const OUR_WORK_PARENT_ID = "249";

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  input: "wordpress/grounded.WordPress.2026-02-05-pages.xml",
  output: "content/work",
  dryRun: args.includes("--dry-run"),
  verbose: args.includes("--verbose") || args.includes("-v"),
};

for (let i = 0; i < args.length; i++) {
  if ((args[i] === "--input" || args[i] === "-i") && args[i + 1]) {
    options.input = args[++i];
  } else if ((args[i] === "--output" || args[i] === "-o") && args[i + 1]) {
    options.output = args[++i];
  }
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text) {
  if (!text) return "";
  return text
    .replace(/&#038;/g, "&")
    .replace(/&#8211;/g, "-")
    .replace(/&#8212;/g, "--")
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "...")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ");
}

/**
 * Format date as ISO 8601 for TinaCMS
 */
function formatDate(dateStr) {
  if (!dateStr) return new Date().toISOString();
  const date = new Date(dateStr.replace(" ", "T") + "Z");
  if (isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

/**
 * Escape special characters in YAML strings
 */
function escapeYaml(str) {
  if (!str) return "";
  if (
    /[:#{}\[\]&*?|>!%@`]/.test(str) ||
    str.includes("\n") ||
    str.startsWith(" ") ||
    str.endsWith(" ") ||
    str.startsWith("-")
  ) {
    return `"${str.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return str;
}

/**
 * Clean a WordPress "our-work" slug into a collection-friendly slug.
 * Strips the "our-work" prefix (with hyphens, underscores, or mixed separators)
 * and replaces underscores with hyphens throughout.
 */
function cleanWorkSlug(wordpressSlug) {
  let slug = wordpressSlug;
  // Strip "our-work" prefix with any combination of hyphens/underscores
  slug = slug.replace(/^our-work[-_]+/, "");
  // Replace remaining underscores with hyphens
  slug = slug.replace(/_/g, "-");
  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, "");
  // Collapse multiple hyphens
  slug = slug.replace(/-{2,}/g, "-");
  return slug;
}

/**
 * Extract the client name from a title.
 * Titles follow the pattern "Client: Subtitle", so the client is the part before the first colon.
 */
function extractClient(title) {
  const colonIndex = title.indexOf(":");
  if (colonIndex === -1) return title;
  return title.substring(0, colonIndex).trim();
}

/**
 * Extract the description paragraph from Divi page content.
 * The description is the first <p> tag after the <h1> in the hero section,
 * before the "More of Our" gallery section.
 */
function extractDescription(content) {
  if (!content) return "";

  // Limit to hero section (before "More of Our" heading)
  const moreOfOurIndex = content.indexOf("More of Our");
  const heroContent =
    moreOfOurIndex > -1 ? content.substring(0, moreOfOurIndex) : content;

  // Find the end of the h1
  const h1End = heroContent.indexOf("</h1>");
  if (h1End === -1) return "";

  const afterH1 = heroContent.substring(h1End);

  // Find the first paragraph after the h1
  const paragraphMatch = afterH1.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!paragraphMatch) return "";

  return (
    paragraphMatch[1]
      // Strip HTML tags
      .replace(/<[^>]+>/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Extract a Vimeo/YouTube URL from a Divi et_pb_video shortcode.
 */
function extractVideoUrl(content) {
  if (!content) return "";

  const videoMatch = content.match(
    /\[et_pb_video\s[^\]]*src="([^"]+)"[^\]]*\]/
  );
  if (!videoMatch) return "";

  let url = videoMatch[1];

  // Normalize Vimeo URLs — strip query params
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("vimeo.com")) {
      url = `https://vimeo.com${parsed.pathname}`;
    }
  } catch {
    // URL parsing failed, use as-is
  }

  return url;
}

/**
 * Extract the category hint from the "More of Our [Category] Work" heading.
 */
function extractCategoryHint(content) {
  if (!content) return "";

  // Look for "More of Our ... Work</h2>" — the category text may contain
  // inline <span> tags (from Google Sheets paste) and &nbsp; entities
  const h2Match = content.match(
    /More of Our\s+([\s\S]*?)\s*Work\s*<\/h2>/i
  );
  if (!h2Match) return "";

  return (
    h2Match[1]
      // Strip HTML tags (span wrappers from Google Sheets paste)
      .replace(/<[^>]+>/g, "")
      // Decode &nbsp; and \xa0
      .replace(/&nbsp;/g, " ")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Extract a specific postmeta value by key from an <item> block.
 */
function extractMeta(itemContent, metaKey) {
  const pattern = new RegExp(
    `<wp:meta_key><!\\[CDATA\\[${metaKey}\\]\\]><\\/wp:meta_key>\\s*` +
      `<wp:meta_value><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/wp:meta_value>`,
    "i"
  );
  const match = itemContent.match(pattern);
  return match ? match[1].trim() : "";
}

/**
 * Parse the WordPress pages XML and extract published our-work child pages.
 */
function parseWorkPages(xmlContent) {
  const pages = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlContent)) !== null) {
    const itemContent = match[1];

    // Filter: page type only
    const postTypeMatch = itemContent.match(
      /<wp:post_type><!\[CDATA\[(.*?)\]\]><\/wp:post_type>/
    );
    if (!postTypeMatch || postTypeMatch[1] !== "page") continue;

    // Filter: published only
    const statusMatch = itemContent.match(
      /<wp:status><!\[CDATA\[(.*?)\]\]><\/wp:status>/
    );
    if (!statusMatch || statusMatch[1] !== "publish") continue;

    // Filter: children of the Our Work parent page
    const parentMatch = itemContent.match(
      /<wp:post_parent>(\d+)<\/wp:post_parent>/
    );
    if (!parentMatch || parentMatch[1] !== OUR_WORK_PARENT_ID) continue;

    // Extract core fields
    const titleMatch =
      itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
      itemContent.match(/<title>([\s\S]*?)<\/title>/);
    const contentMatch = itemContent.match(
      /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/
    );
    const dateMatch = itemContent.match(
      /<wp:post_date><!\[CDATA\[(.*?)\]\]><\/wp:post_date>/
    );
    const slugMatch = itemContent.match(
      /<wp:post_name><!\[CDATA\[(.*?)\]\]><\/wp:post_name>/
    );
    const postIdMatch = itemContent.match(
      /<wp:post_id>(\d+)<\/wp:post_id>/
    );

    const rawTitle = titleMatch
      ? decodeHtmlEntities(titleMatch[1].trim())
      : "Untitled";
    const rawContent = contentMatch ? contentMatch[1] : "";
    const wordpressSlug = slugMatch ? slugMatch[1] : "";
    const date = dateMatch ? dateMatch[1] : "";
    const postId = postIdMatch ? postIdMatch[1] : "";

    // Extract structured data from the Divi content
    const description = decodeHtmlEntities(extractDescription(rawContent));
    const videoUrl = extractVideoUrl(rawContent);
    const categoryHint = decodeHtmlEntities(extractCategoryHint(rawContent));

    // Extract Yoast SEO metadata
    const seoTitle = decodeHtmlEntities(
      extractMeta(itemContent, "_yoast_wpseo_title")
    );
    const seoDescription = decodeHtmlEntities(
      extractMeta(itemContent, "_yoast_wpseo_metadesc")
    );
    const thumbnailId = extractMeta(itemContent, "_thumbnail_id");

    pages.push({
      title: rawTitle,
      client: extractClient(rawTitle),
      slug: cleanWorkSlug(wordpressSlug),
      wordpressSlug,
      postId,
      date: formatDate(date),
      description,
      videoUrl,
      categoryHint,
      seoTitle,
      seoDescription,
      thumbnailId,
    });
  }

  // Sort by title for consistent output
  pages.sort((a, b) => a.title.localeCompare(b.title));

  return pages;
}

/**
 * Generate a markdown file with YAML frontmatter for a work page.
 */
function generateWorkMarkdown(page) {
  let frontmatter = "---\n";
  frontmatter += `title: ${escapeYaml(page.title)}\n`;
  frontmatter += `client: ${escapeYaml(page.client)}\n`;

  if (page.description) {
    frontmatter += `description: ${escapeYaml(page.description)}\n`;
  }

  if (page.videoUrl) {
    frontmatter += `videoUrl: ${escapeYaml(page.videoUrl)}\n`;
  }

  frontmatter += `date: ${page.date}\n`;

  if (page.seoTitle) {
    frontmatter += `seoTitle: ${escapeYaml(page.seoTitle)}\n`;
  }

  if (page.seoDescription) {
    frontmatter += `seoDescription: ${escapeYaml(page.seoDescription)}\n`;
  }

  if (page.categoryHint) {
    frontmatter += `tags:\n`;
    frontmatter += `  - ${escapeYaml(page.categoryHint)}\n`;
  }

  frontmatter += "---\n";

  return frontmatter;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log("WordPress Work Pages to TinaCMS Migration\n");
  console.log(`Input:  ${options.input}`);
  console.log(`Output: ${options.output}`);
  console.log(`Mode:   ${options.dryRun ? "DRY RUN" : "LIVE"}\n`);

  // Read XML file
  const inputPath = path.resolve(process.cwd(), options.input);
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }

  console.log("Reading WordPress export...");
  const xmlContent = fs.readFileSync(inputPath, "utf-8");

  // Parse work pages
  console.log("Parsing work pages...");
  const pages = parseWorkPages(xmlContent);

  console.log(`Found ${pages.length} published work pages\n`);

  if (pages.length === 0) {
    console.log("No work pages to migrate.");
    return;
  }

  // Ensure output directory exists
  const outputPath = path.resolve(process.cwd(), options.output);
  if (!options.dryRun && !fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Track used slugs to avoid duplicates
  const usedSlugs = new Set();
  let successCount = 0;
  let skipCount = 0;

  for (const page of pages) {
    // Handle duplicate slugs
    let slug = page.slug;
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${page.slug}-${counter++}`;
    }
    usedSlugs.add(slug);

    const filename = `${slug}.md`;
    const filepath = path.join(outputPath, filename);
    const markdownContent = generateWorkMarkdown(page);

    if (options.verbose || options.dryRun) {
      console.log(`\n${filename}`);
      console.log(`   Title:         ${page.title}`);
      console.log(`   Client:        ${page.client}`);
      console.log(`   WP slug:       ${page.wordpressSlug}`);
      console.log(`   Clean slug:    ${slug}`);
      console.log(`   Description:   ${page.description || "(none)"}`);
      console.log(`   Video:         ${page.videoUrl || "(none)"}`);
      console.log(`   Category hint: ${page.categoryHint || "(none)"}`);
      console.log(`   SEO title:     ${page.seoTitle || "(none)"}`);
      console.log(`   Thumbnail ID:  ${page.thumbnailId || "(none)"}`);
    }

    if (!options.dryRun) {
      try {
        fs.writeFileSync(filepath, markdownContent, "utf-8");
        successCount++;
        if (!options.verbose) {
          process.stdout.write(".");
        }
      } catch (err) {
        console.error(`\nError writing ${filename}: ${err.message}`);
        skipCount++;
      }
    } else {
      successCount++;
    }
  }

  console.log("\n");
  console.log("=".repeat(50));
  console.log(`Migrated: ${successCount} work pages`);
  if (skipCount > 0) {
    console.log(`Skipped:  ${skipCount} work pages`);
  }
  if (options.dryRun) {
    console.log("\nRun without --dry-run to actually write files");
  } else {
    console.log(`\nFiles written to: ${options.output}`);
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
