export interface AuthorData {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedinUrl?: string;
}

export const AUTHORS: Record<string, AuthorData> = {
  "phil-white": {
    slug: "phil-white",
    name: "Phil White",
    role: "Founder & CEO",
    bio: "Founder and CEO of Grounded World, Phil brings decades of experience in brand strategy, purpose-driven marketing, and sustainable business transformation.",
    photoUrl: "/images/authors/phil-white.jpg",
    linkedinUrl: "https://www.linkedin.com/in/philwhitegrounded/",
  },
  "matt-deasy": {
    slug: "matt-deasy",
    name: "Matt Deasy",
    role: "Head of Strategy",
    bio: "Matt leads strategic thinking at Grounded World, specializing in brand purpose activation, consumer insights, and sustainability communications.",
    photoUrl: "/images/authors/matt-deasy.jpg",
    linkedinUrl: "https://www.linkedin.com/in/mattdeasy/",
  },
  "paloma-jacome": {
    slug: "paloma-jacome",
    name: "Paloma Jacome",
    role: "Senior Strategist",
    bio: "Paloma is a senior strategist at Grounded World with expertise in social impact, brand activism, and purpose-led communications.",
    photoUrl: "/images/authors/paloma-jacome.jpg",
  },
  "andrew-yates": {
    slug: "andrew-yates",
    name: "Andrew Yates",
    role: "Strategy Director",
    bio: "Andrew brings deep expertise in retail strategy, shopper marketing, and brand partnerships to the Grounded World team.",
    photoUrl: "/images/authors/andrew-yates.jpg",
  },
};

export function getAuthor(slug: string): AuthorData | undefined {
  return AUTHORS[slug];
}

export function getAuthorName(slug: string): string {
  return AUTHORS[slug]?.name ?? slug;
}
