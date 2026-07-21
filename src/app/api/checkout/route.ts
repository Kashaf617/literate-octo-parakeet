import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { genOrderNumber } from "@/lib/utils";
import { z } from "zod";
import { getCustomerSession } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";

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

  // Send Order Confirmation Email to Customer & Notification to Store Admin
  const adminEmail = process.env.ADMIN_EMAIL || "devineora7@gmail.com";

  const emailPromises: Promise<any>[] = [];

  // Customer Email
  if (order.email) {
    emailPromises.push(
      sendEmail({
        to: order.email,
        subject: `Order Confirmation - #${order.orderNumber}`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f1eec8; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
            <div style="text-align: center; border-bottom: 2px solid #C9A227; padding-bottom: 15px; margin-bottom: 20px;">
              <h1 style="color: #111827; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;">DEVINE ORA</h1>
              <p style="color: #c9a227; margin: 5px 0 0 0; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;">Luxury Timepieces</p>
            </div>
            
            <h2 style="color: #111827; font-size: 18px; margin-top: 0;">Thank you for your order, ${order.customerName}!</h2>
            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
              Your order <strong>#${order.orderNumber}</strong> has been successfully placed. We are preparing it for shipment and will notify you when it's on its way.
            </p>
            
            <div style="background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-top: 0; margin-bottom: 10px;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid #e2e8f0; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b;">
                    <th style="padding-bottom: 8px; font-weight: bold;">Item</th>
                    <th style="padding-bottom: 8px; text-align: center; font-weight: bold;">Qty</th>
                    <th style="padding-bottom: 8px; text-align: right; font-weight: bold;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${d.items.map(item => `
                    <tr style="border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #334155;">
                      <td style="padding: 10px 0;">${item.name}</td>
                      <td style="padding: 10px 0; text-align: center;">${item.qty}</td>
                      <td style="padding: 10px 0; text-align: right; font-weight: 500;">PKR ${item.price.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <div style="margin-top: 15px; text-align: right; font-size: 13px; color: #475569; line-height: 1.6;">
                <div>Subtotal: <span style="font-weight: 600; color: #1e293b;">PKR ${subtotal.toLocaleString()}</span></div>
                <div>Shipping Fee: <span style="font-weight: 600; color: #1e293b;">PKR ${d.shippingFee.toLocaleString()}</span></div>
                ${d.discount > 0 ? `<div>Discount: <span style="font-weight: 600; color: #dc2626;">-PKR ${d.discount.toLocaleString()}</span></div>` : ''}
                <div style="font-size: 16px; font-weight: 800; color: #c9a227; border-top: 1px solid #e2e8f0; margin-top: 10px; padding-top: 10px;">
                  Total: PKR ${total.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div style="font-size: 12px; color: #64748b; line-height: 1.6; border-top: 1px solid #f1f5f9; padding-top: 15px;">
              <p style="margin: 0 0 5px 0;"><strong>Shipping Details:</strong></p>
              <p style="margin: 0 0 15px 0; color: #334155;">
                ${order.customerName}<br/>
                ${order.address}<br/>
                ${order.city}, ${order.province || ''}<br/>
                Phone: ${order.phone}
              </p>
              <p style="margin: 0 0 5px 0;"><strong>Payment Method:</strong> ${d.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : d.paymentMethod.toUpperCase()}</p>
            </div>
          </div>
        `
      })
    );
  }

  // Always send Admin Notification Email
  emailPromises.push(
    sendEmail({
      to: adminEmail,
      subject: `🚨 NEW ORDER RECEIVED - #${order.orderNumber} (PKR ${total.toLocaleString()})`,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0b1221; margin-top: 0;">New Order #${order.orderNumber}</h2>
          <p style="font-size: 14px; color: #334155;"><strong>Customer Name:</strong> ${order.customerName}</p>
          <p style="font-size: 14px; color: #334155;"><strong>Phone:</strong> ${order.phone}</p>
          <p style="font-size: 14px; color: #334155;"><strong>Email:</strong> ${order.email || 'Not provided'}</p>
          <p style="font-size: 14px; color: #334155;"><strong>Address:</strong> ${order.address}, ${order.city}</p>
          <p style="font-size: 16px; font-weight: bold; color: #c9a227;"><strong>Total Amount:</strong> PKR ${total.toLocaleString()} (COD)</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;" />
          <p style="font-size: 13px; color: #64748b;">Log in to your Admin Dashboard to manage and process this order.</p>
        </div>
      `
    })
  );

  // Await all email promises so Vercel Serverless Lambda does not kill execution prematurely
  await Promise.allSettled(emailPromises);

  return NextResponse.json({ ok: true, orderNumber: order.orderNumber, orderId: order.id });
}
