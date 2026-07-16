import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code || typeof cartTotal !== "number") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }

    if (coupon.minSpend && cartTotal < coupon.minSpend) {
      return NextResponse.json({ error: `You must spend at least PKR ${coupon.minSpend.toLocaleString()} to use this code` }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = cartTotal * (coupon.value / 100);
    } else {
      discountAmount = coupon.value;
    }

    // Ensure we don't discount more than the cart total
    if (discountAmount > cartTotal) discountAmount = cartTotal;

    return NextResponse.json({ success: true, discountAmount, coupon });
  } catch (error) {
    console.error("Failed to apply coupon:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
