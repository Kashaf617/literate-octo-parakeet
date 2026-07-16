import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import { slugify } from "@/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  const data = await req.json();
  
  const updateData: any = {};
  if (data.name !== undefined) {
    updateData.name = data.name;
    if (data.slug === undefined) {
      updateData.slug = slugify(data.name);
    }
  }
  if (data.slug !== undefined) updateData.slug = slugify(data.slug);
  if (data.image !== undefined) updateData.image = data.image;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.sortOrder !== undefined) updateData.sortOrder = Number(data.sortOrder);
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const category = await prisma.category.update({
    where: { id: params.id },
    data: updateData
  });
  return NextResponse.json(category);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
