import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import BannerManager from "@/components/admin/BannerManager";

export const dynamic = "force-dynamic";

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  const collections = await prisma.collection.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <PageHeader title="Banners" subtitle="Manage homepage banners with instant live preview." />
      <BannerManager />
    </div>
  );
}
