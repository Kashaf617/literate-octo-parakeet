import { prisma, withTimeout } from "./prisma";

export async function getSetting<T = any>(key: string, fallback: T): Promise<T> {
  try {
    const row = await withTimeout(
      prisma.setting.findUnique({ where: { key } }),
      null,
      6000
    );
    if (!row) return fallback;
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: unknown) {
  const json = JSON.stringify(value);
  await prisma.setting.upsert({
    where: { key },
    update: { value: json },
    create: { key, value: json }
  });
  return value;
}

export const DEFAULT_SETTINGS = {
  general: { storeName: "DEVINE ORA", tagline: "Luxury Crafted to Perfection", supportPhone: "+92 370 7765435", currency: "PKR", freeShippingText: "Free Delivery Nationwide", company_whatsapp: "+92 370 7765435" },
  seo: { metaTitle: "DEVINE ORA — Premium Luxury Watches", metaDescription: "Discover elegant, premium, and modern watches from DEVINE ORA. Timeless watchmaking craftsmanship.", ogImage: "", robotsIndex: true, sitemapEnabled: true },
  pixels: { ga4Id: "", metaPixelId: "", tiktokPixelId: "", snapPixelId: "", gtmId: "" },
  payments: {
    codEnabled: true,
    jazzcash: { enabled: false, merchantId: "", password: "", integritySalt: "", mode: "sandbox", displayNumber: "", displayName: "" },
    easypaisa: { enabled: false, storeId: "", accountNum: "", hashKey: "", mode: "sandbox", displayNumber: "", displayName: "" },
    payfast: { enabled: false, merchantId: "", secureKey: "", mode: "sandbox" },
    bankTransfer: { enabled: false, accountTitle: "", accountNumber: "", bankName: "", iban: "", displayInstructions: "" }
  },
  logistics: {
    defaultCourier: "leopards",
    leopards: { enabled: true, apiKey: "", apiPassword: "" },
    tcs: { enabled: false, apiKey: "", costCenter: "" },
    postex: { enabled: false, apiKey: "" },
    mnp: { enabled: false, apiKey: "" }
  }
} as const;
