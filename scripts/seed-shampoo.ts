import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'hair-care' },
    update: {},
    create: {
      name: 'Hair Care',
      slug: 'hair-care',
      description: 'Premium hair coloring and care products'
    }
  });

  const structuredDescription = {
    content: "Our 5-in-1 Hair Color Shampoo is a revolutionary, natural hair dye shampoo designed to color, nourish, condition, repair, and protect your hair and follicles. Enriched with natural extracts of Keratin, Olive Oil, and Vitamin E, it provides 100% grey coverage and rich, vibrant color in just 15 minutes without damaging your hair.",
    ingredients: "Keratin, Olive Oil, Vitamin E, Aloe Vera Extract, Ginger Root Extract, Ginseng Extract, Herbal Colouring Agents.",
    howToUse: "1. Wear the complimentary gloves provided in the box.\n2. Wet your hair and towel-dry it so it remains damp.\n3. Pump out the shampoo and massage thoroughly into your hair, ensuring complete coverage from roots to tips.\n4. Leave it on for 10-15 minutes (do not exceed 20 minutes).\n5. Rinse thoroughly with lukewarm water until the water runs completely clear.",
    benefits: [
      "5-in-1 Action: Colors, conditions, repairs, nourishes, and protects in one wash",
      "Infused with Keratin, Olive Oil & Vitamin E for high shine and strength",
      "Ammonia-Free, Paraben-Free, and Sulfate-Free formula",
      "100% Grey Coverage in only 15 minutes",
      "Safe and suitable for both men and women"
    ],
    showBundleSave: true,
    showComparison: true,
    showHowItWorks: true,
    showFaqs: true,
    tagline: "THE EASIEST WAY TO COVER GRAYS NATURALLY",
    
    compTitle: "WHY IT BEATS SALON & BOX DYE",
    compSubtitle: "Same natural color — far less cost, time & hassle",
    compOurBrand: "THE HAIR FACTORY",
    compCompetitor1: "SALON",
    compCompetitor2: "BOX DYE",
    compRows: [
      { label: "Cost / use", ourValue: "≈Rs.255", comp1Value: "Rs.2,000", comp2Value: "Rs.1,500" },
      { label: "Time", ourValue: "15 min", comp1Value: "60 min", comp2Value: "30-45m" },
      { label: "Effort", ourValue: "Wash & go", comp1Value: "Booking", comp2Value: "Messy" },
      { label: "No ammonia", ourValue: "✓", comp1Value: "X", comp2Value: "X" },
      { label: "Uses / bottle", ourValue: "10–12", comp1Value: "1", comp2Value: "1" }
    ],

    howTitle: "How It Works",
    howSubtitle: "Follow these simple steps to get started",
    howSteps: [
      { title: "Apply to Wet Hair", desc: "Apply the shampoo evenly from roots to tips." },
      { title: "Massage Gently", desc: "Massage the shampoo into your scalp and hair for 2-3 minutes to activate the color formula." },
      { title: "Leave for 15 Minutes", desc: "Allow the shampoo to sit for 15 minutes to let the keratin and color penetrate deeply." },
      { title: "Rinse Thoroughly", desc: "Rinse your hair completely with lukewarm water until the water runs clear." }
    ],

    faqs: [
      { question: "Do I need a patch test?", answer: "Yes — do a 24-hour patch test before first use, as the formula can contain ingredients some people are sensitive to. Apply a little behind the ear and wait 24 hours." },
      { question: "Can I use it on my beard?", answer: "Yes, it is perfectly safe and highly effective to use on beard hair." },
      { question: "Does it work on dyed or chemically-treated hair?", answer: "Yes, it works beautifully on all hair types, including colored, bleached, or keratin-treated hair." },
      { question: "Will it fully cover my greys?", answer: "Absolutely. It ensures 100% grey coverage and gives a completely natural looking shade." },
      { question: "How long does the color last?", answer: "The color typically lasts for up to 3 to 4 weeks, depending on how often you wash your hair." },
      { question: "How many uses are in one bottle?", answer: "A 200ml bottle provides approximately 10 to 12 applications, making it incredibly cost-effective." }
    ]
  };

  const images = [
    "/uploads/shampoo-1.webp",
    "/uploads/shampoo-2.webp",
    "/uploads/shampoo-3.webp"
  ];

  // Options JSON: Shade and Size
  const options = [
    {
      name: "Shade",
      values: ["Black", "Dark Brown", "Light Brown"]
    },
    {
      name: "Size",
      values: ["200ML", "400ML"]
    }
  ];

  // Delete existing if any to avoid duplication
  const existing = await prisma.product.findUnique({ where: { slug: '5in1-hair-color-shampoo-200ml' } });
  if (existing) {
    await prisma.product.delete({ where: { id: existing.id } });
  }

  const product = await prisma.product.create({
    data: {
      name: '5in1 Hair Color Shampoo 200ml',
      slug: '5in1-hair-color-shampoo-200ml',
      description: JSON.stringify(structuredDescription),
      price: 2799,
      comparePrice: 3499,
      stock: 300,
      categoryId: category.id,
      images: JSON.stringify(images),
      status: 'active',
      isFeatured: true,
      hasVariants: true,
      options: JSON.stringify(options),
      seoTitle: '5in1 Hair Color Shampoo 200ml - The Hair Factory',
      seoDescription: 'Premium ammonia-free hair color shampoo with keratin and olive oil. Available in Black, Dark Brown, and Light Brown.'
    }
  });

  // Create variants (6 combinations)
  const variantsData = [
    { shade: "Black", size: "200ML", price: 2799, compare: 3499 },
    { shade: "Dark Brown", size: "200ML", price: 2799, compare: 3499 },
    { shade: "Light Brown", size: "200ML", price: 2799, compare: 3499 },
    { shade: "Black", size: "400ML", price: 3499, compare: 4999 },
    { shade: "Dark Brown", size: "400ML", price: 3499, compare: 4999 },
    { shade: "Light Brown", size: "400ML", price: 3499, compare: 4999 }
  ];

  for (const v of variantsData) {
    await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: `SHAMPOO-${v.shade.toUpperCase().replace(' ', '-')}-${v.size}`,
        price: v.price,
        comparePrice: v.compare,
        stock: 50,
        optionChoices: JSON.stringify({ "Shade": v.shade, "Size": v.size })
      }
    });
  }

  console.log('Seeded Hair Color Shampoo with 6 variants and metadata toggles:', product.name);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
