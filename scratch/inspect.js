const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 3; i++) {
    try {
      console.log(`Attempt ${i + 1} to query DB...`);
      const products = await prisma.product.findMany({ select: { id: true, name: true, slug: true, category: true, price: true } });
      console.log('--- PRODUCTS (' + products.length + ') ---');
      console.log(products);

      const reviews = await prisma.review.findMany({ take: 10 });
      console.log('--- REVIEWS (' + reviews.length + ') ---');
      console.log(reviews);

      const articles = await prisma.article.findMany();
      console.log('--- ARTICLES (' + articles.length + ') ---');
      console.log(articles);

      const settings = await prisma.setting.findMany();
      console.log('--- SETTINGS (' + settings.length + ') ---');
      console.log(settings);
      break;
    } catch (e) {
      console.error('Error on attempt', i + 1, e.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  await prisma.$disconnect();
}

main().catch(console.error);
