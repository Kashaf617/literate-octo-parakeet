import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(orders);
}
