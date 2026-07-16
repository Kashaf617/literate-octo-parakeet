import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const data = await req.json();
  const article = await prisma.article.create({
    data: {
      title: data.title || "New Article",
      slug: data.slug || "new-article-" + Date.now(),
      content: data.content || "",
      excerpt: data.excerpt || "",
      image: data.image || null,
      category: data.category || "Blog",
      author: data.author || "Admin",
      published: data.published ?? true
    }
  });
  return NextResponse.json(article);
}
