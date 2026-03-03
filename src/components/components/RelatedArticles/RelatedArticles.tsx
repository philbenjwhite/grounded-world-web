import Image from "next/image";
import Link from "next/link";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Grid from "@/components/layout/Grid";

export interface RelatedArticleItem {
  slug: string;
  title: string;
  date: string;
  featuredImage?: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticleItem[];
  heading?: string;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function RelatedArticles({ articles, heading = "Related Articles" }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <div>
      <Heading level={2} size="h3" color="primary" className="mb-8">
        {heading}
      </Heading>

      <Grid cols={3} colsTablet={2} colsMobile={1} gap="lg">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/resources/articles/${article.slug}`}
            className="group flex flex-col rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.025] transition-colors hover:border-white/[0.12]"
          >
            {article.featuredImage && (
              <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
            )}

            <div className="flex flex-col flex-1 p-5 gap-2">
              <Heading
                level={3}
                size="h4"
                color="primary"
                className="line-clamp-2 group-hover:text-[color:var(--color-cyan)] transition-colors"
              >
                {article.title}
              </Heading>

              {article.date && (
                <Text size="body-xs" color="tertiary">
                  {formatDate(article.date)}
                </Text>
              )}

              <div className="mt-auto pt-2">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-cyan)]">
                  Read Article
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </Grid>
    </div>
  );
}
