const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');

const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Helper to download image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    if (!url) return resolve(null);
    if (url.startsWith('//')) url = 'https:' + url;
    const req = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return resolve(null);
      }
      const fileStream = fs.createWriteStream(path.join(UPLOADS_DIR, filename));
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(`/uploads/${filename}`);
      });
      fileStream.on('error', (err) => {
        fs.unlink(path.join(UPLOADS_DIR, filename), () => resolve(null));
      });
    });
    req.on('error', (err) => resolve(null));
  });
}

// Helper to extract price
function extractPrice(str) {
  if (!str) return null;
  const match = str.replace(/,/g, '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
}

const pakistaniNames = [
  "Ali", "Ayesha", "Usman", "Fatima", "Bilal", "Zainab", "Omer", "Khadija", 
  "Hamza", "Maryam", "Ahmed", "Hira", "Hassan", "Sana", "Hussain", "Maha", 
  "Tariq", "Amna", "Shahid", "Nida", "Imran", "Rabia", "Kamran", "Sadia", 
  "Faisal", "Nadia", "Irfan", "Saira", "Junaid", "Farah", "Saad", "Amina"
];

const reviewTitles = [
  "Amazing product!", "Really fast delivery", "Good quality", "Highly recommended",
  "Exactly as described", "Worth the money", "Loved it", "Perfect", "Nice packaging",
  "Great customer service", "Will buy again", "Excellent", "Satisfied", "100% genuine"
];

const reviewContents = [
  "I am very happy with this purchase. The quality is exactly what they promised.",
  "Delivery was very fast and the product was nicely packed.",
  "Excellent product. I highly recommend buying from this store.",
  "I was skeptical at first, but the quality proved me wrong. Will shop again.",
  "Perfect for my needs. Great value for money.",
  "Original product. Thank you Buysial for fast delivery to Lahore.",
  "Got my parcel in Karachi within 2 days. The packaging was very secure.",
  "Good experience overall. Customer support is very responsive.",
  "Loved the product. It smells great and feels premium.",
  "10/10 would recommend this to anyone. Good job."
];

function generateReviews(productId, customerId) {
  const count = Math.floor(Math.random() * (150 - 50 + 1)) + 50; // 50 to 150
  const reviews = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      productId,
      customerId, // we'll create a dummy customer for reviews or just link a random one
      rating: Math.random() > 0.1 ? 5 : 4, // Mostly 5 stars, some 4 stars
      title: reviewTitles[Math.floor(Math.random() * reviewTitles.length)],
      content: reviewContents[Math.floor(Math.random() * reviewContents.length)],
      status: "published",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
    });
  }
  return reviews;
}

async function main() {
  console.log("Cleaning database...");
  await prisma.orderItem.deleteMany({});
  await prisma.productCollection.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.customer.deleteMany({ where: { email: 'reviewers@buysial.pk' }});

  const dummyCustomer = await prisma.customer.create({
    data: {
      name: "Verified Buyers",
      email: "reviewers@buysial.pk",
      passwordHash: "dummy"
    }
  });

  console.log("Fetching main page...");
  const mainRes = await fetch('https://buysial.pk/');
  const mainHtml = await mainRes.text();
  const $main = cheerio.load(mainHtml);
  
  const productLinks = new Set();
  $main('a').each((i, el) => {
    const href = $main(el).attr('href');
    if (href && href.startsWith('https://buysial.pk/product/')) {
      productLinks.add(href);
    }
  });

  console.log(`Found ${productLinks.size} unique product links.`);

  for (const link of productLinks) {
    console.log(`\nFetching ${link}...`);
    try {
      const res = await fetch(link);
      const html = await res.text();
      const $ = cheerio.load(html);

      const title = $('h1.product_title').text().trim();
      if (!title) continue;

      let priceStr = $('p.price ins .amount').text().trim() || $('p.price .amount').last().text().trim() || $('p.price').text().trim();
      let comparePriceStr = $('p.price del .amount').text().trim() || $('p.price del').text().trim();

      const price = extractPrice(priceStr) || 0;
      const comparePrice = extractPrice(comparePriceStr);

      const description = $('.woocommerce-product-details__short-description').html() || '';
      const catName = $('.posted_in a').first().text().trim() || 'Uncategorized';

      const slug = link.split('/product/')[1].replace(/\/$/, '');

      let cat = await prisma.category.findUnique({ where: { slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-') } });
      if (!cat) {
        cat = await prisma.category.create({
          data: {
            name: catName,
            slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          }
        });
      }

      // Download main image
      const imgUrl = $('.woocommerce-product-gallery__image img').first().attr('src') || $('.wp-post-image').first().attr('src');
      let savedImgUrl = '/placeholder.png';
      if (imgUrl) {
        const ext = path.extname(imgUrl.split('?')[0]) || '.jpg';
        const filename = `${slug}${ext}`;
        const dl = await downloadImage(imgUrl, filename);
        if (dl) savedImgUrl = dl;
      }

      const product = await prisma.product.create({
        data: {
          name: title,
          slug: slug,
          price: price,
          comparePrice: comparePrice,
          description: description,
          categoryId: cat.id,
          images: JSON.stringify([savedImgUrl]),
          status: 'active',
          stock: 100,
        }
      });

      console.log(`Created product: ${title} ($${price})`);

      // Add reviews
      const reviews = generateReviews(product.id, dummyCustomer.id);
      
      // Update names to be Pakistani
      for (let r of reviews) {
        const reviewerName = pakistaniNames[Math.floor(Math.random() * pakistaniNames.length)];
        // Wait, review model doesn't have authorName, it uses customer relation.
        // I will just link them all to dummyCustomer.
        // To make it look better in frontend, we might need to modify Review model or Customer?
        // Actually, we can create multiple customers if we want distinct names!
        const cust = await prisma.customer.create({
          data: {
            name: reviewerName,
            email: `fake_${Math.random()}@buysial.pk`,
            passwordHash: 'dummy'
          }
        });
        r.customerId = cust.id;
      }

      await prisma.review.createMany({
        data: reviews
      });

      console.log(`Added ${reviews.length} reviews for ${title}`);

    } catch (err) {
      console.error(`Error processing ${link}:`, err.message);
    }
  }
  
  console.log("\nDone!");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
