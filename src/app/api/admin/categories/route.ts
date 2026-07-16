import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const data = await req.json();
  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug ? slugify(data.slug) : slugify(data.name),
      image: data.image || null,
      description: data.description || null,
      sortOrder: Number(data.sortOrder) || 0,
      isActive: data.isActive !== false
    }
  });
  return NextResponse.json(category, { status: 201 });
}
