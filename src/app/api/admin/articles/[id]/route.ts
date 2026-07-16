import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  const data = await req.json();
  const article = await prisma.article.update({
    where: { id: params.id },
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      image: data.image,
      category: data.category,
      author: data.author,
      published: data.published
    }
  });
  return NextResponse.json(article);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  await prisma.article.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
