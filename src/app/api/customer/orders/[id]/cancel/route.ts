import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Verify ownership
    const isOwner =
      order.customerId === session.sub ||
      (order.email && order.email.trim().toLowerCase() === session.email.trim().toLowerCase());

    if (!isOwner) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    // Validate status: can only cancel if status is processing/pending
    const cancellableStatuses = ["processing", "pending"];
    if (!cancellableStatuses.includes(order.orderStatus.toLowerCase())) {
      return NextResponse.json(
        { error: `This order cannot be cancelled because its status is '${order.orderStatus}'.` },
        { status: 400 }
      );
    }

    // Update status to cancelled
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        orderStatus: "cancelled"
      }
    });

    // Send confirmation email if email exists
    if (updatedOrder.email) {
      await sendEmail({
        to: updatedOrder.email,
        subject: `Order #${updatedOrder.orderNumber} Cancelled Successfully`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Your Order Has Been Cancelled</h2>
            <p>Hi ${updatedOrder.customerName},</p>
            <p>As requested, your order <strong>#${updatedOrder.orderNumber}</strong> has been cancelled successfully.</p>
            <p>If this was a mistake, or if you have any questions, please contact us.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>DEVINE ORA Support Team</strong></p>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("Order Cancellation Error:", error);
    return NextResponse.json({ error: error.message || "An error occurred." }, { status: 500 });
  }
}
