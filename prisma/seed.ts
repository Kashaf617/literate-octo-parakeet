import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables before seeding.");
  }
  const passwordHash = await bcrypt.hash(password, 10);

  // Clear existing database tables to avoid FK constraint issues or orphaned data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productCollection.deleteMany();
  await prisma.celebrityRecommendation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.article.deleteMany();
  await prisma.setting.deleteMany();

  // Create Admin
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { name: "Store Owner", email, passwordHash, role: "owner" }
  });

  // Watch Categories
  const categories = [
    { name: "Luxury Watches", slug: "luxury-watches", image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=400&q=80" },
    { name: "Classic Watches", slug: "classic-watches", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80" },
    { name: "Smart Watches", slug: "smart-watches", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80" },
    { name: "Chronographs", slug: "chronographs", image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=400&q=80" },
    { name: "Sports Watches", slug: "sports-watches", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=400&q=80" },
    { name: "Minimalist Watches", slug: "minimalist-watches", image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=400&q=80" },
    { name: "Business Watches", slug: "business-watches", image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=400&q=80" },
    { name: "Limited Edition", slug: "limited-edition", image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=400&q=80" }
  ];

  for (const [i, c] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { image: c.image },
      create: { ...c, sortOrder: i }
    });
  }

  // Marketing Collections
  const collections = [
    { name: "Trending Watches", slug: "best-offers", color: "#C9A227" },
    { name: "Exclusive Watch Collection", slug: "beauty-essentials-sale", color: "#000000" },
    { name: "New Timepieces", slug: "new-goods", color: "#A8831B" },
    { name: "Best Selling Watches", slug: "premium-collection", color: "#111111" }
  ];

  for (const [i, c] of collections.entries()) {
    await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, sortOrder: i }
    });
  }

  const luxury = await prisma.category.findUnique({ where: { slug: "luxury-watches" } });
  const classic = await prisma.category.findUnique({ where: { slug: "classic-watches" } });
  const smart = await prisma.category.findUnique({ where: { slug: "smart-watches" } });
  const chrono = await prisma.category.findUnique({ where: { slug: "chronographs" } });
  const sports = await prisma.category.findUnique({ where: { slug: "sports-watches" } });
  const minimal = await prisma.category.findUnique({ where: { slug: "minimalist-watches" } });

  const bestOffers = await prisma.collection.findUnique({ where: { slug: "best-offers" } });
  const beautySale = await prisma.collection.findUnique({ where: { slug: "beauty-essentials-sale" } });
  const newGoods = await prisma.collection.findUnique({ where: { slug: "new-goods" } });
  const premiumCol = await prisma.collection.findUnique({ where: { slug: "premium-collection" } });

  // Seeding Luxury Watch Products
  const watchProducts = [
    {
      name: "Aura Chronograph",
      price: 145000,
      comparePrice: 175000,
      cat: chrono,
      col: bestOffers,
      tagline: "DESIGNED FOR EVERY MOMENT",
      images: [
        "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80"
      ],
      desc: "An elegant, premium chronograph watch featuring a surgical-grade stainless steel casing and Swiss caliber movement. Features sub-dials for precision timing and a scratch-resistant sapphire crystal dome."
    },
    {
      name: "Devine Classic Gold",
      price: 220000,
      comparePrice: 260000,
      cat: luxury,
      col: beautySale,
      tagline: "TIMELESS ELEGANCE IN GOLD",
      images: [
        "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=80"
      ],
      desc: "A timeless masterpiece featuring an 18K yellow gold plated case and a minimalist dial. Powered by a self-winding automatic movement visible through the open exhibition back."
    },
    {
      name: "Ora Smart Hybrid",
      price: 85000,
      comparePrice: null,
      cat: smart,
      col: newGoods,
      tagline: "INTELLIGENT PRESENCE",
      images: [
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=800&q=80"
      ],
      desc: "A perfect marriage of traditional watchmaking aesthetics and modern smart notifications. Features steps tracking, heart rate monitoring, and a 14-day battery life."
    },
    {
      name: "Vanguard Titanium Sport",
      price: 125000,
      comparePrice: 145000,
      cat: sports,
      col: premiumCol,
      tagline: "BUILT FOR THE EXTRAORDINARY",
      images: [
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517462964-21fdcec3f25b?auto=format&fit=crop&w=800&q=80"
      ],
      desc: "Built with a lightweight Grade 5 Titanium case, luminescent markers, and 100m water resistance. Ideal for sports enthusiasts who refuse to sacrifice elegance."
    }
  ];

  for (const [i, p] of watchProducts.entries()) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const structuredDesc = {
      content: p.desc,
      ingredients: "Surgical-Grade 316L Stainless Steel / Titanium, Sapphire Crystal Glass, Premium Italian Calf Leather",
      howToUse: "Store in a watch box. Avoid exposing to high magnetic fields. Service automatic movements once every 3-5 years.",
      benefits: ["Scratch-Resistant Sapphire Glass", "Handcrafted in Geneva", "316L Surgical Stainless Steel", "5-Year International Warranty"],
      showBundleSave: true,
      showComparison: true,
      showHowItWorks: true,
      showFaqs: true,
      tagline: p.tagline,
      compTitle: "DEVINE ORA VS OTHER WATCHES",
      compSubtitle: "Swiss-standard craftsmanship without the traditional 10x retail markup",
      compOurBrand: "DEVINE ORA",
      compCompetitor1: "RETAIL BRANDS",
      compCompetitor2: "CHEAP KNOCKOFFS",
      compRows: [
        { label: "Sapphire Crystal Dome", ourValue: "✓", comp1Value: "X (Mineral)", comp2Value: "X (Plastic)" },
        { label: "Surgical Steel Case", ourValue: "✓", comp1Value: "✓", comp2Value: "X (Alloy)" },
        { label: "Automatic Swiss / Japanese Movement", ourValue: "✓", comp1Value: "X (Quartz)", comp2Value: "X (Quartz)" },
        { label: "Direct-to-Consumer Pricing", ourValue: "✓", comp1Value: "X", comp2Value: "✓" }
      ],
      howTitle: "The Watchmaking Process",
      howSubtitle: "How your DEVINE ORA timepiece is meticulously brought to life",
      howSteps: [
        { title: "Precision CNC Milling", desc: "Surgical grade steel blocks are sculpted using microscopic robotic tolerances." },
        { title: "Hand Polishing & Assembly", desc: "Master watchmakers bevel, satin-finish, and assemble the caliber parts by hand." },
        { title: "Testing & Regulation", desc: "Every watch undergoes a rigorous 48-hour pressure, movement, and accuracy regulation checklist." }
      ],
      faqs: [
        { question: "Is the watch water-resistant?", answer: "Yes, all DEVINE ORA watches are water-resistant up to 50 meters (5 ATM) or 100 meters (10 ATM) for sport models." },
        { question: "What is the power reserve of the automatic movement?", answer: "The caliber provides a reliable 42-hour power reserve when fully wound." }
      ]
    };

    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        images: JSON.stringify(p.images)
      },
      create: {
        name: p.name,
        slug,
        description: JSON.stringify(structuredDesc),
        price: p.price,
        comparePrice: p.comparePrice ?? undefined,
        stock: 45 + i * 5,
        images: JSON.stringify(p.images),
        categoryId: p.cat?.id,
        isFeatured: i < 2
      }
    });

    if (p.col) {
      await prisma.productCollection.upsert({
        where: { productId_collectionId: { productId: product.id, collectionId: p.col.id } },
        update: {},
        create: { productId: product.id, collectionId: p.col.id }
      });
    }
  }

  // Seeding Banners
  const banners = [
    {
      title: "Timeless Elegance",
      eyebrow: "DEVINE ORA",
      subtitle: "Designed for every moment. Explore our masterpiece collection.",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1600&q=80",
      position: "hero",
      bgColorFrom: "#000000",
      bgColorTo: "#1c1917",
      textColor: "#ffffff",
      buttonText: "Explore Collection",
      sortOrder: 0
    },
    {
      title: "Designed for Every Moment",
      eyebrow: "CHRONOGRAPH",
      subtitle: "A blend of traditional Swiss heritage and modern precision engineering.",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
      position: "hero",
      bgColorFrom: "#111111",
      bgColorTo: "#292524",
      textColor: "#ffffff",
      buttonText: "Discover Luxury",
      sortOrder: 1
    },
    {
      title: "Premium Craftsmanship",
      eyebrow: "OUR HERITAGE",
      subtitle: "DEVINE ORA watches are assembled by master horologists with hand-polished steel and sapphire glass.",
      image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=1600&q=80",
      position: "promo",
      bgColorFrom: "transparent",
      bgColorTo: "#000000",
      textColor: "#ffffff",
      buttonText: "Discover Craftsmanship",
      sortOrder: 0
    },
    {
      title: "Limited Edition Collection",
      eyebrow: "LIMITED QUANTITIES",
      subtitle: "Discover the rare, high-end watches from our limited release collection.",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1600&q=80",
      position: "strip",
      bgColorFrom: "#000000",
      textColor: "#ffffff",
      buttonText: "View Collection",
      sortOrder: 0
    }
  ];

  for (const b of banners) {
    const exists = await prisma.banner.findFirst({ where: { title: b.title } });
    if (!exists) {
      await prisma.banner.create({ data: b });
    } else {
      await prisma.banner.update({ where: { id: exists.id }, data: { image: b.image } });
    }
  }

  // Settings configurations
  const settings: Record<string, any> = {
    general: {
      storeName: "DEVINE ORA",
      tagline: "Luxury Crafted to Perfection",
      supportPhone: "+92 300 1234567",
      currency: "PKR",
      freeShippingText: "Free Delivery Nationwide",
      company_whatsapp: "+923001234567"
    },
    seo: {
      metaTitle: "DEVINE ORA — Luxury Watch Timepieces",
      metaDescription: "Explore elegant, premium, and modern luxury watches from DEVINE ORA. Timeless design crafted to perfection.",
      ogImage: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80",
      robotsIndex: true,
      sitemapEnabled: true
    },
    pixels: { ga4Id: "", metaPixelId: "", tiktokPixelId: "", snapPixelId: "", gtmId: "" },
    payments: {
      codEnabled: true,
      jazzcash: { enabled: false, merchantId: "", password: "", integritySalt: "", mode: "sandbox", displayNumber: "", displayName: "" },
      easypaisa: { enabled: false, storeId: "", accountNum: "", hashKey: "", mode: "sandbox", displayNumber: "", displayName: "" },
      payfast: { enabled: false, merchantId: "", secureKey: "", mode: "sandbox" },
      bankTransfer: { enabled: false, accountTitle: "", accountNumber: "", bankName: "", iban: "", displayInstructions: "" }
    },
    logistics: {
      defaultCourier: "leopards",
      leopards: { enabled: true, apiKey: "", apiPassword: "" },
      tcs: { enabled: false, apiKey: "", costCenter: "" },
      postex: { enabled: false, apiKey: "" },
      mnp: { enabled: false, apiKey: "" }
    }
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) }
    });
  }

  console.log("Seed complete. Luxury watch database initialized successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
