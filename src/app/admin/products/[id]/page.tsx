import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories, collections] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { collections: true, variants: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.collection.findMany({ orderBy: { name: "asc" } })
  ]);
  if (!product) return notFound();

  const initial = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    comparePrice: product.comparePrice ?? undefined,
    costPrice: product.costPrice ?? undefined,
    sku: product.sku ?? "",
    stock: product.stock,
    images: JSON.parse(product.images || "[]"),
    categoryId: product.categoryId ?? "",
    collectionIds: product.collections.map((c) => c.collectionId),
    status: product.status,
    isFeatured: product.isFeatured,
    seoTitle: product.seoTitle ?? "",
    seoDescription: product.seoDescription ?? "",
    hasVariants: product.hasVariants,
    options: product.options ? JSON.parse(product.options) : [],
    variants: product.variants.map((v) => ({
      ...v,
      price: v.price.toString(),
      stock: v.stock.toString(),
      sku: v.sku || "",
      optionChoices: JSON.parse(v.optionChoices)
    }))
  };

  return (
    <div>
      <PageHeader title="Edit Product" subtitle={product.name} />
      <ProductForm categories={categories} collections={collections as any} initial={initial as any} />
    </div>
  );
}
