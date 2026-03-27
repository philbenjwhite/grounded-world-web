#!/bin/bash
# Sync SEO titles and descriptions from production WordPress (grounded.world)
# into local content files (posts, work, pages).
#
# Usage: bash scripts/sync-seo-from-production.sh [--dry-run]
#
# Outputs a report of what was updated.

set -euo pipefail

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "=== DRY RUN MODE — no files will be modified ==="
  echo ""
fi

CONTENT_DIR="/Users/mark/www/active/work/grounded-world-web/content"
REPORT_FILE="/Users/mark/www/active/work/grounded-world-web/docs/seo-sync-report.csv"
USER_AGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
DELAY=0.5  # seconds between requests to be polite

# Initialize report
echo "Type,Slug,Production URL,SEO Title,SEO Description,Status" > "$REPORT_FILE"

updated=0
skipped=0
failed=0

fetch_seo() {
  local url="$1"
  local html
  html=$(curl -sL -A "$USER_AGENT" --max-time 10 "$url" 2>/dev/null || echo "")

  if [[ -z "$html" ]]; then
    echo "FETCH_FAILED"
    return
  fi

  local title
  title=$(echo "$html" | grep -oP '<title>\K[^<]+' | head -1 | sed 's/^ *//;s/ *$//')

  local description
  description=$(echo "$html" | grep -oP '<meta name="description" content="\K[^"]*' | head -1 | sed 's/^ *//;s/ *$//')

  # Return as tab-separated
  printf '%s\t%s' "$title" "$description"
}

update_markdown_frontmatter() {
  local file="$1"
  local seo_title="$2"
  local seo_description="$3"

  if [[ ! -f "$file" ]]; then
    return 1
  fi

  # Check if seoTitle already exists
  if grep -q '^seoTitle:' "$file"; then
    # Update existing
    sed -i '' "s|^seoTitle:.*|seoTitle: \"$(echo "$seo_title" | sed 's/"/\\"/g')\"|" "$file"
  else
    # Add after title line
    sed -i '' "/^title:/a\\
seoTitle: \"$(echo "$seo_title" | sed 's/"/\\"/g')\"
" "$file"
  fi

  if grep -q '^seoDescription:' "$file"; then
    sed -i '' "s|^seoDescription:.*|seoDescription: \"$(echo "$seo_description" | sed 's/"/\\"/g')\"|" "$file"
  else
    # Add after seoTitle line
    sed -i '' "/^seoTitle:/a\\
seoDescription: \"$(echo "$seo_description" | sed 's/"/\\"/g')\"
" "$file"
  fi
}

# ============================================================
# 1. Blog posts — map slug to WordPress category URL
# ============================================================
echo "--- Processing blog posts ---"

# Build category mapping from the CSV
# We'll extract WordPress paths for blog posts and map slug -> WP URL
declare -A post_wp_urls

while IFS= read -r line; do
  # Extract the display text (path) from the HYPERLINK formula in column 2
  wp_path=$(echo "$line" | grep -oP 'Blog Post.*?HYPERLINK\("https://grounded\.world[^"]*","([^"]*)"' | grep -oP '","\K[^"]*' | head -1)
  if [[ -n "$wp_path" ]]; then
    # Extract slug (last path segment)
    slug=$(echo "$wp_path" | sed 's|/$||' | awk -F/ '{print $NF}')
    post_wp_urls["$slug"]="https://grounded.world${wp_path}"
  fi
done < "/Users/mark/www/active/work/grounded-world-web/docs/redirect-audit.csv"

for post_file in "$CONTENT_DIR"/posts/*.md; do
  slug=$(basename "$post_file" .md)

  if [[ -z "${post_wp_urls[$slug]:-}" ]]; then
    echo "  SKIP (no WP URL mapping): $slug"
    echo "Post,$slug,,,,Skipped - no WP URL mapping" >> "$REPORT_FILE"
    ((skipped++)) || true
    continue
  fi

  wp_url="${post_wp_urls[$slug]}"
  echo -n "  Fetching: $slug ... "

  result=$(fetch_seo "$wp_url")
  if [[ "$result" == "FETCH_FAILED" ]]; then
    echo "FAILED"
    echo "Post,$slug,$wp_url,,,Fetch failed" >> "$REPORT_FILE"
    ((failed++)) || true
    sleep "$DELAY"
    continue
  fi

  seo_title=$(echo "$result" | cut -f1)
  seo_description=$(echo "$result" | cut -f2)

  if [[ -z "$seo_title" && -z "$seo_description" ]]; then
    echo "EMPTY"
    echo "Post,$slug,$wp_url,,,Empty response" >> "$REPORT_FILE"
    ((failed++)) || true
    sleep "$DELAY"
    continue
  fi

  echo "OK"
  echo "    Title: $seo_title"
  echo "    Desc:  ${seo_description:0:80}..."

  if [[ "$DRY_RUN" == false ]]; then
    update_markdown_frontmatter "$post_file" "$seo_title" "$seo_description"
  fi

  # Escape commas for CSV
  csv_title=$(echo "$seo_title" | sed 's/,/;/g')
  csv_desc=$(echo "$seo_description" | sed 's/,/;/g')
  echo "Post,$slug,$wp_url,$csv_title,$csv_desc,Updated" >> "$REPORT_FILE"
  ((updated++)) || true

  sleep "$DELAY"
done

# ============================================================
# 2. Work/case study pages
# ============================================================
echo ""
echo "--- Processing case studies ---"

declare -A work_wp_urls

while IFS= read -r line; do
  wp_path=$(echo "$line" | grep -oP 'Case Study.*?HYPERLINK\("https://grounded\.world[^"]*","([^"]*)"' | grep -oP '","\K[^"]*' | head -1)
  if [[ -n "$wp_path" ]]; then
    # The new slug is the last segment of the NEW path, not the WP path
    # But we need to map from local file slug -> WP URL
    # Extract the new path from column 6
    new_path=$(echo "$line" | grep -oP 'grounded-world-web-staging\.vercel\.app[^"]*","([^"]*)"' | grep -oP '","\K[^"]*' | tail -1)
    if [[ -n "$new_path" ]]; then
      new_slug=$(echo "$new_path" | sed 's|/$||' | awk -F/ '{print $NF}')
      work_wp_urls["$new_slug"]="https://grounded.world${wp_path}"
    fi
  fi
done < "/Users/mark/www/active/work/grounded-world-web/docs/redirect-audit.csv"

for work_file in "$CONTENT_DIR"/work/*.md; do
  slug=$(basename "$work_file" .md)

  if [[ -z "${work_wp_urls[$slug]:-}" ]]; then
    # Try direct match: /our-work/{slug}/
    wp_url="https://grounded.world/our-work/${slug}/"
  else
    wp_url="${work_wp_urls[$slug]}"
  fi

  echo -n "  Fetching: $slug ... "

  result=$(fetch_seo "$wp_url")
  if [[ "$result" == "FETCH_FAILED" ]]; then
    echo "FAILED"
    echo "Work,$slug,$wp_url,,,Fetch failed" >> "$REPORT_FILE"
    ((failed++)) || true
    sleep "$DELAY"
    continue
  fi

  seo_title=$(echo "$result" | cut -f1)
  seo_description=$(echo "$result" | cut -f2)

  if [[ -z "$seo_title" && -z "$seo_description" ]]; then
    echo "EMPTY"
    echo "Work,$slug,$wp_url,,,Empty response" >> "$REPORT_FILE"
    ((failed++)) || true
    sleep "$DELAY"
    continue
  fi

  echo "OK"
  echo "    Title: $seo_title"
  echo "    Desc:  ${seo_description:0:80}..."

  if [[ "$DRY_RUN" == false ]]; then
    update_markdown_frontmatter "$work_file" "$seo_title" "$seo_description"
  fi

  csv_title=$(echo "$seo_title" | sed 's/,/;/g')
  csv_desc=$(echo "$seo_description" | sed 's/,/;/g')
  echo "Work,$slug,$wp_url,$csv_title,$csv_desc,Updated" >> "$REPORT_FILE"
  ((updated++)) || true

  sleep "$DELAY"
done

echo ""
echo "=== DONE ==="
echo "Updated: $updated"
echo "Skipped: $skipped"
echo "Failed:  $failed"
echo ""
echo "Full report: $REPORT_FILE"
