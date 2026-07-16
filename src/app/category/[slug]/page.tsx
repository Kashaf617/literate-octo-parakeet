import { prisma } from "@/lib/prisma";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ProductGrid from "@/components/storefront/ProductGrid";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cat = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!cat) return {};
  return { title: cat.name, description: cat.description || undefined };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const general = await getSetting("general", DEFAULT_SETTINGS.general);
  const cat = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!cat) return notFound();
  const products = await prisma.product.findMany({ where: { categoryId: cat.id, status: "active" }, orderBy: { createdAt: "desc" } });

  return (
    <>
      <Header storeName={general.storeName} tagline={general.tagline} supportPhone={general.supportPhone} freeShippingText={general.freeShippingText} />
      <main className="min-h-screen bg-[#f8f9fa]">
        <div className="relative py-24 text-center overflow-hidden bg-black border-b border-gray-900">
          {/* Background Image with overlay */}
          {cat.image && (
            <div className="absolute inset-0 z-0 opacity-40">
              <Image 
                src={cat.image} 
                alt={cat.name} 
                fill 
                className="object-cover object-center"
                priority
              />
            </div>
          )}
          <div className="relative z-10 max-w-[800px] mx-auto px-6">
            <span className="inline-block text-[#ff5a1f] text-[12px] font-black uppercase tracking-[0.3em] mb-4">
              Category
            </span>
            <h1 className="text-white text-[36px] md:text-[48px] font-black uppercase tracking-tight mb-3">
              {cat.name}
            </h1>
            <p className="text-white/60 font-bold tracking-wide uppercase text-[11px]">
              Found {products.length} products
            </p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-1 md:px-6 py-12">
          <ProductGrid title="" products={products as any} />
        </div>
      </main>
      <Footer storeName={general.storeName} />
    </>
  );
}
