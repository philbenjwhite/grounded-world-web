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

/** TinaCMS rich-text AST node */
interface TinaNode {
  type: string;
  text?: string;
  children?: TinaNode[];
}

/** Recursively extract plain text from a TinaCMS rich-text AST node */
function extractTinaText(node: TinaNode): string {
  if (node.text) return node.text;
  if (!node.children) return "";
  return node.children.map(extractTinaText).join("");
}

/** Extract h2 headings from TinaCMS rich-text JSON AST (for TOC) */
export function extractHeadingsFromTinaContent(
  body: TinaNode | TinaNode[] | null | undefined,
): TocHeading[] {
  if (!body) return [];
  const nodes = Array.isArray(body) ? body : body.children ?? [];
  const headings: TocHeading[] = [];
  const usedIds = new Set<string>();

  for (const node of nodes) {
    if (node.type !== "h2") continue;

    const text = extractTinaText(node).trim();
    if (!text) continue;

    let id = slugify(text);
    if (!id) id = `section-${headings.length + 1}`;

    const baseId = id;
    let counter = 1;
    while (usedIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }
    usedIds.add(id);

    headings.push({ id, text, level: 2 });
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
    const props = (children as { props: { children?: React.ReactNode; content?: unknown } }).props;
    // TinaMarkdown wraps heading children in <TinaMarkdown content={...} />;
    // extract text from the AST content if present
    if (props.content && !props.children) {
      return extractTinaTextFromContent(props.content);
    }
    return extractText(props.children);
  }
  return "";
}

/** Extract plain text from a TinaCMS rich-text content prop (array of AST nodes) */
function extractTinaTextFromContent(content: unknown): string {
  if (!content) return "";
  if (Array.isArray(content)) {
    return content.map((node) => extractTinaText(node as TinaNode)).join("");
  }
  return extractTinaText(content as TinaNode);
}
