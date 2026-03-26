import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import fs from "fs";
import path from "path";
import "./globals.css";
import Header from "@/components/components/Header";
import Footer from "@/components/components/Footer";
import client from "../../tina/__generated__/client";
import { getGlobalSettings } from "@/lib/global-settings";
import type { Service } from "../../tina/__generated__/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export async function generateMetadata(): Promise<Metadata> {
  const global = await getGlobalSettings();
  const description =
    global?.siteDescription ||
    "Grounded World is a B Corp certified agency at the intersection of brand purpose, commercial strategy, and social impact.";

  return {
    metadataBase: new URL("https://grounded.world"),
    title: {
      default:
        global?.siteTitle ||
        "Brand Purpose & Sustainability Agency | Grounded World",
      template:
        global?.titleTemplate || "%s | Grounded World",
    },
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Grounded World",
      description,
      ...(global?.defaultOgImage ? { images: [global.defaultOgImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

function loadServicesFromFiles(): Service[] {
  const dir = path.join(process.cwd(), "content/services");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")));
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let services: Service[] = [];
  try {
    const res = await client.queries.serviceConnection();
    services = (res.data.serviceConnection.edges
      ?.map((e) => e?.node)
      .filter(Boolean) ?? []) as Service[];
  } catch {
    services = loadServicesFromFiles() as Service[];
  }

  const global = await getGlobalSettings();

  return (
    <html lang="en">
      <head>
        {/* Calendly popup widget — preloaded globally for instant open */}
        <link
          href="https://assets.calendly.com/assets/external/widget.css"
          rel="stylesheet"
        />
        <script
          src="https://assets.calendly.com/assets/external/widget.js"
          type="text/javascript"
          async
        />
        {/* RB2B visitor identification */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(key){if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="https://ddwl4m2hdecbv.cloudfront.net/b/"+key+"/"+key+".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s,document.getElementsByTagName("script")[0]);}("XOE9GHRX35OM");`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header services={services} />
        <main className="flex-1">{children}</main>
        <Footer
          newsletter={{
            heading: global?.newsletter?.heading ?? undefined,
            body: global?.newsletter?.body ?? undefined,
          }}
          social={{
            linkedin: global?.social?.linkedin ?? undefined,
          }}
        />
      </body>
    </html>
  );
}
