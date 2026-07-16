import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, collections: { include: { collection: true } } }
  });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const data = await req.json();
  const slug = data.slug ? slugify(data.slug) : slugify(data.name);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description || "",
      price: Number(data.price) || 0,
      comparePrice: data.comparePrice ? Number(data.comparePrice) : null,
      costPrice: data.costPrice ? Number(data.costPrice) : null,
      sku: data.sku || null,
      stock: Number(data.stock) || 0,
      images: JSON.stringify(data.images || []),
      categoryId: data.categoryId || null,
      status: data.status || "active",
      isFeatured: !!data.isFeatured,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      hasVariants: !!data.hasVariants,
      options: data.hasVariants ? JSON.stringify(data.options || []) : null,
      collections: {
        create: (data.collectionIds || []).map((id: string) => ({ collectionId: id }))
      },
      variants: {
        create: (data.hasVariants && data.variants ? data.variants : []).map((v: any) => ({
          sku: v.sku || null,
          price: Number(v.price) || 0,
          stock: Number(v.stock) || 0,
          optionChoices: JSON.stringify(v.optionChoices || {})
        }))
      }
    }
  });
  return NextResponse.json(product, { status: 201 });
}
