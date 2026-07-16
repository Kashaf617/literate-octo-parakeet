"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

export default function CelebrityCarousel({ celebrities }: { celebrities: any[] }) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!celebrities || celebrities.length === 0) return null;

  return (
    <div className="my-16">
      <h2 className="text-2xl md:text-3xl font-black text-center mb-8">Recommended By Top Celebrities</h2>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory pb-8 px-4 md:px-0 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {celebrities.map((celeb) => (
          <div 
            key={celeb.id} 
            className="snap-center shrink-0 w-[280px] md:w-[320px] rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col relative"
          >
            <div className="relative aspect-[4/5] bg-gray-50 w-full cursor-pointer" onClick={() => celeb.videoUrl && setPlayingVideo(celeb.videoUrl)}>
              {playingVideo === celeb.videoUrl ? (
                <video src={celeb.videoUrl} controls autoPlay className="w-full h-full object-cover" />
              ) : (
                <>
                  <Image src={celeb.image || "/placeholder.png"} alt={celeb.name} fill className="object-cover" />
                  {celeb.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                      <div className="w-14 h-14 bg-[#ff5a1f] rounded-full flex items-center justify-center shadow-lg">
                        <Play fill="white" className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="p-4 bg-white text-center">
              <h3 className="text-lg font-bold text-black">{celeb.name}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-2 mt-2">
        {celebrities.map((_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-black' : 'bg-gray-300 border border-gray-400'}`}></div>
        ))}
      </div>
    </div>
  );
}
