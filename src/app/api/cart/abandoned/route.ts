import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, cartData } = await req.json();

    if (!email || !cartData) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Upsert the abandoned cart for this email
    // If they already have an abandoned cart, update it. If not, create it.
    const existing = await prisma.abandonedCart.findFirst({
      where: { email }
    });

    const serializedCart = typeof cartData === "string" ? cartData : JSON.stringify(cartData);

    if (existing) {
      await prisma.abandonedCart.update({
        where: { id: existing.id },
        data: { cartData: serializedCart, status: "abandoned" }
      });
    } else {
      await prisma.abandonedCart.create({
        data: { email, cartData: serializedCart }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track abandoned cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
