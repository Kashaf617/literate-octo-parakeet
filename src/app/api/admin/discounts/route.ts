import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();

    if (!data.code || !data.type || data.value === undefined) {
      return NextResponse.json({ error: "Code, Type, and Value are required" }, { status: 400 });
    }

    const exists = await prisma.coupon.findUnique({ where: { code: data.code.toUpperCase().trim() } });
    if (exists) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase().trim(),
        type: data.type,
        value: data.value,
        minSpend: data.minSpend || null,
        usageLimit: data.usageLimit || null
      }
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error("Failed to create coupon:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    await prisma.coupon.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
