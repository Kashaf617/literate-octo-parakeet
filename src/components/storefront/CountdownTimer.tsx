"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CountdownTimer({ targetDate }: { targetDate?: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Default to 30 days from now if not provided
    const target = targetDate ? new Date(targetDate).getTime() : new Date().getTime() + 30 * 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return null;

  const TimeUnit = ({ value, label, animate = false }: { value: number; label: string; animate?: boolean }) => (
    <div className="flex flex-col items-center justify-center bg-white/20 backdrop-blur-md rounded-lg w-16 h-16 md:w-20 md:h-20 shadow-inner">
      <motion.span 
        key={animate ? value : "static"}
        initial={animate ? { opacity: 0.5, scale: 0.9 } : false}
        animate={animate ? { opacity: 1, scale: 1 } : false}
        className="text-2xl md:text-3xl font-extrabold text-white leading-none"
      >
        {value.toString().padStart(2, '0')}
      </motion.span>
      <span className="text-[10px] md:text-xs font-bold text-white/80 uppercase mt-1 tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <TimeUnit value={timeLeft.days} label="Days" />
      <span className="text-white/50 text-2xl font-bold pb-2">:</span>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <span className="text-white/50 text-2xl font-bold pb-2">:</span>
      <TimeUnit value={timeLeft.minutes} label="Mins" />
      <span className="text-white/50 text-2xl font-bold pb-2">:</span>
      <TimeUnit value={timeLeft.seconds} label="Secs" animate={true} />
    </div>
  );
}
