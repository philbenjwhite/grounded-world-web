import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import fs from "fs";
import path from "path";
import "./globals.css";
import Header from "@/components/components/Header";
import Footer from "@/components/components/Footer";
import client from "../../tina/__generated__/client";
import type { Service } from "../../tina/__generated__/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Brand Purpose & Sustainability Agency | Grounded World",
    template: "%s | Grounded World",
  },
  description:
    "Grounded World is a B Corp certified agency at the intersection of brand purpose, commercial strategy, and social impact.",
};

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

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header services={services} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
