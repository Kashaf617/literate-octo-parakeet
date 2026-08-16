import { prisma } from "@/lib/prisma";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ProductReviews from "@/components/storefront/ProductReviews";
import VariantSelector from "@/components/storefront/VariantSelector";
import Image from "next/image";
import { notFound } from "next/navigation";
import { fmtCurrency } from "@/lib/utils";
import { getCustomerSession } from "@/lib/auth";
import { Star, ChevronDown, Plus, Minus } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!p) return {};
  return {
    title: p.seoTitle || p.name,
    description: p.seoDescription || p.description?.slice(0, 155)
  };
}

// Client component for the Accordion
import ProductAccordion from "@/components/storefront/ProductAccordion";
import CelebrityCarousel from "@/components/storefront/CelebrityCarousel";
import ProductGallery from "@/components/storefront/ProductGallery";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const general = await getSetting("general", DEFAULT_SETTINGS.general);
  const p = await prisma.product.findUnique({ 
    where: { slug: params.slug }, 
    include: { 
      category: true,
      variants: true,
      reviews: {
        where: { status: "published" },
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" }
      }
    } 
  });
  if (!p) return notFound();
  
  const images: string[] = JSON.parse(p.images || "[]");
  const session = await getCustomerSession();

  const celebrities = await prisma.celebrityRecommendation.findMany({
    where: {
      isActive: true,
      OR: [
        { productId: p.id },
        { productId: null }
      ]
    },
    orderBy: { sortOrder: 'asc' }
  });

  // Generate consistent pseudo-random reviews based on the product ID/name
  const hasDbReviews = p.reviews.length > 0;
  
  const mockReviews = (() => {
    if (hasDbReviews) return p.reviews;
    // Generate 3-6 mock reviews based on product name
    const reviewTexts = [
      "Absolutely loved this! Fast shipping across Pakistan and discreet packaging.",
      "100% original product. Have been using it for a week now, results are amazing.",
      "Best purchase ever! Highly recommended to everyone. Sourced directly from manufacturers.",
      "Delivery was extremely fast, reached Lahore in just 24 hours. Excellent support.",
      "Top-notch quality. Will definitely buy again from DEVINE ORA.",
      "Superb customer service and genuine product. Very happy with my purchase!"
    ];
    const reviewers = [
      "Hassan A.", "Ayesha M.", "Zainab K.", "Mohammad S.", "Fatima R.", "Bilal T."
    ];
    
    let hash = 0;
    const str = p.name || "";
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const count = Math.abs(hash % 4) + 3; // 3 to 6 reviews
    const generated = [];
    
    for (let i = 0; i < count; i++) {
      const idx = Math.abs((hash + i) % reviewTexts.length);
      const revIdx = Math.abs((hash * (i + 1)) % reviewers.length);
      const rating = Math.abs((hash - i) % 2) === 0 ? 5 : 4;
      
      const date = new Date(1735689600000 - (i + 1) * 3 * 24 * 60 * 60 * 1000); // 3-18 days ago from fixed base date
      
      generated.push({
        id: `mock-review-${i}`,
        rating,
        title: rating === 5 ? "Excellent Product!" : "Very Satisfied",
        comment: reviewTexts[idx],
        createdAt: date,
        customer: { name: reviewers[revIdx] }
      });
    }
    return generated;
  })();

  const avgRating = hasDbReviews 
    ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length 
    : mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length;

  const totalReviewsCount = hasDbReviews ? p.reviews.length : mockReviews.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: images,
    offers: { "@type": "Offer", priceCurrency: general.currency, price: p.price, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" }
  };

  // Try to parse structured description
  let parsedDesc: any = null;
  try {
    parsedDesc = JSON.parse(p.description);
  } catch {
    parsedDesc = { content: p.description };
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen text-black font-sans overflow-x-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header storeName={general.storeName} tagline={general.tagline} supportPhone={general.supportPhone} freeShippingText={general.freeShippingText} />
      
      <main className="max-w-[1440px] mx-auto px-4 lg:px-12 py-12 lg:py-24 grid lg:grid-cols-2 gap-8 lg:gap-24 items-start">
        
        {/* Left: Immersive Image Gallery */}
        <div className="w-full">
          <ProductGallery images={images} productName={p.name} />
        </div>

        {/* Right: Product Details & Actions */}
        <div className="flex flex-col pt-8 lg:pt-0">
          {p.category && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a1a1aa] mb-4">
              {p.category.name}
            </span>
          )}
          
          <h1 className="text-4xl lg:text-5xl font-black text-black tracking-tight mb-2 leading-tight uppercase">
            {p.name}
          </h1>
          {parsedDesc?.tagline && (
            <p className="text-[11px] font-bold tracking-widest text-[#3b2e2a] uppercase mb-6">
              {parsedDesc.tagline}
            </p>
          )}
          
          <div className="flex items-center gap-4 mb-10 pb-10 border-b border-black">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-4 h-4 ${avgRating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
              ))}
            </div>
            <a href="#reviews" className="text-[12px] font-semibold text-black hover:text-[#e95144] transition-colors underline underline-offset-4">
              {avgRating.toFixed(1)} ({totalReviewsCount} Reviews)
            </a>
          </div>

          <div className="mb-10 text-[15px] font-light leading-relaxed text-[#52525b]" dangerouslySetInnerHTML={{ __html: parsedDesc?.content || p.description }} />
          
          <div className="mb-12">
            <VariantSelector product={p as any} general={general} />
            
            {/* Trust Indicators */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black pt-8 text-center">
              <div className="flex flex-col items-center">
                <span className="text-xl mb-1">🚚</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-black text-center leading-tight">Free Shipping<br/>Above Rs.10k</span>
                <span className="text-[8px] text-[#6b6b6b] uppercase tracking-wider mt-0.5 text-center leading-tight">Rs.270 below<br/>10,000 orders</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl mb-1">💵</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-black">Cash On Delivery</span>
                <span className="text-[8px] text-[#6b6b6b] uppercase tracking-wider mt-0.5">Pay at doorstep</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl mb-1">🛡️</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-black">100% Secure</span>
                <span className="text-[8px] text-[#6b6b6b] uppercase tracking-wider mt-0.5">SSL Encrypted</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-black pt-8">
            <ProductAccordion title="Details & Specifications">
              <div className="text-[13px] font-light leading-relaxed text-[#52525b]" dangerouslySetInnerHTML={{ __html: parsedDesc?.content || p.description }} />
            </ProductAccordion>

            {parsedDesc?.howToUse && (
              <ProductAccordion title="How To Use">
                <p className="text-[13px] font-light leading-relaxed text-[#52525b]">
                  {parsedDesc.howToUse}
                </p>
              </ProductAccordion>
            )}

            {parsedDesc?.ingredients && (
              <ProductAccordion title="Ingredients">
                <p className="text-[13px] font-light leading-relaxed text-[#52525b]">
                  {parsedDesc.ingredients}
                </p>
              </ProductAccordion>
            )}
            
            {parsedDesc?.benefits && Array.isArray(parsedDesc.benefits) && (
              <ProductAccordion title="Key Benefits">
                <ul className="list-disc pl-5 space-y-2 text-[13px] font-light leading-relaxed text-[#52525b]">
                  {parsedDesc.benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
                </ul>
              </ProductAccordion>
            )}

            <ProductAccordion title="Shipping & Returns">
              <p className="text-[13px] font-light leading-relaxed text-[#52525b]">
                Complimentary standard shipping on all orders above PKR 2,500. Next-day delivery available in select cities. Enjoy a hassle-free 3-day return policy for unopened items.
              </p>
            </ProductAccordion>
          </div>
        </div>
      </main>
      
      {/* WHY IT BEATS SALON & BOX DYE Section */}
      {parsedDesc?.showComparison && parsedDesc?.compRows?.length > 0 && (
        <section className="bg-black text-white py-16 px-6 lg:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-2xl lg:text-3xl font-black mb-2 uppercase tracking-wide">
              {parsedDesc.compTitle || "WHY IT BEATS SALON & BOX DYE"}
            </h2>
            <p className="text-xs lg:text-sm text-gray-400 mb-10 font-medium">
              {parsedDesc.compSubtitle || "Same natural color — far less cost, time & hassle"}
            </p>
            
            <div className="overflow-x-auto border border-white/20 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs lg:text-sm">
                <thead>
                  <tr className="border-b border-white/20 bg-white/5">
                    <th className="p-4 font-bold"></th>
                    <th className="p-4 font-bold text-center bg-[#ff7a00]/10 text-[#ff7a00] border-l border-r border-white/20">
                      {parsedDesc.compOurBrand || "OUR BRAND"}
                    </th>
                    <th className="p-4 font-bold text-center text-gray-400">
                      {parsedDesc.compCompetitor1 || "COMPETITOR 1"}
                    </th>
                    <th className="p-4 font-bold text-center text-gray-400">
                      {parsedDesc.compCompetitor2 || "COMPETITOR 2"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parsedDesc.compRows.map((row: any, i: number) => (
                    <tr key={i} className={i === parsedDesc.compRows.length - 1 ? "last:border-0" : "border-b border-white/10"}>
                      <td className="p-4 font-medium text-gray-300">{row.label}</td>
                      <td className="p-4 text-center font-bold text-white bg-[#ff7a00]/10 border-l border-r border-white/20">
                        {row.ourValue === "✓" ? <span className="text-[#4caf50]">✓</span> : row.ourValue === "X" ? <span className="text-[#f44336]">X</span> : row.ourValue}
                      </td>
                      <td className="p-4 text-center text-gray-400">
                        {row.comp1Value === "✓" ? <span className="text-[#4caf50]">✓</span> : row.comp1Value === "X" ? <span className="text-[#f44336]">X</span> : row.comp1Value}
                      </td>
                      <td className="p-4 text-center text-gray-400">
                        {row.comp2Value === "✓" ? <span className="text-[#4caf50]">✓</span> : row.comp2Value === "X" ? <span className="text-[#f44336]">X</span> : row.comp2Value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      {parsedDesc?.showHowItWorks && parsedDesc?.howSteps?.length > 0 && (
        <section className="bg-[#b37424] text-white py-16 px-6 lg:px-12">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-3xl font-black mb-2 uppercase tracking-wide">
              {parsedDesc.howTitle || "How It Works"}
            </h2>
            <p className="text-xs lg:text-sm text-white/80 mb-10 font-medium">
              {parsedDesc.howSubtitle || "Follow these simple steps to get started"}
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 text-left">
              {parsedDesc.howSteps.map((step: any, i: number) => (
                <div key={i} className="bg-white text-black p-6 rounded-2xl shadow-sm border border-black/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#b37424] block mb-2">Step 0{i+1}</span>
                  <h4 className="text-sm font-bold mb-2">{step.title}</h4>
                  <p className="text-xs text-gray-600 font-light font-sans">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Frequently Asked Questions Section */}
      {parsedDesc?.showFaqs && parsedDesc?.faqs?.length > 0 && (
        <section className="bg-[#f8f9fa] text-black py-20 px-6 lg:px-12 border-t border-gray-200">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-wider mb-2">
                FREQUENTLY ASKED QUESTIONS
              </h2>
              <div className="w-12 h-[1px] bg-black mx-auto mt-4"></div>
            </div>

            <div className="space-y-2">
              {parsedDesc.faqs.map((faq: any, i: number) => (
                <ProductAccordion key={i} title={faq.question}>
                  <p className="text-xs lg:text-sm text-gray-700 leading-relaxed font-light font-sans">
                    {faq.answer}
                  </p>
                </ProductAccordion>
              ))}
            </div>
          </div>
        </section>
      )}

      {celebrities.length > 0 && (
        <div className="bg-[#f8f9fa] py-8 border-t border-gray-200">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <CelebrityCarousel celebrities={celebrities} />
          </div>
        </div>
      )}

      <div id="reviews" className="bg-[#f8f9fa] py-24 border-t border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12">
          <ProductReviews productId={p.id} reviews={mockReviews as any} customerSession={session} />
        </div>
      </div>

      <Footer storeName={general.storeName} />
    </div>
  );
}
