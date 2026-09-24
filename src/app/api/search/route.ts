import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        status: "active",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        images: true,
        category: {
          select: { name: true }
        }
      },
      take: 5
    });

    // Parse images array for frontend
    const formattedProducts = products.map((p) => {
      let parsedImages = [];
      try {
        parsedImages = JSON.parse(p.images);
      } catch (e) {}
      
      return {
        ...p,
        image: parsedImages[0] || null
      };
    });

    return NextResponse.json({ products: formattedProducts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
