#!/usr/bin/env node
/**
 * Sync SEO titles and descriptions from production WordPress (grounded.world)
 * into local content files (posts, work).
 *
 * Usage:
 *   node scripts/sync-seo-from-production.mjs           # live run
 *   node scripts/sync-seo-from-production.mjs --dry-run  # preview only
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const DRY_RUN = process.argv.includes('--dry-run');
const CONTENT_DIR = join(import.meta.dirname, '..', 'content');
const CSV_PATH = join(import.meta.dirname, '..', 'docs', 'redirect-audit.csv');
const REPORT_PATH = join(import.meta.dirname, '..', 'docs', 'seo-sync-report.csv');
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)';
const DELAY_MS = 500;

if (DRY_RUN) console.log('=== DRY RUN MODE — no files will be modified ===\n');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchSeo(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });
    const html = await response.text();

    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/);

    return {
      title: titleMatch ? titleMatch[1].trim() : '',
      description: descMatch ? descMatch[1].trim() : '',
    };
  } catch {
    return null;
  }
}

function buildWpUrlMap(csv, category) {
  const map = new Map();
  const lines = csv.split('\n');

  for (const line of lines) {
    if (!line.startsWith(category + ',')) continue;

    // CSV uses doubled quotes: HYPERLINK(""url"",""display"")
    // Extract WordPress URL from column 2
    const wpMatch = line.match(/HYPERLINK\(""https:\/\/grounded\.world([^"]*?)"",""([^"]*?)""\)/);
    if (!wpMatch) continue;
    const wpPath = wpMatch[1];

    // Extract new site slug from HYPERLINK formulas pointing to staging
    const newMatches = [...line.matchAll(/grounded-world-web-staging\.vercel\.app([^"]*?)"",""([^"]*?)""\)/g)];
    if (newMatches.length === 0) continue;

    // Use the last match (column 6 = New Site Path Actual)
    const lastMatch = newMatches[newMatches.length - 1];
    const newPath = lastMatch[2];
    const slug = newPath.replace(/\/$/, '').split('/').pop();

    if (slug) {
      map.set(slug, `https://grounded.world${wpPath}`);
    }
  }

  return map;
}

function updateMarkdownFrontmatter(filePath, seoTitle, seoDescription) {
  let content = readFileSync(filePath, 'utf-8');

  // Check if within frontmatter (between --- delimiters)
  const frontmatterEnd = content.indexOf('---', 3);
  if (frontmatterEnd === -1) return content;

  let frontmatter = content.slice(0, frontmatterEnd);
  const body = content.slice(frontmatterEnd);

  const escapedTitle = seoTitle.replace(/"/g, '\\"');
  const escapedDesc = seoDescription.replace(/"/g, '\\"');

  // Update or add seoTitle
  if (frontmatter.includes('\nseoTitle:')) {
    frontmatter = frontmatter.replace(/\nseoTitle:.*/, `\nseoTitle: "${escapedTitle}"`);
  } else {
    // Add after title line
    frontmatter = frontmatter.replace(/(\ntitle:.*\n)/, `$1seoTitle: "${escapedTitle}"\n`);
  }

  // Update or add seoDescription
  if (frontmatter.includes('\nseoDescription:')) {
    frontmatter = frontmatter.replace(/\nseoDescription:.*/, `\nseoDescription: "${escapedDesc}"`);
  } else {
    // Add after seoTitle line
    frontmatter = frontmatter.replace(/(\nseoTitle:.*\n)/, `$1seoDescription: "${escapedDesc}"\n`);
  }

  return frontmatter + body;
}

async function processFiles(type, contentSubdir, csvCategory) {
  console.log(`--- Processing ${type} ---`);

  const csv = readFileSync(CSV_PATH, 'utf-8');
  const wpUrlMap = buildWpUrlMap(csv, csvCategory);

  const dir = join(CONTENT_DIR, contentSubdir);
  let files;
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch {
    console.log(`  Directory not found: ${dir}`);
    return { updated: 0, skipped: 0, failed: 0, rows: [] };
  }

  let updated = 0;
  let skipped = 0;
  let failed = 0;
  const rows = [];

  for (const file of files) {
    const slug = basename(file, '.md');
    let wpUrl = wpUrlMap.get(slug);

    if (!wpUrl && type === 'Work') {
      // Try direct URL pattern
      wpUrl = `https://grounded.world/our-work/our-work-${slug}/`;
    }

    if (!wpUrl) {
      console.log(`  SKIP (no WP URL): ${slug}`);
      rows.push(`${type},${slug},,,,Skipped - no WP URL mapping`);
      skipped++;
      continue;
    }

    process.stdout.write(`  Fetching: ${slug} ... `);

    const seo = await fetchSeo(wpUrl);
    if (!seo) {
      console.log('FAILED');
      rows.push(`${type},${slug},${wpUrl},,,Fetch failed`);
      failed++;
      await sleep(DELAY_MS);
      continue;
    }

    if (!seo.title && !seo.description) {
      console.log('EMPTY');
      rows.push(`${type},${slug},${wpUrl},,,Empty response`);
      failed++;
      await sleep(DELAY_MS);
      continue;
    }

    console.log('OK');
    console.log(`    Title: ${seo.title}`);
    console.log(`    Desc:  ${seo.description.slice(0, 80)}...`);

    const filePath = join(dir, file);
    if (!DRY_RUN) {
      const newContent = updateMarkdownFrontmatter(filePath, seo.title, seo.description);
      writeFileSync(filePath, newContent, 'utf-8');
    }

    const csvTitle = seo.title.replace(/,/g, ';');
    const csvDesc = seo.description.replace(/,/g, ';');
    rows.push(`${type},${slug},${wpUrl},${csvTitle},${csvDesc},Updated`);
    updated++;

    await sleep(DELAY_MS);
  }

  return { updated, skipped, failed, rows };
}

async function main() {
  const reportRows = ['Type,Slug,Production URL,SEO Title,SEO Description,Status'];

  const posts = await processFiles('Post', 'posts', 'Blog Post');
  console.log('');
  const work = await processFiles('Work', 'work', 'Case Study');

  reportRows.push(...posts.rows, ...work.rows);
  writeFileSync(REPORT_PATH, reportRows.join('\n') + '\n', 'utf-8');

  const totalUpdated = posts.updated + work.updated;
  const totalSkipped = posts.skipped + work.skipped;
  const totalFailed = posts.failed + work.failed;

  console.log('');
  console.log('=== DONE ===');
  console.log(`Updated: ${totalUpdated}`);
  console.log(`Skipped: ${totalSkipped}`);
  console.log(`Failed:  ${totalFailed}`);
  console.log(`\nFull report: ${REPORT_PATH}`);
}

main();
