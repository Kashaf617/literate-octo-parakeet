'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ProductCard, { ProductType } from './ProductCard';

interface ProductGridProps {
  title: string;
  products: ProductType[];
  viewAllHref?: string;
  accentColor?: string;
  settingKey?: string;
  isEditMode?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function ProductGrid({
  title,
  products,
  viewAllHref,
  settingKey,
  isEditMode = false
}: ProductGridProps) {
  // Determine an appropriate eyebrow based on the title
  let eyebrow = "Curated Selection";
  if (title.toLowerCase().includes("new")) eyebrow = "Latest Arrivals";
  if (title.toLowerCase().includes("best") || title.toLowerCase().includes("offer")) eyebrow = "Exclusive Deals";
  if (title.toLowerCase().includes("home")) eyebrow = "Living Essentials";

  const handleTitleUpdate = async (value: string) => {
    if (!isEditMode || !settingKey) return;
    try {
      const res = await fetch('/api/admin/settings', {
        credentials: "include",
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [settingKey]: value })
      });
      if (!res.ok) {
        if (res.status === 401) {
          alert("Unauthorized: You must be logged in as an admin to save edits. Please login at http://localhost:3000/adminlogin first.");
        } else {
          const data = await res.json().catch(() => ({}));
          alert(`Error: ${data.error || "Failed to save edits"}`);
        }
      }
    } catch (e: any) {
      console.error(e);
      alert(`Connection error: ${e.message}`);
    }
  };

  return (
    <section className="pt-6 pb-10 bg-transparent">
      <div className="max-w-[1280px] mx-auto px-1 md:px-6">
        
        {/* Premium Centered Header */}
        {title && (
          <div className="flex flex-col items-center mb-6 text-center">
            <span className="inline-block text-[#C9A227] text-[13px] font-black uppercase tracking-[0.3em] mb-3">
              {eyebrow}
            </span>
            <h2 
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => handleTitleUpdate(e.currentTarget.textContent || "")}
              className={`text-[36px] md:text-[48px] font-black text-black tracking-tight ${isEditMode ? 'outline-dashed outline-1 outline-black/30 hover:outline-black p-1' : ''}`}
            >
              {title}
            </h2>
          </div>
        )}

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1 gap-y-4 md:gap-8 md:gap-y-12"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* Elegant 'View All' Button */}
        {viewAllHref && (
          <div className="mt-16 text-center">
            <Link
              href={viewAllHref}
              className="inline-block bg-black hover:bg-[#C9A227] border border-black hover:border-[#C9A227] shadow-sm hover:shadow-none hover:translate-y-1 text-white hover:text-black font-black text-[14px] uppercase tracking-[0.2em] px-10 py-4 transition-all duration-300 rounded-xl"
            >
              Discover All
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
