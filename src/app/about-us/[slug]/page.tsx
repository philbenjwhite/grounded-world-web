import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import serverClient from "../../../../tina/server-client";
import TeamMemberClientPage from "./client-page";
import type { RelatedArticleItem } from "@/components/components/RelatedArticles/RelatedArticles";

interface PageParams {
  slug: string;
}

export async function generateStaticParams() {
  try {
    const response = await serverClient.queries.teamMemberConnection();
    return (
      response.data.teamMemberConnection.edges
        ?.map((edge) => ({
          slug: edge?.node?._sys.filename,
        }))
        .filter((p) => p.slug) ?? []
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await serverClient.queries.teamMember({
      relativePath: `${slug}.json`,
    });
    const member = response.data.teamMember;

    return {
      title: `${member.name} — ${member.role} | Grounded World`,
      description: member.shortBio ?? undefined,
      openGraph: {
        title: `${member.name} — ${member.role}`,
        description: member.shortBio ?? undefined,
        type: "profile",
        images: member.photoUrl ? [member.photoUrl] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: `${member.name} — ${member.role}`,
        description: member.shortBio ?? undefined,
      },
    };
  } catch {
    return {};
  }
}

/** Fetch articles written by a specific team member slug */
async function getArticlesByAuthor(
  memberSlug: string,
): Promise<RelatedArticleItem[]> {
  const referencePath = `content/team-members/${memberSlug}.json`;

  try {
    const dir = path.join(process.cwd(), "content", "posts");
    const files = await fs.readdir(dir);
    const articles: RelatedArticleItem[] = [];

    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      try {
        const raw = await fs.readFile(path.join(dir, file), "utf-8");
        const fmEnd = raw.indexOf("---", 3);
        if (fmEnd === -1) continue;
        const frontmatter = raw.slice(3, fmEnd).trim();

        const authorMatch = frontmatter.match(
          /^author:\s*['"]?(.+?)['"]?\s*$/m,
        );
        const author = authorMatch?.[1];

        // Match both reference path and plain slug formats
        if (author !== referencePath && author !== memberSlug) continue;

        const titleMatch = frontmatter.match(
          /^title:\s*(?:"([^"]+)"|'([^']+)'|(.+))$/m,
        );
        const dateMatch = frontmatter.match(
          /^date:\s*['"]?(.+?)['"]?\s*$/m,
        );
        const imageMatch = frontmatter.match(
          /^featuredImage:\s*['"]?(.+?)['"]?\s*$/m,
        );

        articles.push({
          slug: file.replace(/\.md$/, ""),
          title:
            titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3] ?? file,
          date: dateMatch?.[1] ?? "",
          featuredImage: imageMatch?.[1],
        });
      } catch {
        continue;
      }
    }

    articles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return articles;
  } catch {
    return [];
  }
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;

  let result;
  try {
    result = await serverClient.queries.teamMember({
      relativePath: `${slug}.json`,
    });
  } catch {
    notFound();
  }

  const articles = await getArticlesByAuthor(slug);

  return (
    <TeamMemberClientPage
      query={result.query}
      variables={result.variables as { relativePath: string }}
      data={result.data}
      articles={articles}
      slug={slug}
    />
  );
}
