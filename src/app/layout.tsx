import type { Metadata } from "next";
import "./globals.css";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import PixelScripts from "@/components/storefront/PixelScripts";
import { Montserrat, Playfair_Display, Poppins } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap"
});

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const [seo, general] = await Promise.all([
    getSetting("seo", DEFAULT_SETTINGS.seo),
    getSetting("general", DEFAULT_SETTINGS.general),
  ]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://www.devineora.online";
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
    <html lang="en" className={`overflow-x-hidden ${montserrat.variable} ${playfair.variable} ${poppins.variable}`}>
      <body className="font-sans text-ink bg-bg overflow-x-hidden w-full max-w-[100vw]">
        <PixelScripts pixels={pixels} />
        {children}
      </body>
    </html>
  );
}
