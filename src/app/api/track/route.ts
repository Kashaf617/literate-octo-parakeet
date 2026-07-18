import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, contact } = await req.json();

    if (!orderNumber || !contact) {
      return NextResponse.json({ error: "Order number and contact detail are required" }, { status: 400 });
    }

    const cleanOrderNumber = orderNumber.trim().toUpperCase().replace("#", "");
    const cleanContact = contact.trim().toLowerCase();

    // Query order including items
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: cleanOrderNumber,
      },
      include: {
        items: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify contact matches either email or phone
    const dbEmail = order.email ? order.email.toLowerCase() : "";
    const dbPhone = order.phone ? order.phone.replace(/\s+/g, "") : "";
    const inputContact = cleanContact.replace(/\s+/g, "");

    const isEmailMatch = dbEmail && dbEmail === cleanContact;
    const isPhoneMatch = dbPhone && dbPhone.includes(inputContact) || inputContact.includes(dbPhone);

    if (!isEmailMatch && !isPhoneMatch) {
      return NextResponse.json({ error: "Incorrect contact detail for this order" }, { status: 403 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order tracking error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
