import { PrismaClient } from "@prisma/client";
import ProductGrid from "@/components/storefront/ProductGrid";
import SearchFilters from "@/components/storefront/SearchFilters";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import Image from "next/image";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";

const prisma = new PrismaClient();

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; category?: string; minPrice?: string; maxPrice?: string; sort?: string } }) {
  const query = searchParams.q || "";
  const category = searchParams.category || "";
  const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;
  const sort = searchParams.sort || "featured";

  // Build the Prisma where clause dynamically based on filters
  const where: any = { status: "active" };
  
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } }
    ];
  }
  
  if (category) {
    where.category = { slug: category };
  }
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Determine sort order
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { price: "asc" };
  if (sort === "price_desc") orderBy = { price: "desc" };
  if (sort === "newest") orderBy = { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    take: 50,
    include: {
      category: true,
      collections: { include: { collection: true } }
    }
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" }
  });

  const general = await getSetting("general", DEFAULT_SETTINGS.general);

  return (
    <>
      <Header
        storeName={general.storeName}
        tagline={general.tagline}
        supportPhone={general.supportPhone}
        freeShippingText={general.freeShippingText}
      />
      <main className="min-h-screen bg-[#f8f9fa]">
      <div className="relative py-24 text-center overflow-hidden bg-black border-b border-gray-900">
        {/* Background Image with overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="/uploads/banner_mens_health.png" 
            alt="All Products" 
            fill 
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="relative z-10 max-w-[800px] mx-auto px-6">
          <span className="inline-block text-[#ff5a1f] text-[12px] font-black uppercase tracking-[0.3em] mb-4">
            Explore Catalog
          </span>
          <h1 className="text-white text-[36px] md:text-[48px] font-black uppercase tracking-tight mb-3">
            {query ? `Search: "${query}"` : "All Premium Products"}
          </h1>
          <p className="text-white/60 font-bold tracking-wide uppercase text-[11px]">
            Found {products.length} products
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-2 md:px-6 py-12 flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <SearchFilters categories={categories} />

        {/* Product Grid */}
        <div className="flex-1">
          {products.length > 0 ? (
            <ProductGrid title="" products={products as any} />
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-line shadow-sm">
              <h2 className="text-2xl font-bold text-ink mb-2">No products found</h2>
              <p className="text-sub text-[14px]">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>

      </div>
    </main>
    <Footer storeName={general.storeName} />
    </>
  );
}
