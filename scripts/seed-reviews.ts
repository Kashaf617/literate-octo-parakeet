import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const firstNames = [
  "Muhammad", "Ali", "Hamza", "Usman", "Bilal", "Asad", "Saad", "Umair", "Farhan",
  "Zain", "Ahsan", "Haris", "Abdul", "Tariq", "Javed", "Imran", "Zahid", "Waseem",
  "Faisal", "Kamran", "Ayesha", "Fatima", "Zainab", "Sana", "Sidra", "Nida", "Kiran",
  "Hina", "Mehwish", "Sajal", "Iqra", "Minal", "Aiman", "Urwa", "Mawra", "Yumna",
  "Hania", "Zara", "Kubra", "Saba", "Anum", "Komal", "Maria", "Noreen", "Sobia"
];

const lastNames = [
  "Khan", "Ali", "Ahmed", "Abbas", "Jabbar", "Ghani", "Zehra", "Bibi", "Saeed",
  "Qamar", "Altaf", "Rafique", "Jaswal", "Hayat", "Raza", "Aziz", "Hussain", "Hocane",
  "Ashraf", "Zaidi", "Azhar", "Zafar", "Aslam", "Munawar", "Siddiqui", "Rasheed",
  "Iqbal", "Sharif", "Butt", "Dar", "Malik", "Chaudhry", "Sheikh", "Riaz", "Shah"
];

const shampooTemplates = [
  {
    rating: 5,
    title: "Instant hair colour",
    content: "Excellent products. Thanks The Hair Factory 👍 ."
  },
  {
    rating: 5,
    title: "easey to use",
    content: "very nice.. bohat acha hair shampoo ha ya.. bohat he achy sy color hoy hn hair... full recommend ha meri trf sy"
  },
  {
    rating: 4,
    title: "love dark brown",
    content: "I'm totally satisfied thank you"
  },
  {
    rating: 4,
    title: "best product he",
    content: "fine product recommendation to all, fast delivery response by honest seller . jazakallah"
  },
  {
    rating: 5,
    title: "Bohat hi zabardast!",
    content: "Sirf 10 minutes main saare gray hair cover ho gaye. No chemical smell, hair are soft. Highly recommended!"
  },
  {
    rating: 5,
    title: "Highly satisfied",
    content: "Original shampoo received. Result is amazing and natural. Fast delivery to Karachi."
  },
  {
    rating: 5,
    title: "Value for money",
    content: "PKR main boht achi deal mili. It is much better than expensive salon visits."
  },
  {
    rating: 5,
    title: "Excellent product",
    content: "Hair color natural black boht fit aya hai. Packing was also good."
  },
  {
    rating: 5,
    title: "Very easy application",
    content: "Just wash like normal shampoo and wait. Result is 100% gray coverage."
  },
  {
    rating: 4,
    title: "Good response",
    content: "Product is great, COD delivery was fast in Lahore. Thank you seller."
  }
];

const genericTemplates = [
  {
    rating: 5,
    title: "Highly Recommended",
    content: "Bohat hi fit product hai. Packing was secure and delivery fast."
  },
  {
    rating: 5,
    title: "Original product",
    content: "Authentic item received. Buysial has the best prices and original items."
  },
  {
    rating: 4,
    title: "Acha experience rha",
    content: "Result is quite good. Lahore main 2 din main delivery mil gyi."
  },
  {
    rating: 5,
    title: "Best purchase!",
    content: "Main repeat customer ban chuka hu. Satisfied with product quality."
  },
  {
    rating: 5,
    title: "Very useful",
    content: "Bohat zabardast response aur fit item. Strongly recommend this shop."
  }
];

// Helper to generate a random date in the last year
function randomDate() {
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  const products = await prisma.product.findMany();
  
  if (products.length === 0) {
    console.log("No products found in database. Seed products first.");
    return;
  }

  console.log(`Found ${products.length} products. Generating 50-150 reviews per product...`);

  // Clear existing reviews to prevent bloat
  await prisma.review.deleteMany({});
  console.log("Cleared existing reviews.");

  for (const product of products) {
    const reviewsCount = Math.floor(Math.random() * 101) + 50; // Random number between 50 and 150
    console.log(`Generating ${reviewsCount} reviews for ${product.name}...`);

    const isShampoo = product.slug.includes("shampoo");
    const templates = isShampoo ? shampooTemplates : genericTemplates;

    for (let i = 0; i < reviewsCount; i++) {
      // Pick random name
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const customerName = `${firstName} ${lastName}`;
      const customerEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${Math.floor(Math.random() * 10000)}@buysial-mock.pk`;

      // Pick random template
      const template = templates[Math.floor(Math.random() * templates.length)];

      // Create mock customer
      const customer = await prisma.customer.create({
        data: {
          name: customerName,
          email: customerEmail,
          passwordHash: "mocked_hash"
        }
      });

      // Create review
      await prisma.review.create({
        data: {
          rating: template.rating,
          title: template.title,
          content: template.content,
          status: "published",
          productId: product.id,
          customerId: customer.id,
          createdAt: randomDate()
        }
      });
    }

    // Update reviewsCount on the product
    await prisma.product.update({
      where: { id: product.id },
      data: { reviewsCount: reviewsCount }
    });
  }

  console.log("Review seeding completed successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
