import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";

export async function GET() {
  try {
    const celebrities = await prisma.celebrityRecommendation.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json(celebrities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  try {
    const data = await req.json();
    const newCelebrity = await prisma.celebrityRecommendation.create({
      data: {
        name: data.name,
        image: data.image || null,
        videoUrl: data.videoUrl || null,
        productId: data.productId || null,
        sortOrder: data.sortOrder || 0,
        isActive: data.isActive !== false,
      }
    });
    return NextResponse.json(newCelebrity, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
