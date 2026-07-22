import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import { genOrderNumber } from "@/lib/utils";

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();

  try {
    const body = await req.json();
    const {
      customerName,
      phone,
      email,
      address,
      city,
      province,
      postalCode,
      notes,
      items,
      shippingFee = 0,
      discount = 0,
      paymentMethod = "cod",
      paymentStatus = "pending",
      orderStatus = "processing"
    } = body;

    if (!customerName || !phone || !address || !city || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Customer Name, Phone, Address, City, and at least 1 Product Item are required." }, { status: 400 });
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.price) * Number(item.qty || 1)), 0);
    const total = subtotal + Number(shippingFee) - Number(discount);

    const order = await prisma.order.create({
      data: {
        orderNumber: genOrderNumber(),
        customerName: String(customerName).trim(),
        phone: String(phone).trim(),
        email: email ? String(email).trim() : null,
        address: String(address).trim(),
        city: String(city).trim(),
        province: province ? String(province).trim() : null,
        postalCode: postalCode ? String(postalCode).trim() : null,
        notes: notes ? String(notes).trim() : "Manual Admin Order",
        subtotal,
        shippingFee: Number(shippingFee),
        discount: Number(discount),
        total,
        paymentMethod: String(paymentMethod),
        paymentStatus: String(paymentStatus),
        orderStatus: String(orderStatus),
        items: {
          create: items.map((i: any) => ({
            name: String(i.name).trim(),
            price: Number(i.price),
            qty: Number(i.qty || 1),
            image: i.image ? String(i.image) : null,
            productId: i.productId ? String(i.productId) : null,
          }))
        }
      },
      include: { items: true }
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("Create manual order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

