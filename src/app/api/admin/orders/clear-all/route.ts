import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();

  try {
    // Delete all order items first to satisfy relational integrity
    await prisma.orderItem.deleteMany();
    // Delete all orders
    const deleted = await prisma.order.deleteMany();

    return NextResponse.json({
      success: true,
      message: `Successfully cleared ${deleted.count} test orders from the database.`
    });
  } catch (error: any) {
    console.error("Clear orders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
