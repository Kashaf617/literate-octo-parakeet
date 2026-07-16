import type { Metadata } from "next";
import "./globals.css";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import PixelScripts from "@/components/storefront/PixelScripts";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const [seo, general] = await Promise.all([
    getSetting("seo", DEFAULT_SETTINGS.seo),
    getSetting("general", DEFAULT_SETTINGS.general),
  ]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: seo.metaTitle || general.storeName, template: `%s | ${general.storeName}` },
    description: seo.metaDescription,
    robots: seo.robotsIndex ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: seo.ogImage ? [seo.ogImage] : [],
      siteName: general.storeName,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle,
      description: seo.metaDescription,
      images: seo.ogImage ? [seo.ogImage] : []
    },
    icons: { icon: "/favicon.ico" }
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pixels = await getSetting("pixels", DEFAULT_SETTINGS.pixels);
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <meta charSet="UTF-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans text-ink bg-bg overflow-x-hidden w-full max-w-[100vw]">
        <PixelScripts pixels={pixels} />
        {children}
      </body>
    </html>
  );
}
