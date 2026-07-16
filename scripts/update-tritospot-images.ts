import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const images = [
    "/uploads/tritospot-1.jpeg",
    "/uploads/tritospot-2.jpeg",
    "/uploads/tritospot-3.jpeg"
  ];

  await prisma.product.update({
    where: { slug: 'tritospot-cream' },
    data: {
      images: JSON.stringify(images)
    }
  });

  console.log('Updated Tritospot Cream images');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
