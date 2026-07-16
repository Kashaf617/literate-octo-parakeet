import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'skin-care' },
    update: {},
    create: {
      name: 'Skin Care',
      slug: 'skin-care',
      description: 'Premium skincare products'
    }
  });

  const structuredDescription = {
    content: "Tritospot Cream is an advanced, ultra-premium dermatological formulation designed to dramatically improve skin clarity, tone, and texture. Enriched with clinically proven active ingredients, it targets hyperpigmentation, dark spots, and uneven skin tone, delivering a radiant, flawless complexion.",
    ingredients: "Hydroquinone (2%), Tretinoin (0.025%), Hydrocortisone Acetate (1%), Eusolex. Infused with soothing botanical extracts to prevent irritation.",
    howToUse: "Cleanse skin thoroughly before application. Apply a thin layer strictly to the affected areas once daily at night. Follow up with a high SPF sunscreen during the day to protect the skin from UV exposure.",
    benefits: [
      "Visibly reduces dark spots and hyperpigmentation",
      "Accelerates cellular turnover for a youthful glow",
      "Soothes and protects with anti-inflammatory properties",
      "Dermatologically tested for optimal safety and efficacy"
    ]
  };

  const images = [
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1615397323315-18247071e72e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop"
  ];

  const product = await prisma.product.upsert({
    where: { slug: 'tritospot-cream' },
    update: {},
    create: {
      name: 'Tritospot Cream',
      slug: 'tritospot-cream',
      description: JSON.stringify(structuredDescription),
      price: 2500,
      comparePrice: 3200,
      stock: 50,
      categoryId: category.id,
      images: JSON.stringify(images),
      status: 'active',
      isFeatured: true,
      hasVariants: false,
      seoTitle: 'Tritospot Cream - Advanced Skin Lightening',
      seoDescription: 'Ultra premium dark spot corrector and skin lightening cream.'
    }
  });

  console.log('Seeded Tritospot Cream:', product.name);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
