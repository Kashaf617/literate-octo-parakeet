import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { collections: true }
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  const data = await req.json();
  await prisma.productCollection.deleteMany({ where: { productId: params.id } });
  await prisma.productVariant.deleteMany({ where: { productId: params.id } });

  const product = await prisma.product.update({
    where: { id: params.id },
    data: {
      name: data.name,
      slug: data.slug ? slugify(data.slug) : undefined,
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
  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
