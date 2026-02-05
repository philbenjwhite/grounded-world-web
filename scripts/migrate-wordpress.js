#!/usr/bin/env node

/**
 * WordPress to TinaCMS Migration Script
 *
 * Converts WordPress XML export files to TinaCMS-compatible markdown files.
 *
 * Usage:
 *   node scripts/migrate-wordpress.js [options]
 *
 * Options:
 *   --input, -i    Input XML file path (default: wordpress/grounded.WordPress.2026-02-05-posts.xml)
 *   --output, -o   Output directory (default: content/posts)
 *   --dry-run      Preview without writing files
 *   --verbose, -v  Show detailed output
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  input: 'wordpress/grounded.WordPress.2026-02-05-posts.xml',
  output: 'content/posts',
  dryRun: args.includes('--dry-run'),
  verbose: args.includes('--verbose') || args.includes('-v'),
};

// Parse named arguments
for (let i = 0; i < args.length; i++) {
  if ((args[i] === '--input' || args[i] === '-i') && args[i + 1]) {
    options.input = args[++i];
  } else if ((args[i] === '--output' || args[i] === '-o') && args[i + 1]) {
    options.output = args[++i];
  }
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text) {
  if (!text) return '';
  return text
    .replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ');
}

/**
 * Extract text content from CDATA or regular XML content
 */
function extractCDATA(text) {
  if (!text) return '';
  // Remove CDATA wrapper if present
  const cdataMatch = text.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  if (cdataMatch) {
    return cdataMatch[1];
  }
  return text.trim();
}

/**
 * Strip Divi/Elementor shortcodes from content
 */
function stripShortcodes(content) {
  if (!content) return '';

  // Remove all WordPress/Divi shortcodes [shortcode_name ...] and [/shortcode_name]
  let cleaned = content.replace(/\[\/?\w+[^\]]*\]/g, '');

  // Remove Divi dynamic content tags @ET-DC@...base64...@
  cleaned = cleaned.replace(/@ET-DC@[A-Za-z0-9+/=]+@/g, '');

  return cleaned;
}

/**
 * Convert HTML to Markdown
 */
function htmlToMarkdown(html) {
  if (!html) return '';

  let md = html;

  // Remove empty figures (no img tag)
  md = md.replace(/<figure[^>]*>[\s]*<div><\/div>[\s]*<\/figure>/gi, '');

  // Handle figures with images and captions - more specific pattern to avoid greedy matching
  md = md.replace(/<figure[^>]*>\s*<div>\s*<img[^>]*src="([^"]*)"[^>]*>\s*<\/div>\s*<figcaption>([^<]*)<\/figcaption>\s*<\/figure>/gi,
    (match, src, caption) => `\n![${caption}](${src})\n*${caption}*\n`);

  // Figures with images but no captions
  md = md.replace(/<figure[^>]*>\s*<div>\s*<img[^>]*src="([^"]*)"[^>]*>\s*<\/div>\s*<\/figure>/gi, '\n![]($1)\n');

  // Simple figures with just img and figcaption
  md = md.replace(/<figure[^>]*>\s*<img[^>]*src="([^"]*)"[^>]*>\s*<figcaption>([^<]*)<\/figcaption>\s*<\/figure>/gi,
    (match, src, caption) => `\n![${caption}](${src})\n*${caption}*\n`);

  // Simple figures with just img
  md = md.replace(/<figure[^>]*>\s*<img[^>]*src="([^"]*)"[^>]*>\s*<\/figure>/gi, '\n![]($1)\n');

  // Standalone images
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)');

  // Headers
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n##### $1\n');
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n###### $1\n');

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Bold and italic
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');

  // Lists
  md = md.replace(/<ul[^>]*>/gi, '\n');
  md = md.replace(/<\/ul>/gi, '\n');
  md = md.replace(/<ol[^>]*>/gi, '\n');
  md = md.replace(/<\/ol>/gi, '\n');
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
    return '\n> ' + content.trim().replace(/\n/g, '\n> ') + '\n';
  });

  // Code blocks
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n');
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

  // Paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');

  // Line breaks
  md = md.replace(/<br\s*\/?>/gi, '\n');

  // Horizontal rules
  md = md.replace(/<hr\s*\/?>/gi, '\n---\n');

  // Remove remaining HTML tags
  md = md.replace(/<div[^>]*>/gi, '\n');
  md = md.replace(/<\/div>/gi, '\n');
  md = md.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');
  md = md.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  md = md.replace(/&nbsp;/g, ' ');
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#8211;/g, '-');
  md = md.replace(/&#8212;/g, '--');
  md = md.replace(/&#8216;/g, "'");
  md = md.replace(/&#8217;/g, "'");
  md = md.replace(/&#8220;/g, '"');
  md = md.replace(/&#8221;/g, '"');
  md = md.replace(/&#8230;/g, '...');
  md = md.replace(/&#39;/g, "'");

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.replace(/^\s+|\s+$/g, '');

  // Remove zero-width joiners and other special chars
  md = md.replace(/[\u200B-\u200D\uFEFF]/g, '');
  md = md.replace(/‍/g, ''); // Zero-width joiner

  return md.trim();
}

/**
 * Generate a URL-safe slug from title
 */
function generateSlug(title, existingSlug) {
  // Prefer existing slug from WordPress if available
  if (existingSlug && existingSlug.trim()) {
    return existingSlug.trim();
  }

  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

/**
 * Format date as ISO 8601 for TinaCMS
 */
function formatDate(dateStr) {
  if (!dateStr) return new Date().toISOString();

  // WordPress format: 2019-05-07 16:36:39
  const date = new Date(dateStr.replace(' ', 'T') + 'Z');
  if (isNaN(date.getTime())) {
    return new Date().toISOString();
  }
  return date.toISOString();
}

/**
 * Escape special characters in YAML strings
 */
function escapeYaml(str) {
  if (!str) return '';
  // If string contains special characters or starts with -, wrap in quotes
  if (
    /[:#{}\[\]&*?|>!%@`]/.test(str) ||
    str.includes('\n') ||
    str.startsWith(' ') ||
    str.endsWith(' ') ||
    str.startsWith('-')
  ) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return str;
}

/**
 * Extract first paragraph or sentences for description
 */
function generateDescription(content, maxLength = 160) {
  if (!content) return '';

  // Get first paragraph
  const paragraphs = content.split(/\n\n+/);
  let desc = paragraphs[0] || '';

  // Strip markdown formatting
  desc = desc.replace(/\*\*([^*]+)\*\*/g, '$1');
  desc = desc.replace(/\*([^*]+)\*/g, '$1');
  desc = desc.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  desc = desc.replace(/^#+\s*/gm, '');
  desc = desc.replace(/^-\s+/gm, ''); // Remove list markers
  desc = desc.replace(/\n/g, ' ');
  desc = desc.trim();

  // Truncate if needed
  if (desc.length > maxLength) {
    desc = desc.substring(0, maxLength - 3).trim() + '...';
  }

  return desc;
}

/**
 * Parse WordPress XML and extract posts
 */
function parseWordPressXML(xmlContent) {
  const posts = [];

  // Extract all items
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlContent)) !== null) {
    const itemContent = match[1];

    // Check if this is a post (not page, attachment, etc.)
    const postTypeMatch = itemContent.match(/<wp:post_type><!\[CDATA\[(.*?)\]\]><\/wp:post_type>/);
    const postType = postTypeMatch ? postTypeMatch[1] : '';

    if (postType !== 'post') {
      continue;
    }

    // Check status (only published posts)
    const statusMatch = itemContent.match(/<wp:status><!\[CDATA\[(.*?)\]\]><\/wp:status>/);
    const status = statusMatch ? statusMatch[1] : '';

    if (status !== 'publish') {
      continue;
    }

    // Extract fields
    const titleMatch = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
                       itemContent.match(/<title>([\s\S]*?)<\/title>/);
    const contentMatch = itemContent.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
    const excerptMatch = itemContent.match(/<excerpt:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/excerpt:encoded>/);
    const dateMatch = itemContent.match(/<wp:post_date><!\[CDATA\[(.*?)\]\]><\/wp:post_date>/);
    const slugMatch = itemContent.match(/<wp:post_name><!\[CDATA\[(.*?)\]\]><\/wp:post_name>/);
    const authorMatch = itemContent.match(/<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/);

    // Extract categories and tags
    const categories = [];
    const tags = [];
    const categoryRegex = /<category domain="(category|post_tag)" nicename="[^"]*"><!\[CDATA\[(.*?)\]\]><\/category>/g;
    let catMatch;
    while ((catMatch = categoryRegex.exec(itemContent)) !== null) {
      if (catMatch[1] === 'category') {
        categories.push(catMatch[2]);
      } else {
        tags.push(catMatch[2]);
      }
    }

    const title = titleMatch ? decodeHtmlEntities(titleMatch[1].trim()) : 'Untitled';
    const rawContent = contentMatch ? contentMatch[1] : '';
    const excerpt = excerptMatch ? excerptMatch[1].trim() : '';
    const date = dateMatch ? dateMatch[1] : '';
    const slug = slugMatch ? slugMatch[1] : '';
    const author = authorMatch ? authorMatch[1] : '';

    // Process content
    const strippedContent = stripShortcodes(rawContent);
    const markdownContent = htmlToMarkdown(strippedContent);

    posts.push({
      title,
      slug: generateSlug(title, slug),
      date: formatDate(date),
      author,
      excerpt,
      categories,
      tags,
      content: markdownContent,
    });
  }

  return posts;
}

/**
 * Map WordPress author to TinaCMS author slug
 */
function mapAuthor(wpAuthor) {
  const authorMap = {
    phil_white: "phil-white",
    "Matt Deasy": "matt-deasy",
    "paloma@grounded.world": "paloma-jacome",
    andrew: "andrew-yates",
  };
  return authorMap[wpAuthor] || null;
}

/**
 * Map WordPress category to TinaCMS category slug
 */
function mapCategory(categories) {
  // Priority mapping - first match wins
  const categoryMap = {
    "Brand Purpose Agency": "brand-purpose",
    "Purpose-in-business": "brand-purpose",
    "Activating Brand Purpose and Sustainability": "brand-purpose",
    Sustainability: "sustainability",
    "Sustainability Marketing": "sustainability",
    "Sustainable Development Goals": "sustainability",
    sustainability: "sustainability",
    "Brand Activism": "brand-activism",
    "Brand Activism and Storytelling": "brand-activism",
    activism: "brand-activism",
    "Social Impact": "social-impact",
    "Social Justice": "social-impact",
    "Retail-Shopper": "retail-shopper",
    Strategy: "strategy",
    "B-Corps": "b-corps",
    "Partnerships-community": "partnerships",
    "Balancing Purpose and Profit": "brand-purpose",
  };

  for (const cat of categories) {
    if (categoryMap[cat]) {
      return categoryMap[cat];
    }
  }
  return null;
}

/**
 * Generate markdown file content with frontmatter
 */
function generateMarkdownFile(post) {
  const description = post.excerpt || generateDescription(post.content);

  let frontmatter = "---\n";
  frontmatter += `title: ${escapeYaml(post.title)}\n`;
  frontmatter += `date: ${post.date}\n`;

  if (description) {
    frontmatter += `description: ${escapeYaml(description)}\n`;
  }

  // Add author
  const author = mapAuthor(post.author);
  if (author) {
    frontmatter += `author: ${author}\n`;
  }

  // Add category
  const category = mapCategory(post.categories);
  if (category) {
    frontmatter += `category: ${category}\n`;
  }

  // Add tags
  if (post.tags.length > 0) {
    frontmatter += `tags:\n`;
    for (const tag of post.tags) {
      frontmatter += `  - ${escapeYaml(tag)}\n`;
    }
  }

  // Check if featured
  if (post.categories.includes("featured")) {
    frontmatter += `featured: true\n`;
  }

  frontmatter += "---\n\n";

  return frontmatter + post.content;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 WordPress to TinaCMS Migration\n');
  console.log(`Input:  ${options.input}`);
  console.log(`Output: ${options.output}`);
  console.log(`Mode:   ${options.dryRun ? 'DRY RUN' : 'LIVE'}\n`);

  // Read XML file
  const inputPath = path.resolve(process.cwd(), options.input);
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    process.exit(1);
  }

  console.log('📖 Reading WordPress export...');
  const xmlContent = fs.readFileSync(inputPath, 'utf-8');

  // Parse posts
  console.log('🔍 Parsing posts...');
  const posts = parseWordPressXML(xmlContent);

  console.log(`📝 Found ${posts.length} published posts\n`);

  if (posts.length === 0) {
    console.log('No posts to migrate.');
    return;
  }

  // Ensure output directory exists
  const outputPath = path.resolve(process.cwd(), options.output);
  if (!options.dryRun && !fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Track used slugs to avoid duplicates
  const usedSlugs = new Set();

  // Process each post
  let successCount = 0;
  let skipCount = 0;

  for (const post of posts) {
    // Handle duplicate slugs
    let slug = post.slug;
    let counter = 1;
    while (usedSlugs.has(slug)) {
      slug = `${post.slug}-${counter++}`;
    }
    usedSlugs.add(slug);

    const filename = `${slug}.md`;
    const filepath = path.join(outputPath, filename);

    // Generate markdown content
    const markdownContent = generateMarkdownFile(post);

    if (options.verbose || options.dryRun) {
      console.log(`\n📄 ${filename}`);
      console.log(`   Title: ${post.title}`);
      console.log(`   Date: ${post.date}`);
      console.log(`   Content length: ${post.content.length} chars`);
    }

    if (!options.dryRun) {
      try {
        fs.writeFileSync(filepath, markdownContent, 'utf-8');
        successCount++;
        if (!options.verbose) {
          process.stdout.write('.');
        }
      } catch (err) {
        console.error(`\n❌ Error writing ${filename}: ${err.message}`);
        skipCount++;
      }
    } else {
      successCount++;
    }
  }

  console.log('\n');
  console.log('━'.repeat(50));
  console.log(`✅ Migrated: ${successCount} posts`);
  if (skipCount > 0) {
    console.log(`⚠️  Skipped:  ${skipCount} posts`);
  }
  if (options.dryRun) {
    console.log('\n💡 Run without --dry-run to actually write files');
  } else {
    console.log(`\n📁 Files written to: ${options.output}`);
  }
}

// Run migration
migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
