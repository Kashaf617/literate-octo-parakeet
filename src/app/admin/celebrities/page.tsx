import CelebrityManager from "@/components/admin/CelebrityManager";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function CelebritiesAdminPage() {
  const celebrities = await prisma.celebrityRecommendation.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  const products = await prisma.product.findMany({
    select: { id: true, name: true }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Celebrity Recommendations</h1>
      <p className="text-gray-500">Manage celebrity endorsements shown on the storefront.</p>
      <CelebrityManager initialCelebrities={celebrities} products={products} />
    </div>
  );
}
