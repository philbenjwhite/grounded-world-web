#!/usr/bin/env node

/**
 * Media Download and URL Rewrite Script
 *
 * Downloads images from WordPress and external sources, saves them locally,
 * and updates markdown files to use local paths.
 *
 * Usage:
 *   node scripts/download-media.js [options]
 *
 * Options:
 *   --dry-run      Preview without downloading or modifying files
 *   --verbose, -v  Show detailed output
 *   --skip-download Skip download, only rewrite URLs (if images already exist)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  postsDir: 'content/posts',
  outputDir: 'public/images/blog',
  dryRun: args.includes('--dry-run'),
  verbose: args.includes('--verbose') || args.includes('-v'),
  skipDownload: args.includes('--skip-download'),
};

/**
 * Extract all image URLs from markdown files
 */
function extractImageUrls(postsDir) {
  const urls = new Map(); // url -> Set of files that use it

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const filepath = path.join(postsDir, file);
    const content = fs.readFileSync(filepath, 'utf-8');

    // Match markdown image syntax: ![alt](url)
    const imageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const url = match[1];
      // Only process http/https URLs
      if (url.startsWith('http://') || url.startsWith('https://')) {
        if (!urls.has(url)) {
          urls.set(url, new Set());
        }
        urls.get(url).add(file);
      }
    }

    // Also match URLs in link targets that look like images
    // Pattern: ](https://...image-extension)
    const linkRegex = /\]\((https?:\/\/[^)]+\.(jpg|jpeg|png|gif|webp|svg))\)/gi;
    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[1];
      if (!urls.has(url)) {
        urls.set(url, new Set());
      }
      urls.get(url).add(file);
    }
  }

  return urls;
}

/**
 * Generate a local filename from a URL
 */
function urlToLocalPath(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Extract filename from path
    let filename = path.basename(pathname);

    // Handle WordPress uploads structure - flatten the path
    if (pathname.includes('/wp-content/uploads/')) {
      // Get the year/month/filename structure
      const uploadPath = pathname.split('/wp-content/uploads/')[1];
      // Replace slashes with hyphens to flatten
      filename = uploadPath.replace(/\//g, '-');
    }

    // Handle other domains - prefix with domain
    const domain = urlObj.hostname.replace(/\./g, '-');
    if (!url.includes('grounded.world')) {
      filename = `${domain}-${filename}`;
    }

    // Clean up filename
    filename = filename
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();

    return filename;
  } catch (e) {
    // Fallback: hash-based name
    const hash = url.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `image-${Math.abs(hash)}.jpg`;
  }
}

/**
 * Download a file from URL
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MediaDownloader/1.0)',
      },
      timeout: 30000,
    }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${url}`));
        return;
      }

      const file = fs.createWriteStream(destPath);
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });

      file.on('error', (err) => {
        fs.unlink(destPath, () => {}); // Delete partial file
        reject(err);
      });
    });

    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`Timeout: ${url}`));
    });
  });
}

/**
 * Update markdown file to use local image paths
 */
function updateMarkdownFile(filepath, urlMap) {
  let content = fs.readFileSync(filepath, 'utf-8');
  let modified = false;

  for (const [originalUrl, localPath] of urlMap) {
    if (content.includes(originalUrl)) {
      content = content.split(originalUrl).join(localPath);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filepath, content, 'utf-8');
    return true;
  }
  return false;
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️  Media Download & URL Rewrite\n');
  console.log(`Posts:  ${options.postsDir}`);
  console.log(`Output: ${options.outputDir}`);
  console.log(`Mode:   ${options.dryRun ? 'DRY RUN' : 'LIVE'}\n`);

  // Step 1: Extract all image URLs
  console.log('🔍 Scanning markdown files for images...');
  const imageUrls = extractImageUrls(options.postsDir);
  console.log(`   Found ${imageUrls.size} unique images\n`);

  if (imageUrls.size === 0) {
    console.log('No images to process.');
    return;
  }

  // Create output directory
  const outputPath = path.resolve(process.cwd(), options.outputDir);
  if (!options.dryRun && !fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
  }

  // Step 2: Download images
  const urlToLocalMap = new Map();
  let downloadCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  if (!options.skipDownload) {
    console.log('⬇️  Downloading images...');

    for (const [url, files] of imageUrls) {
      const localFilename = urlToLocalPath(url);
      const localFilepath = path.join(outputPath, localFilename);
      const localUrlPath = `/images/blog/${localFilename}`;

      urlToLocalMap.set(url, localUrlPath);

      if (options.verbose) {
        console.log(`\n   ${url}`);
        console.log(`   → ${localFilename}`);
        console.log(`   Used in: ${[...files].join(', ')}`);
      }

      if (options.dryRun) {
        downloadCount++;
        continue;
      }

      // Skip if already exists
      if (fs.existsSync(localFilepath)) {
        if (options.verbose) {
          console.log('   ✓ Already exists');
        }
        skipCount++;
        continue;
      }

      try {
        await downloadFile(url, localFilepath);
        downloadCount++;
        if (!options.verbose) {
          process.stdout.write('.');
        } else {
          console.log('   ✓ Downloaded');
        }
      } catch (err) {
        errorCount++;
        if (options.verbose) {
          console.log(`   ✗ Error: ${err.message}`);
        } else {
          process.stdout.write('x');
        }
        // Keep original URL if download fails
        urlToLocalMap.set(url, url);
      }

      // Small delay to be nice to servers
      await new Promise((r) => setTimeout(r, 100));
    }

    console.log('\n');
  } else {
    // Skip download mode - just build the URL map
    for (const [url] of imageUrls) {
      const localFilename = urlToLocalPath(url);
      const localUrlPath = `/images/blog/${localFilename}`;
      urlToLocalMap.set(url, localUrlPath);
    }
  }

  // Step 3: Update markdown files
  console.log('📝 Updating markdown files...');
  const files = fs.readdirSync(options.postsDir).filter((f) => f.endsWith('.md'));
  let updatedFiles = 0;

  for (const file of files) {
    const filepath = path.join(options.postsDir, file);

    if (options.dryRun) {
      // Check if file would be modified
      const content = fs.readFileSync(filepath, 'utf-8');
      let wouldModify = false;
      for (const [originalUrl] of urlToLocalMap) {
        if (content.includes(originalUrl)) {
          wouldModify = true;
          break;
        }
      }
      if (wouldModify) {
        updatedFiles++;
        if (options.verbose) {
          console.log(`   Would update: ${file}`);
        }
      }
    } else {
      if (updateMarkdownFile(filepath, urlToLocalMap)) {
        updatedFiles++;
        if (options.verbose) {
          console.log(`   Updated: ${file}`);
        } else {
          process.stdout.write('.');
        }
      }
    }
  }

  console.log('\n');

  // Summary
  console.log('━'.repeat(50));
  if (!options.skipDownload) {
    console.log(`✅ Downloaded: ${downloadCount} images`);
    if (skipCount > 0) {
      console.log(`⏭️  Skipped:    ${skipCount} (already exist)`);
    }
    if (errorCount > 0) {
      console.log(`❌ Errors:     ${errorCount}`);
    }
  }
  console.log(`📝 Updated:    ${updatedFiles} markdown files`);

  if (options.dryRun) {
    console.log('\n💡 Run without --dry-run to download and update files');
  } else {
    console.log(`\n📁 Images saved to: ${options.outputDir}`);
  }
}

// Run
main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
