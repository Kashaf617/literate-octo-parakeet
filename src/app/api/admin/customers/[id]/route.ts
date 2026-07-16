import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin(req))) return unauthorized();

  try {
    const { isBlocked } = await req.json();
    
    if (typeof isBlocked !== "boolean") {
      return NextResponse.json({ error: "isBlocked must be a boolean value" }, { status: 400 });
    }

    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: { isBlocked }
    });

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update customer status" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin(req))) return unauthorized();

  try {
    await prisma.customer.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
