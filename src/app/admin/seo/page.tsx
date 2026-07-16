import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import PageHeader from "@/components/admin/PageHeader";
import SeoPixelsForm from "@/components/admin/SeoPixelsForm";

export const dynamic = "force-dynamic";

export default async function SeoPage() {
  const seo = await getSetting("seo", DEFAULT_SETTINGS.seo);
  const pixels = await getSetting("pixels", DEFAULT_SETTINGS.pixels);
  return (
    <div>
      <PageHeader title="SEO & Pixels" subtitle="Control global metadata, sitemaps, and marketing pixel integrations." />
      <SeoPixelsForm initialSeo={seo} initialPixels={pixels} />
    </div>
  );
}
