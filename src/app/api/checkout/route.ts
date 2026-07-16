import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { genOrderNumber } from "@/lib/utils";
import { z } from "zod";
import { getCustomerSession } from "@/lib/auth";

const itemSchema = z.object({ productId: z.string(), name: z.string(), image: z.string().optional(), price: z.number(), qty: z.number().min(1) });
const schema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(5),
  city: z.string().min(2),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cod", "jazzcash", "easypaisa", "payfast", "bank"]),
  items: z.array(itemSchema).min(1),
  shippingFee: z.number().default(0),
  discount: z.number().default(0)
});

// This endpoint creates the order record. For live gateways (JazzCash/EasyPaisa/PayFast),
// wire the redirect/HPP request here using the credentials saved in Admin > Payments,
// then redirect the customer and let the corresponding /api/webhooks/* route confirm payment.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const d = parsed.data;
  const subtotal = d.items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + d.shippingFee - d.discount;

  const session = await getCustomerSession();

  const order = await prisma.order.create({
    data: {
      orderNumber: genOrderNumber(),
      customerId: session ? session.sub : null,
      customerName: d.customerName,
      phone: d.phone,
      email: d.email || null,
      address: d.address,
      city: d.city,
      province: d.province || null,
      postalCode: d.postalCode || null,
      notes: d.notes || null,
      subtotal,
      shippingFee: d.shippingFee,
      discount: d.discount,
      total,
      paymentMethod: d.paymentMethod,
      paymentStatus: d.paymentMethod === "cod" ? "pending" : "unpaid",
      orderStatus: "processing",
      items: {
        create: d.items.map((i) => ({ productId: i.productId, name: i.name, image: i.image, price: i.price, qty: i.qty }))
      }
    }
  });

  return NextResponse.json({ ok: true, orderNumber: order.orderNumber, orderId: order.id });
}
