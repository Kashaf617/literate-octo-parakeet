import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(banners);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const data = await req.json();
  const banner = await prisma.banner.create({
    data: {
      title: data.title,
      subtitle: data.subtitle || null,
      eyebrow: data.eyebrow || null,
      image: data.image,
      mobileImage: data.mobileImage || null,
      link: data.link || "#",
      position: data.position || "hero",
      bgColorFrom: data.bgColorFrom || "#0f2542",
      bgColorTo: data.bgColorTo || "#173963",
      textColor: data.textColor || "#ffffff",
      buttonText: data.buttonText || "Shop Now",
      sortOrder: Number(data.sortOrder) || 0,
      isActive: data.isActive !== false,
      collectionId: data.collectionId || null
    }
  });
  return NextResponse.json(banner, { status: 201 });
}
