export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

/** Convert text to a URL-safe slug for heading anchors */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Extract h2 section headings from raw markdown (for TOC) */
export function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const usedIds = new Set<string>();
  const regex = /^(#{2})\s+(.+)$/gm;

  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length;
    // Strip bold markers (**) and other inline formatting
    const text = match[2]
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .trim();

    let id = slugify(text);

    // Skip headings that produce no usable slug
    if (!id) id = `section-${headings.length + 1}`;

    // Ensure uniqueness by appending a suffix for duplicates
    const baseId = id;
    let counter = 1;
    while (usedIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }
    usedIds.add(id);

    headings.push({ id, text, level });
  }

  return headings;
}

/** Extract plain text from React children (for heading renderers) */
export function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (!children) return "";
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (typeof children === "object" && "props" in children) {
    const props = (children as { props: { children?: React.ReactNode } }).props;
    return extractText(props.children);
  }
  return "";
}
