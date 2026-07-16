import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import React from "react";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const general = await getSetting("general", DEFAULT_SETTINGS.general);
  const rawSettings = await prisma.setting.findMany({ 
    where: { key: { in: ['marquee_text', 'marquee_speed'] } } 
  });
  const settingsMap = rawSettings.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {} as Record<string, string>);

  return (
    <>
      <Header
        storeName={general.storeName}
        tagline={general.tagline}
        supportPhone={general.supportPhone}
        freeShippingText={general.freeShippingText}
        marqueeText={settingsMap['marquee_text'] || "FOLLOW US AND GET A CHANCE TO WIN 80% OFF"}
        marqueeSpeed={Number(settingsMap['marquee_speed']) || 20}
      />
      {children}
      <Footer storeName={general.storeName} />
    </>
  );
}
