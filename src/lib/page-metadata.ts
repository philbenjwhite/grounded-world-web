import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import serverClient from "../../tina/server-client";
import { getGlobalSettings } from "./global-settings";

interface PageData {
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  noIndex?: boolean;
}

/** Read page JSON directly from filesystem (fallback when TinaCMS is unavailable) */
function loadPageFromFilesystem(relativePath: string): PageData | null {
  try {
    const filePath = path.join(process.cwd(), "content", "pages", relativePath);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as PageData;
  } catch {
    return null;
  }
}

/**
 * Fetch SEO metadata for a TinaCMS page.
 * Falls back to the provided defaults when CMS fields are empty,
 * preserving existing SEO behaviour for every page.
 */
export async function getPageMetadata(
  relativePath: string,
  fallbackTitle: string,
  fallbackDescription?: string,
): Promise<Metadata> {
  let seoTitle: string | undefined;
  let seoDescription: string | undefined;
  let seoImage: string | undefined;
  let noIndex: boolean | undefined;

  try {
    const result = await serverClient.queries.page({ relativePath });
    const page = result.data.page;
    seoTitle = page.seoTitle ?? undefined;
    seoDescription = page.seoDescription ?? undefined;
    seoImage = page.seoImage ?? undefined;
    noIndex = page.noIndex ?? undefined;
  } catch {
    // TinaCMS server unavailable — try filesystem
    const page = loadPageFromFilesystem(relativePath);
    seoTitle = page?.seoTitle;
    seoDescription = page?.seoDescription;
    seoImage = page?.seoImage;
    noIndex = page?.noIndex;
  }

  // Fall back to global default OG image if page has none
  if (!seoImage) {
    const global = await getGlobalSettings();
    seoImage = global?.defaultOgImage ?? undefined;
  }

  const title = seoTitle || fallbackTitle;
  const description = seoDescription || fallbackDescription;

  const metadata: Metadata = {
    title,
    description,
  };

  if (seoImage) {
    metadata.openGraph = {
      title,
      description: description ?? undefined,
      images: [seoImage],
    };
    metadata.twitter = {
      card: "summary_large_image",
      title,
      description: description ?? undefined,
      images: [seoImage],
    };
  }

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}
