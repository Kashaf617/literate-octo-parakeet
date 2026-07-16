import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import { sendEmail } from "@/lib/mailer";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { items: true } });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return unauthorized();
  const data = await req.json();
  const oldOrder = await prisma.order.findUnique({ where: { id: params.id } });
  
  const order = await prisma.order.update({
    where: { id: params.id },
    data: {
      orderStatus: data.orderStatus,
      paymentStatus: data.paymentStatus,
      courierProvider: data.courierProvider || null,
      trackingNumber: data.trackingNumber || null,
      notes: data.notes || null
    }
  });

  if (oldOrder && oldOrder.orderStatus !== data.orderStatus && order.email) {
    if (data.orderStatus === "shipped") {
      await sendEmail({
        to: order.email,
        subject: `Your Order #${order.orderNumber} has been shipped!`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Great news, ${order.customerName}!</h2>
            <p>Your order <strong>#${order.orderNumber}</strong> has been shipped via <strong>${data.courierProvider || 'Courier'}</strong>.</p>
            ${data.trackingNumber ? `<p>Tracking Number: <strong>${data.trackingNumber}</strong></p>` : ''}
            <p>You can expect delivery soon.</p>
          </div>
        `
      });
    } else if (data.orderStatus === "cancelled") {
      await sendEmail({
        to: order.email,
        subject: `Order Cancelled - #${order.orderNumber}`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Order Cancelled</h2>
            <p>Hi ${order.customerName},</p>
            <p>Your order <strong>#${order.orderNumber}</strong> has been cancelled.</p>
            <p>If you have any questions, please contact support.</p>
          </div>
        `
      });
    }
  }

  return NextResponse.json(order);
}
