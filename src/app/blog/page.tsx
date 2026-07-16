import { prisma } from "@/lib/prisma";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import { MOCK_ARTICLES } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 0;

export default async function BlogPage() {
  const general = await getSetting("general", DEFAULT_SETTINGS.general);
  const articles = await prisma.article.findMany({ 
    where: { published: true }, 
    orderBy: { createdAt: "desc" }
  });

  const displayArticles = articles.length > 0 ? articles : MOCK_ARTICLES;

  return (
    <>
      <Header
        storeName={general.storeName}
        tagline={general.tagline}
        supportPhone={general.supportPhone}
        freeShippingText={general.freeShippingText}
      />
      <main className="bg-bg min-h-[70vh] py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-4">The Journal</h1>
            <p className="text-sub text-lg max-w-2xl mx-auto">
              Read the latest news, product announcements, and lifestyle tips from {general.storeName}.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayArticles.map((article: any, i: number) => (
              <div key={article.id} className="bg-white rounded-xl border border-line overflow-hidden group hover:shadow-lg2 transition-shadow flex flex-col h-full">
                <Link href={`/blog/${article.slug}`} className="relative aspect-[3/2] overflow-hidden bg-[#f4f6fa] block">
                  <Image 
                    src={article.image} 
                    alt={article.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[11px] font-bold text-brand uppercase tracking-wider mb-2">
                    {article.category}
                  </span>
                  <Link href={`/blog/${article.slug}`} className="block">
                    <h3 className="text-[16px] md:text-[18px] font-bold text-ink leading-snug line-clamp-2 mb-3 group-hover:text-brand transition-colors">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-[13.5px] text-sub leading-relaxed line-clamp-3 mb-6 flex-1">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-line">
                    <span className="text-[12px] text-sub font-medium">{article.date || article.createdAt?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <Link href={`/blog/${article.slug}`} className="text-[13px] font-bold text-brand hover:underline">Read More →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer storeName={general.storeName} />
    </>
  );
}
