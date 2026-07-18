"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function ProductGallery({ images, productName }: { images: string[], productName: string }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const thumbContainerRef = useRef<HTMLDivElement>(null);

  const mainImages = images.length > 0 ? images : ["https://placehold.co/800x1000"];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const scrollThumbnails = (direction: "up" | "down") => {
    if (thumbContainerRef.current) {
      const scrollAmount = 120; // Approx height of one thumbnail + gap
      thumbContainerRef.current.scrollBy({
        top: direction === "up" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 h-[500px] md:h-[600px] lg:h-[700px] lg:sticky lg:top-32">
      {/* Thumbnails (Vertical on desktop, horizontal on mobile) */}
      <div className="md:w-24 shrink-0 relative flex md:flex-col items-center">
        <button 
          onClick={() => scrollThumbnails("up")}
          className="hidden md:flex absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-white via-white/80 to-transparent h-8 items-center justify-center text-gray-500 hover:text-black transition-colors"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        
        <div 
          ref={thumbContainerRef}
          className="flex md:flex-col gap-4 overflow-auto snap-x md:snap-y snap-mandatory hide-scrollbar w-full h-full md:py-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {mainImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImageIndex(i)}
              className={`relative aspect-[4/5] w-20 md:w-full shrink-0 snap-center rounded-xl overflow-hidden transition-all duration-300 ${activeImageIndex === i ? 'ring-2 ring-black ring-offset-2 opacity-100 scale-100' : 'opacity-60 hover:opacity-100 scale-95 hover:scale-100'}`}
            >
              <Image src={img} alt={`${productName} thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>

        <button 
          onClick={() => scrollThumbnails("down")}
          className="hidden md:flex absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-white via-white/80 to-transparent h-8 items-center justify-center text-gray-500 hover:text-black transition-colors"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image with Zoom */}
      <div className="flex-1 relative aspect-[4/5] md:aspect-auto rounded-3xl overflow-hidden bg-[#f8f9fa] shadow-sm border border-gray-100">
        <div 
          className="w-full h-full cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image 
            src={mainImages[activeImageIndex]} 
            alt={productName} 
            fill 
            className={`object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
            style={isZoomed ? {
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`
            } : undefined}
            priority
          />
        </div>
      </div>
    </div>
  );
}
