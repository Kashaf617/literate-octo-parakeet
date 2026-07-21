import type { ArticleType } from "./types";

export const MOCK_ARTICLES: ArticleType[] = [
  {
    id: "1",
    title: "The Ultimate Guide to Mechanical Watch Movements: Automatic vs Hand-Winding",
    excerpt: "Explore the inner workings of luxury mechanical timepieces, balance wheels, and automatic rotor calibers crafted for horological perfection.",
    content: "<h2>Understanding the Heart of a Luxury Timepiece</h2><p>A mechanical watch movement is widely considered one of humanity's finest micro-engineering achievements. Unlike modern quartz watches that rely on electronic batteries, mechanical timepieces store kinetic energy in a coiled mainspring, releasing it incrementally to drive intricate gears, escapements, and hands with absolute elegance.</p><h2>1. How Automatic Movements Work</h2><p>An automatic or self-winding watch utilizes a weighted rotor mounted on the movement's pivot. As you move your arm throughout the day, the rotor swings back and forth, automatically winding the mainspring. A fully wound DEVINE ORA automatic timepiece provides up to 42 hours of power reserve even when left off the wrist overnight.</p><h2>2. Hand-Winding (Manual) Calibers</h2><p>Manual movements require the wearer to rotate the winding crown by hand to store energy. Purists and horological collectors appreciate manual watches for their slim profile and the tactile daily ritual of winding their timepiece every morning.</p><h2>3. Why Sapphire Crystal & 316L Steel Matter</h2><p>To protect these delicate mechanical movements from dust, moisture, and impact, DEVINE ORA uses surgical-grade 316L stainless steel and scratch-resistant sapphire crystal glass. Sapphire rates 9 on the Mohs hardness scale—second only to diamond—ensuring your watch crystal remains crystal clear for decades.</p>",
    image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=1200&q=80",
    category: "Watchmaking",
    date: "Jul 20, 2026",
    slug: "mechanical-watch-movements-guide"
  },
  {
    id: "2",
    title: "Chronographs Explained: How to Use Sub-Dials & Tachymeter Bezels",
    excerpt: "Learn how chronograph pushers, sub-dials, and tachymeter scales allow luxury watch owners to measure elapsed time and speed with precision.",
    content: "<h2>What is a Chronograph Watch?</h2><p>In watchmaking, a <strong>chronograph</strong> is a watch equipped with an independent stopwatch function alongside standard timekeeping. Chronographs are identifiable by their two side pushers (start/stop and reset) and specialized sub-dials on the watch face.</p><h2>How to Read Chronograph Sub-Dials</h2><p>Most luxury chronographs feature three distinct sub-dials:</p><ul><li><strong>Running Seconds Sub-dial:</strong> Displays the continuous ticking seconds of the main timekeeping mechanism.</li><li><strong>30-Minute Counter:</strong> Tracks elapsed minutes when the chronograph stopwatch is activated.</li><li><strong>12-Hour Counter:</strong> Measures longer time durations up to 12 full hours.</li></ul><h2>Mastering the Tachymeter Bezel</h2><p>The numerical markings engraved around the outer bezel of a chronograph are called a <em>Tachymeter scale</em>. By starting the chronograph at a distance marker (e.g. 1 km or 1 mile) and stopping it at the next marker, the central chronograph hand points directly to your average speed in units per hour.</p>",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80",
    category: "Craftsmanship",
    date: "Jul 19, 2026",
    slug: "chronographs-sub-dials-tachymeter-guide"
  },
  {
    id: "3",
    title: "How to Care for Your Luxury Watch: Cleaning, Winding & Maintenance Tips",
    excerpt: "Essential care routines, water resistance guidelines, and cleaning habits to keep your DEVINE ORA watch pristine for generations.",
    content: "<h2>Preserving Your Timepiece's Brilliance</h2><p>A luxury watch is crafted to endure a lifetime of daily wear, but proper maintenance ensures its movement stays accurate and its polish retains its showroom luster.</p><h2>1. Daily Cleaning Routine</h2><p>Wipe down your watch case and bracelet with a soft microfiber cloth at the end of the day. This removes natural skin oils, moisture, and dust particles that can accumulate in bracelet links.</p><h2>2. Understanding Water Resistance (ATM)</h2><p>Always ensure the crown is fully pushed in or screwed down before exposure to water. DEVINE ORA watches rated at 5 ATM (50 meters) easily withstand rain, splashes, and handwashing, while 10 ATM sport models are suitable for swimming.</p><h2>3. Avoiding Magnetic Fields</h2><p>Modern electronics like smartphones, laptops, magnetic purse clasps, and speakers emit magnetic fields that can magnetize a watch's balance spring. Store your timepiece away from high magnetic sources when not in use.</p>",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=80",
    category: "Maintenance",
    date: "Jul 18, 2026",
    slug: "luxury-watch-care-maintenance-guide"
  },
  {
    id: "4",
    title: "Styling Luxury Watches: Matching Your Timepiece to Every Occasion",
    excerpt: "From black-tie dinners to casual weekend wear, discover how to pair watch metals, straps, and dial colors with your wardrobe.",
    content: "<h2>The Art of Wristwear Elegance</h2><p>A luxury watch is the ultimate signature accessory. Selecting the right timepiece for your outfit elevates your personal style and makes a memorable statement of sophistication.</p><h2>1. Formal & Black-Tie Events</h2><p>For black-tie attire and formal suits, opt for a classic dress watch with a slim case, clean dial, and a black or dark brown leather strap. Gold or silver stainless steel cases harmoniously match cuff links and belt buckles.</p><h2>2. Smart Casual & Office Wear</h2><p>For business meetings and smart casual attire, a stainless steel chronograph or integrated bracelet watch with a navy or emerald dial adds modern confidence without being overly flashy.</p><h2>3. Weekend & Sportswear</h2><p>Rubber straps, NATO bands, and durable titanium sport watches are ideal for weekend travel, athletic pursuits, and casual gatherings.</p>",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    category: "Style & Heritage",
    date: "Jul 17, 2026",
    slug: "styling-luxury-watches-guide"
  }
];

export const FOOTER_LINKS = {
  categories: [
    { label: "Luxury Watches", href: "/category/luxury-watches" },
    { label: "Classic Watches", href: "/category/classic-watches" },
    { label: "Smart Watches", href: "/category/smart-watches" },
    { label: "Chronographs", href: "/category/chronographs" },
    { label: "Sports Watches", href: "/category/sports-watches" },
    { label: "Limited Edition", href: "/category/limited-edition" }
  ],
  useful: [
    { label: "Track Order", href: "/track-order" },
    { label: "Shipping & Delivery", href: "#" },
    { label: "Returns & Refunds", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" }
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Live Chat", href: "#" },
    { label: "FAQs", href: "#" }
  ]
};

export const TRUST_BADGES = [
  { icon: "Truck", title: "Free Shipping", subtitle: "Free shipping all over Pakistan" },
  { icon: "RotateCcw", title: "Easy Returns", subtitle: "3-day return policy" },
  { icon: "Shield", title: "Secure Payments", subtitle: "100% protected checkout" },
  { icon: "Headphones", title: "24/7 Support", subtitle: "Dedicated help center" }
];
