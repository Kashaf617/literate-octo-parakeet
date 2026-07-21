import { prisma } from "@/lib/prisma";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import { MOCK_ARTICLES } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const revalidate = 0;

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

  return (
    <>
      <Header
        storeName={general.storeName}
        tagline={general.tagline}
        supportPhone={general.supportPhone}
        freeShippingText={general.freeShippingText}
      />
      <main className="bg-bg min-h-screen pb-20">
        
        {/* Article Header */}
        <div className="max-w-[800px] mx-auto px-6 pt-16 pb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sub hover:text-brand transition-colors text-[13px] font-bold uppercase tracking-wider mb-8">
            <ChevronLeft className="w-4 h-4" /> Back to Store
          </Link>
          
          <span className="block text-brand text-[12px] font-black uppercase tracking-[0.2em] mb-4">
            {article.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-ink leading-[1.1] tracking-tight mb-6">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sub text-[13.5px] font-medium border-t border-line pt-6 mt-6">
            <span>Published on {article.date || article.createdAt?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>

        {/* Article Featured Image */}
        <div className="max-w-[1000px] mx-auto px-6 mb-16">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-[#f0f0f0]">
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
        <div className="max-w-[700px] mx-auto px-6">
          <div 
            className="prose prose-lg max-w-none prose-headings:font-extrabold prose-headings:text-ink prose-p:text-sub prose-p:leading-relaxed prose-a:text-brand prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: article.content || "<p>Content coming soon...</p>" }}
          />
        </div>

      </main>
      <Footer storeName={general.storeName} />
    </>
  );
}
