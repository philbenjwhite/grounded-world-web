import fs from "fs";
import path from "path";

export interface AuthorData {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedinUrl?: string;
}

/** Directory where TinaCMS author JSON files live */
const AUTHORS_DIR = path.join(process.cwd(), "content", "authors");

/** Module-level cache so we only read from disk once per build/request */
let cachedAuthors: Record<string, AuthorData> | null = null;

/**
 * Load all authors from content/authors/*.json.
 * Cached in memory after the first call.
 */
function loadAuthors(): Record<string, AuthorData> {
  if (cachedAuthors) return cachedAuthors;

  const authors: Record<string, AuthorData> = {};

  try {
    const files = fs.readdirSync(AUTHORS_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(AUTHORS_DIR, file), "utf-8");
        const data = JSON.parse(raw);
        const slug = file.replace(/\.json$/, "");
        authors[slug] = {
          slug,
          name: data.name ?? slug,
          role: data.role ?? "",
          bio: data.bio ?? "",
          photoUrl: data.photoUrl ?? "",
          linkedinUrl: data.linkedinUrl ?? undefined,
        };
      } catch {
        // Skip malformed files
      }
    }
  } catch {
    // Directory doesn't exist yet — return empty
  }

  cachedAuthors = authors;
  return authors;
}

export function getAuthor(slug: string): AuthorData | undefined {
  return loadAuthors()[slug];
}

export function getAuthorName(slug: string): string {
  return loadAuthors()[slug]?.name ?? slug;
}
