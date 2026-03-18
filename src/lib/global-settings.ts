import fs from "fs";
import path from "path";
import serverClient from "../../tina/server-client";

export interface GlobalSettings {
  siteTitle?: string;
  siteDescription?: string;
  titleTemplate?: string;
  defaultOgImage?: string;
  social?: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
  newsletter?: {
    heading?: string;
    body?: string;
  };
}

/** Read global settings from filesystem (fallback when TinaCMS is not available) */
function loadFromFilesystem(): GlobalSettings | null {
  try {
    const filePath = path.join(process.cwd(), "content", "global", "index.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as GlobalSettings;
  } catch {
    return null;
  }
}

/**
 * Fetch global settings from TinaCMS, with filesystem fallback.
 * Safe to use during `build:no-tina` where the TinaCMS server isn't running.
 */
export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  try {
    const result = await serverClient.queries.global({
      relativePath: "index.json",
    });
    return result.data.global as unknown as GlobalSettings;
  } catch {
    return loadFromFilesystem();
  }
}
