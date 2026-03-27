import fs from "fs";
import path from "path";
import serverClient from "../../tina/server-client";

export interface NavLink {
  label: string;
  href: string;
}

export interface ResourceLink extends NavLink {
  color?: string;
  icon?: string;
}

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
    successMessage?: string;
    emailPlaceholder?: string;
    buttonLabel?: string;
    disclaimer?: string;
  };
  navigation?: {
    mainLinks?: NavLink[];
    resourceLinks?: ResourceLink[];
    subscribeLabel?: string;
    contactLabel?: string;
    contactHref?: string;
  };
  footer?: {
    serviceLinks?: NavLink[];
    companyLinks?: NavLink[];
    servicesHeading?: string;
    resourcesHeading?: string;
    companyHeading?: string;
    copyrightText?: string;
  };
  contactForm?: {
    heading?: string;
    description?: string;
    eyebrow?: string;
    bookingLabel?: string;
    email?: string;
    emailContextText?: string;
    interestOptions?: string[];
    successHeading?: string;
    successMessage?: string;
    submitLabel?: string;
    sendingLabel?: string;
    errorMessage?: string;
    textWrapBalance?: boolean;
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
