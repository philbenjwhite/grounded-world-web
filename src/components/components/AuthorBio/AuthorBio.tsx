import Image from "next/image";
import Text from "@/components/atoms/Text";
import type { AuthorData } from "@/lib/authors";

interface AuthorBioProps {
  author: AuthorData;
}

function AuthorInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-16 h-16 rounded-full bg-[var(--color-cyan)]/20 flex items-center justify-center shrink-0 mx-auto">
      <span className="text-lg font-bold text-[color:var(--color-cyan)]">
        {initials}
      </span>
    </div>
  );
}

export default function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--font-color-tertiary)] mb-5">
        About the Author
      </p>

      <div className="flex flex-col items-center text-center">
        {author.photoUrl ? (
          <Image
            src={author.photoUrl}
            alt={author.name}
            width={80}
            height={80}
            className="rounded-full object-cover mb-4"
          />
        ) : (
          <div className="mb-4">
            <AuthorInitials name={author.name} />
          </div>
        )}

        <p className="text-base font-bold text-[color:var(--font-color-primary)]">
          {author.name}
        </p>
        {author.role && (
          <Text size="body-xs" color="tertiary" className="mt-0.5">
            {author.role}
          </Text>
        )}
        <Text size="body-sm" color="secondary" className="mt-3">
          {author.bio}
        </Text>
        {author.linkedinUrl && (
          <a
            href={author.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-[color:var(--color-cyan)] hover:underline"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}
