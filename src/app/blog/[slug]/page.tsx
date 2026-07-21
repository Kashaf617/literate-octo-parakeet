import { prisma } from "@/lib/prisma";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import { MOCK_ARTICLES } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  let article: any = await prisma.article.findUnique({
    where: { slug: params.slug }
  });

  if (!article || !article.published) {
    article = MOCK_ARTICLES.find(a => a.slug === params.slug);
  }

  if (!article) return {};

  const general = await getSetting("general", DEFAULT_SETTINGS.general);

  return {
    title: `${article.title} | ${general.storeName} Journal`,
    description: article.excerpt || `Read ${article.title} on ${general.storeName}.`,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image }],
      type: "article"
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image]
    }
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  let article: any = await prisma.article.findUnique({
    where: { slug: params.slug }
  });

  if (!article || !article.published) {
    article = MOCK_ARTICLES.find(a => a.slug === params.slug);
  }

  if (!article) {
    return notFound();
  }

  const general = await getSetting("general", DEFAULT_SETTINGS.general);

  // Fetch recent articles for recommendations
  const recentArticles = await prisma.article.findMany({
    where: { published: true, id: { not: article.id } },
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  const displayRecent = recentArticles.length > 0 ? recentArticles : MOCK_ARTICLES.filter(a => a.slug !== params.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "image": [article.image],
    "datePublished": article.createdAt ? new Date(article.createdAt).toISOString() : new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": general.storeName
    },
    "publisher": {
      "@type": "Organization",
      "name": general.storeName
    },
    "description": article.excerpt
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header
        storeName={general.storeName}
        tagline={general.tagline}
        supportPhone={general.supportPhone}
        freeShippingText={general.freeShippingText}
      />
      <main className="bg-[#f8f9fa] min-h-screen pb-20">
        
        {/* Article Header */}
        <div className="max-w-[800px] mx-auto px-6 pt-16 pb-10">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sub hover:text-black transition-colors text-[12px] font-bold uppercase tracking-wider mb-8">
            <ChevronLeft className="w-4 h-4" /> Back to Journal
          </Link>
          
          <span className="block text-[#C9A227] text-[12px] font-black uppercase tracking-[0.2em] mb-4">
            {article.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-black leading-[1.15] tracking-tight mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-500 text-[13px] font-medium border-t border-line pt-6 mt-6">
            <span>Published on {article.date || article.createdAt?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span>•</span>
            <span>By {general.storeName} Editorial</span>
          </div>
        </div>

        {/* Article Featured Image */}
        <div className="max-w-[1000px] mx-auto px-6 mb-16">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl bg-white border border-line">
            <Image 
              src={article.image} 
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-[750px] mx-auto px-6 mb-20">
          <div 
            className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-black prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#C9A227] prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: article.content || "<p>Content coming soon...</p>" }}
          />
        </div>

        {/* Recommended Articles Section */}
        {displayRecent.length > 0 && (
          <div className="max-w-[1280px] mx-auto px-6 pt-12 border-t border-line">
            <h3 className="text-xl font-black text-black uppercase tracking-widest mb-8">More from The Journal</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayRecent.map((item: any) => (
                <Link key={item.id} href={`/blog/${item.slug}`} className="bg-white rounded-2xl border border-line overflow-hidden group hover:shadow-md transition-all flex flex-col">
                  <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[10px] font-black text-[#C9A227] uppercase tracking-wider mb-2">{item.category}</span>
                    <h4 className="font-bold text-[16px] text-black leading-snug line-clamp-2 mb-3 group-hover:text-[#C9A227] transition-colors">{item.title}</h4>
                    <p className="text-[13px] text-gray-500 line-clamp-2 mb-4 flex-1">{item.excerpt}</p>
                    <span className="text-[12px] font-black text-black uppercase tracking-wider">Read Article →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
      <Footer storeName={general.storeName} />
    </>
  );
}
