const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setSetting(key, value) {
  const existing = await prisma.setting.findFirst({ where: { key } });
  if (existing) {
    await prisma.setting.update({ where: { id: existing.id }, data: { value } });
  } else {
    await prisma.setting.create({ data: { key, value } });
  }
}

async function runWithRetry(fn, maxRetries = 10) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.log(`[Attempt ${i + 1}/${maxRetries}] Connection wait... (${err.message.slice(0, 80)})`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  throw new Error("Failed after max retries.");
}

async function main() {
  console.log("Starting Resilient DB Seed...");

  await runWithRetry(async () => {
    // 1. Update Email Settings to Gmail with cleaned App Password
    const cleanPass = "fasmuowynorwlemx"; // stripped whitespace from 'fasm uowy norw lemx'
    await setSetting("email_provider", "gmail");
    await setSetting("email_gmail_user", "devineora7@gmail.com");
    await setSetting("email_gmail_pass", cleanPass);
    await setSetting("email_from_address", "devineora7@gmail.com");
    await setSetting("email_from_name", "DEVINE ORA");
    console.log("✓ Gmail SMTP settings configured in DB with clean credentials.");
  });

  await runWithRetry(async () => {
    // 2. Create Sample Customers for Reviews
    const sampleCustomers = [
      { name: "Hamza Malik", email: "hamza.malik@example.com" },
      { name: "Zainab Chaudhry", email: "zainab.c@example.com" },
      { name: "Bilal Ahmed", email: "bilal.ahmed@example.com" },
      { name: "Ayesha Khan", email: "ayesha.k@example.com" },
      { name: "Usman Raza", email: "usman.raza@example.com" },
      { name: "Fatima Noor", email: "fatima.noor@example.com" },
      { name: "Tariq Mahmood", email: "tariq.m@example.com" },
      { name: "Sana Iqbal", email: "sana.i@example.com" }
    ];

    const dbCustomers = [];
    for (const c of sampleCustomers) {
      let customer = await prisma.customer.findUnique({ where: { email: c.email } });
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: c.name,
            email: c.email,
            passwordHash: "sample_hash"
          }
        });
      }
      dbCustomers.push(customer);
    }
    console.log(`✓ ${dbCustomers.length} Customer profiles ready.`);

    // 3. Fetch all products to assign reviews
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products for reviews.`);

    await prisma.review.deleteMany();

    const reviewTemplates = [
      {
        title: "Exquisite Craftsmanship & Timeless Design",
        content: "Received my DEVINE ORA watch today in pristine luxury packaging. The weight, steel finish, and automatic dial movement are beyond expectations. Highly recommended!",
        rating: 5,
        daysAgo: 1
      },
      {
        title: "Unmatched Premium Quality for the Price",
        content: "The sapphire crystal glass and craftsmanship are top-tier. Extremely comfortable to wear every day. Fast delivery within 2 days!",
        rating: 5,
        daysAgo: 2
      },
      {
        title: "Stunning Timepiece - Gets Compliments Daily",
        content: "Absolute head-turner. The dial detail and bracelet polish feel like a high-end luxury watch costing 5x more.",
        rating: 5,
        daysAgo: 3
      },
      {
        title: "10/10 Elegant Watch & Fast Cash on Delivery",
        content: "Order was delivered quickly via Leopards. Opened and checked before payment. 100% genuine and original product quality.",
        rating: 5,
        daysAgo: 4
      },
      {
        title: "Beautiful Luxury Finishing",
        content: "The attention to detail on the bezel and leather/steel strap is amazing. Definitely buying another model for my brother's birthday.",
        rating: 5,
        daysAgo: 5
      }
    ];

    const now = new Date("2026-07-21T12:00:00.000Z");

    let reviewCount = 0;
    for (const prod of products) {
      for (let rIdx = 0; rIdx < 3; rIdx++) {
        const template = reviewTemplates[(prod.name.length + rIdx) % reviewTemplates.length];
        const customer = dbCustomers[reviewCount % dbCustomers.length];
        
        const reviewDate = new Date(now.getTime() - (template.daysAgo + (rIdx * 0.5)) * 24 * 60 * 60 * 1000);

        await prisma.review.create({
          data: {
            productId: prod.id,
            customerId: customer.id,
            rating: template.rating,
            title: template.title,
            content: template.content,
            isApproved: true,
            createdAt: reviewDate,
            updatedAt: reviewDate
          }
        });
        reviewCount++;
      }
    }
    console.log(`✓ ${reviewCount} Product reviews created with latest July 2026 dates.`);

    // 4. Seed High-Quality SEO Blog Articles
    await prisma.article.deleteMany();

    const articles = [
      {
        title: "The Ultimate Guide to Mechanical Watch Movements: Automatic vs Hand-Winding",
        slug: "mechanical-watch-movements-guide",
        excerpt: "Explore the inner workings of luxury mechanical timepieces, balance wheels, and automatic rotor calibers crafted for horological perfection.",
        category: "Watchmaking",
        image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=1200&q=80",
        content: `
          <h2>Understanding the Heart of a Luxury Timepiece</h2>
          <p>A mechanical watch movement is widely considered one of humanity's finest micro-engineering achievements. Unlike modern quartz watches that rely on electronic batteries, mechanical timepieces store kinetic energy in a coiled mainspring, releasing it incrementally to drive intricate gears, escapements, and hands with absolute elegance.</p>
          
          <h2>1. How Automatic Movements Work</h2>
          <p>An automatic or self-winding watch utilizes a weighted rotor mounted on the movement's pivot. As you move your arm throughout the day, the rotor swings back and forth, automatically winding the mainspring. A fully wound DEVINE ORA automatic timepiece provides up to 42 hours of power reserve even when left off the wrist overnight.</p>
          
          <h2>2. Hand-Winding (Manual) Calibers</h2>
          <p>Manual movements require the wearer to rotate the winding crown by hand to store energy. Purists and horological collectors appreciate manual watches for their slim profile and the tactile daily ritual of winding their timepiece every morning.</p>
          
          <h2>3. Why Sapphire Crystal & 316L Steel Matter</h2>
          <p>To protect these delicate mechanical movements from dust, moisture, and impact, DEVINE ORA uses surgical-grade 316L stainless steel and scratch-resistant sapphire crystal glass. Sapphire rates 9 on the Mohs hardness scale—second only to diamond—ensuring your watch crystal remains crystal clear for decades.</p>
        `,
        published: true,
        createdAt: new Date("2026-07-20T10:00:00.000Z")
      },
      {
        title: "Chronographs Explained: How to Use Sub-Dials & Tachymeter Bezels",
        slug: "chronographs-sub-dials-tachymeter-guide",
        excerpt: "Learn how chronograph pushers, sub-dials, and tachymeter scales allow luxury watch owners to measure elapsed time and speed with precision.",
        category: "Craftsmanship",
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80",
        content: `
          <h2>What is a Chronograph Watch?</h2>
          <p>In watchmaking, a <strong>chronograph</strong> is a watch equipped with an independent stopwatch function alongside standard timekeeping. Chronographs are identifiable by their two side pushers (start/stop and reset) and specialized sub-dials on the watch face.</p>
          
          <h2>How to Read Chronograph Sub-Dials</h2>
          <p>Most luxury chronographs feature three distinct sub-dials:</p>
          <ul>
            <li><strong>Running Seconds Sub-dial:</strong> Displays the continuous ticking seconds of the main timekeeping mechanism.</li>
            <li><strong>30-Minute Counter:</strong> Tracks elapsed minutes when the chronograph stopwatch is activated.</li>
            <li><strong>12-Hour Counter:</strong> Measures longer time durations up to 12 full hours.</li>
          </ul>
          
          <h2>Mastering the Tachymeter Bezel</h2>
          <p>The numerical markings engraved around the outer bezel of a chronograph are called a <em>Tachymeter scale</em>. By starting the chronograph at a distance marker (e.g. 1 km or 1 mile) and stopping it at the next marker, the central chronograph hand points directly to your average speed in units per hour.</p>
        `,
        published: true,
        createdAt: new Date("2026-07-19T14:30:00.000Z")
      },
      {
        title: "How to Care for Your Luxury Watch: Cleaning, Winding & Maintenance Tips",
        slug: "luxury-watch-care-maintenance-guide",
        excerpt: "Essential care routines, water resistance guidelines, and cleaning habits to keep your DEVINE ORA watch pristine for generations.",
        category: "Maintenance",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80",
        content: `
          <h2>Preserving Your Timepiece's Brilliance</h2>
          <p>A luxury watch is crafted to endure a lifetime of daily wear, but proper maintenance ensures its movement stays accurate and its polish retains its showroom luster.</p>
          
          <h2>1. Daily Cleaning Routine</h2>
          <p>Wipe down your watch case and bracelet with a soft microfiber cloth at the end of the day. This removes natural skin oils, moisture, and dust particles that can accumulate in bracelet links.</p>
          
          <h2>2. Understanding Water Resistance (ATM)</h2>
          <p>Always ensure the crown is fully pushed in or screwed down before exposure to water. DEVINE ORA watches rated at 5 ATM (50 meters) easily withstand rain, splashes, and handwashing, while 10 ATM sport models are suitable for swimming.</p>
          
          <h2>3. Avoiding Magnetic Fields</h2>
          <p>Modern electronics like smartphones, laptops, magnetic purse clasps, and speakers emit magnetic fields that can magnetize a watch's balance spring. Store your timepiece away from high magnetic sources when not in use.</p>
        `,
        published: true,
        createdAt: new Date("2026-07-18T09:15:00.000Z")
      },
      {
        title: "Styling Luxury Watches: Matching Your Timepiece to Every Occasion",
        slug: "styling-luxury-watches-guide",
        excerpt: "From black-tie dinners to casual weekend wear, discover how to pair watch metals, straps, and dial colors with your wardrobe.",
        category: "Style & Heritage",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
        content: `
          <h2>The Art of Wristwear Elegance</h2>
          <p>A luxury watch is the ultimate signature accessory. Selecting the right timepiece for your outfit elevates your personal style and makes a memorable statement of sophistication.</p>
          
          <h2>1. Formal & Black-Tie Events</h2>
          <p>For black-tie attire and formal suits, opt for a classic dress watch with a slim case, clean dial, and a black or dark brown leather strap. Gold or silver stainless steel cases harmoniously match cuff links and belt buckles.</p>
          
          <h2>2. Smart Casual & Office Wear</h2>
          <p>For business meetings and smart casual attire, a stainless steel chronograph or integrated bracelet watch with a navy or emerald dial adds modern confidence without being overly flashy.</p>
          
          <h2>3. Weekend & Sportswear</h2>
          <p>Rubber straps, NATO bands, and durable titanium sport watches are ideal for weekend travel, athletic pursuits, and casual gatherings.</p>
        `,
        published: true,
        createdAt: new Date("2026-07-17T16:00:00.000Z")
      }
    ];

    for (const a of articles) {
      await prisma.article.create({ data: a });
    }
    console.log(`✓ ${articles.length} SEO-optimized blog articles created with July 2026 dates.`);
  });

  console.log("ALL SEEDING COMPLETED SUCCESSFULLY!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
