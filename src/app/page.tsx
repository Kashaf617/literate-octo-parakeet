import { prisma, withTimeout } from "@/lib/prisma";
import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import { MOCK_ARTICLES } from "@/lib/mock-data";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import HeroBanners from "@/components/storefront/HeroBanners";
import CategoryGrid from "@/components/storefront/CategoryGrid";
import ProductGrid from "@/components/storefront/ProductGrid";
import PromoBanner from "@/components/storefront/PromoBanner";
import PremiumCollection from "@/components/storefront/PremiumCollection";
import RecentlyViewed from "@/components/storefront/RecentlyViewed";
import Articles from "@/components/storefront/Articles";
import TrustBadges from "@/components/storefront/TrustBadges";

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: { editMode?: string } }) {
  const isEditMode = searchParams.editMode === "true";

  // All DB calls in parallel with timeouts — page always renders
  const [general, banners, categories, allProducts, rawSettings, articles] = await Promise.all([
    getSetting("general", DEFAULT_SETTINGS.general),
    withTimeout(prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        collection: {
          include: {
            products: {
              include: {
                product: {
                  include: { category: true }
                }
              }
            }
          }
        }
      }
    }), []),
    withTimeout(prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } }), []),
    withTimeout(prisma.product.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      include: { category: true, collections: { include: { collection: true } } }
    }), []),
    withTimeout(prisma.setting.findMany({ where: { key: { in: ['heading_best_offers', 'heading_new_goods', 'heading_categories', 'heading_home_appliance', 'marquee_text', 'marquee_speed'] } } }), []),
    withTimeout(prisma.article.findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 3 }), []),
  ]);


  const settingsMap = rawSettings.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {} as Record<string, string>);

  // Group products by collection
  const bestOffers = allProducts.filter(p =>
    p.collections.some(c => c.collection.slug === "best-offers")
  );
  const newGoods = allProducts.filter(p =>
    p.collections.some(c => c.collection.slug === "new-goods")
  );
  const displayBestOffers = bestOffers.length > 0 ? bestOffers : allProducts.slice(0, 5);
  const displayRecentlyViewed = allProducts.slice(0, 8);

  const heroBanners = banners.filter(b => b.position === "hero");
  const promoBanners = banners.filter(b => b.position === "promo");
  const stripBanners = banners.filter(b => b.position === "strip");

  return (
    <>
      <Header
        storeName={general.storeName}
        tagline={general.tagline}
        supportPhone={general.supportPhone}
        freeShippingText={general.freeShippingText}
        marqueeText={settingsMap['marquee_text'] || "FOLLOW US AND GET A CHANCE TO WIN 80% OFF"}
        marqueeSpeed={Number(settingsMap['marquee_speed']) || 20}
      />
      <main className="bg-[#f8f9fa]">
        {heroBanners.length > 0 ? (
          <HeroBanners banners={heroBanners as any} isEditMode={isEditMode} />
        ) : (
          <HeroBanners isEditMode={isEditMode} banners={[
            { id: 'demo-hero-1', title: 'Upload Hero Image', subtitle: 'Click to upload your main hero image', eyebrow: 'Welcome', image: '', position: 'hero', buttonText: 'Shop Now', link: '#' },
            { id: 'demo-hero-2', title: 'Secondary Banner', subtitle: 'Upload a secondary image', eyebrow: 'Featured', image: '', position: 'hero', buttonText: 'View More', link: '#' }
          ] as any} />
        )}
        <CategoryGrid categories={categories as any} title={settingsMap['heading_categories']} isEditMode={isEditMode} />
        <ProductGrid title={settingsMap['heading_best_offers'] || "The Best Offers"} settingKey="heading_best_offers" isEditMode={isEditMode} products={displayBestOffers as any} viewAllHref="/search" accentColor="#C9A227" />
        
        {newGoods.length > 0 && (
          <ProductGrid title={settingsMap['heading_new_goods'] || "New Goods"} settingKey="heading_new_goods" isEditMode={isEditMode} products={newGoods as any} viewAllHref="/search" accentColor="#C9A227" />
        )}
        
        {promoBanners.length > 0 ? promoBanners.map((banner, i) => {
          const bannerProducts = (banner as any).collection ? (banner as any).collection.products.map((p: any) => p.product) : [];
          return <PromoBanner key={banner.id} banner={banner as any} products={bannerProducts as any} isEditMode={isEditMode} />;
        }) : (
          <PromoBanner isEditMode={isEditMode} banner={{
            id: 'demo-promo',
            title: "Premium Handcrafted Horology",
            subtitle: "DEVINE ORA watches are assembled by master watchmakers with hand-polished steel and sapphire glass.",
            eyebrow: "OUR CRAFTSMANSHIP",
            buttonText: "Discover Craftsmanship",
            image: "/api/media/cmrqdsz1x00004h8jqm2xrqyd",
            bgColorFrom: "transparent",
            bgColorTo: "#000000",
            textColor: "#ffffff"
          } as any} products={allProducts.slice(0, 4) as any} />
        )}
        
        {stripBanners.length > 0 ? stripBanners.map((banner, i) => {
          const bannerProducts = (banner as any).collection ? (banner as any).collection.products.map((p: any) => p.product) : [];
          return <PremiumCollection key={banner.id} banner={banner as any} products={bannerProducts as any} isEditMode={isEditMode} />;
        }) : (
          <PremiumCollection isEditMode={isEditMode} banner={{
            id: 'demo-strip',
            title: "Limited Edition Collection",
            subtitle: "Discover the rare, high-end watches from our limited release collection.",
            eyebrow: "LIMITED QUANTITIES",
            buttonText: "View Collection",
            image: "/api/media/cmrqdf5jl0000xyxqspu3hnil",
            bgColorFrom: "#000000",
            textColor: "#ffffff",
            link: "/search"
          } as any} products={allProducts.filter(p => p.collections.some(c => c.collection.slug === "premium-collection")).length > 0 ? allProducts.filter(p => p.collections.some(c => c.collection.slug === "premium-collection")) as any : allProducts.slice(0, 4) as any} />
        )}
        
        <RecentlyViewed products={displayRecentlyViewed as any} />
        <Articles articles={articles.length > 0 ? articles.map(a => ({ ...a, date: a.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) })) as any : []} />
        <TrustBadges />
      </main>
      <Footer storeName={general.storeName} />
    </>
  );
}
