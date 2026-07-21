import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://literate-octo-parakeet.vercel.app";
  
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/track-order`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const [products, categories, articles] = await Promise.all([
      prisma.product.findMany({ where: { status: "active" }, select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.article.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })
    ]);

    return [
      ...staticPages,
      ...categories.map((c) => ({
        url: `${siteUrl}/category/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "daily" as const,
        priority: 0.7
      })),
      ...products.map((p) => ({
        url: `${siteUrl}/product/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8
      })),
      ...articles.map((a) => ({
        url: `${siteUrl}/blog/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7
      }))
    ];
  } catch {
    // Fallback when DB is unavailable during build
    return staticPages;
  }
}

