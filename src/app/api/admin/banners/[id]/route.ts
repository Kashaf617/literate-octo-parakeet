import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  const data = await req.json();
  
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
  if (data.eyebrow !== undefined) updateData.eyebrow = data.eyebrow;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.mobileImage !== undefined) updateData.mobileImage = data.mobileImage;
  if (data.link !== undefined) updateData.link = data.link;
  if (data.position !== undefined) updateData.position = data.position;
  if (data.bgColorFrom !== undefined) updateData.bgColorFrom = data.bgColorFrom;
  if (data.bgColorTo !== undefined) updateData.bgColorTo = data.bgColorTo;
  if (data.textColor !== undefined) updateData.textColor = data.textColor;
  if (data.buttonText !== undefined) updateData.buttonText = data.buttonText;
  if (data.sortOrder !== undefined) updateData.sortOrder = Number(data.sortOrder);
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.collectionId !== undefined) updateData.collectionId = data.collectionId;

  if (params.id.startsWith('demo-')) {
    // Instantiate a demo banner as a real one
    let position = "hero";
    if (params.id.includes('promo')) position = "promo";
    if (params.id.includes('strip')) position = "strip";
    
    const banner = await prisma.banner.create({
      data: {
        title: updateData.title || "New Banner",
        subtitle: updateData.subtitle,
        eyebrow: updateData.eyebrow,
        image: updateData.image || "/placeholder.png",
        mobileImage: updateData.mobileImage,
        link: updateData.link || "#",
        position: position,
        bgColorFrom: updateData.bgColorFrom || "#1f2937",
        bgColorTo: updateData.bgColorTo || "#0b1221",
        textColor: updateData.textColor || "#ffffff",
        buttonText: updateData.buttonText || "Shop Now",
        sortOrder: 0,
        isActive: true
      }
    });
    return NextResponse.json(banner);
  }

  const banner = await prisma.banner.update({
    where: { id: params.id },
    data: updateData
  });
  return NextResponse.json(banner);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  await prisma.banner.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
