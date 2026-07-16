import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, title, content } = await req.json();

    if (!productId || !rating || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        customerId: session.sub as string,
        rating: Number(rating),
        title,
        content,
        status: "pending" // Always pending by default for admin moderation
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
