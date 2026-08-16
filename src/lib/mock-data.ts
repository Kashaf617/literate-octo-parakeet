import type { ArticleType } from "./types";

export const MOCK_ARTICLES: ArticleType[] = [
  {
    id: "1",
    title: "The Art of Mechanical Watch Movements",
    excerpt: "Delve into the intricate world of mechanical watch complications, gears, and self-winding automatic calibers.",
    content: "<h2>Introduction</h2><p>A mechanical watch movement is a marvel of micro-engineering. Unlike quartz watches powered by batteries, mechanical timepieces harness energy from a tightly wound spring to measure time with absolute elegance.</p><h2>1. The Mainspring & Escapement</h2><p>The mainspring stores potential energy, which is released incrementally through the escapement and balance wheel, producing the characteristic 'tick' sound.</p><h2>2. Automatic vs Hand-Winding</h2><p>Automatic movements wind themselves using a rotating weight (rotor) activated by the wearer's daily wrist motion, while manual movements require winding by hand.</p><h2>3. Appreciation for the Craft</h2><p>Owning a mechanical watch means carrying a tiny, beating heart on your wrist—a timeless artifact representing centuries of horological evolution.</p>",
    image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=1200&auto=format&fit=crop",
    category: "Watchmaking",
    date: "Jun 28, 2026",
    slug: "mechanical-watch-movements"
  },
  {
    id: "2",
    title: "A Complete Guide to Chronograph Timepieces",
    excerpt: "What is a chronograph watch, how does it work, and how can you use its sub-dials to measure elapsed time with precision?",
    content: "<h2>Defining the Chronograph</h2><p>Strictly speaking, a chronograph is a watch with built-in stopwatch functionality. It usually features two pushers on the side of the case and three sub-dials on the face.</p><h2>Understanding Sub-dials</h2><p>The sub-dials measure elapsed seconds, minutes, and hours, allowing the wearer to track precise intervals without affecting normal timekeeping.</p><h2>Tachymeter Scale</h2><p>Many chronographs feature a tachymeter scale on the outer bezel. This scale allows you to calculate speed based on travel time over a fixed distance.</p>",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200&auto=format&fit=crop",
    category: "Craftsmanship",
    date: "Jun 22, 2026",
    slug: "chronograph-guide"
  },
  {
    id: "3",
    title: "How to Properly Care for Your Luxury Watch",
    excerpt: "Simple daily routines, winding instructions, and cleaning tips to ensure your luxury timepiece lasts for generations.",
    content: "<h2>Daily Care Routines</h2><p>Your watch is a precision instrument. Wipe it down gently with a microfiber cloth after a day of wear to remove dust and oils.</p><h2>Winding Automatic Calibers</h2><p>If you don't wear your automatic watch daily, wind the crown 20-30 times before putting it on, or store it in a high-quality watch winder.</p><h2>Avoiding Magnetism</h2><p>Keep your watch away from strong magnets in speakers, refrigerators, or iPads, as magnetic fields can disrupt the delicate balance spring.</p>",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1200&auto=format&fit=crop",
    category: "Maintenance",
    date: "Jun 15, 2026",
    slug: "luxury-watch-care"
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
  {icon: "Truck", title: "Free Shipping", subtitle: "Free on orders Rs. 10,000+" },
  { icon: "RotateCcw", title: "Easy Returns", subtitle: "3-day return policy" },
  { icon: "Shield", title: "Secure Payments", subtitle: "100% protected checkout" },
  { icon: "Headphones", title: "24/7 Support", subtitle: "Dedicated help center" }
];
