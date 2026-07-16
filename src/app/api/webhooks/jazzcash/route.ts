import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Verify the signature/hash from jazzcash here using credentials in Admin > Payments
// before trusting this callback, per their integration docs.
export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => ({}));
  const orderNumber = payload.orderNumber || payload.txnRefNo || payload.orderRefNum;
  const success = payload.status === "success" || payload.responseCode === "000";

  if (orderNumber) {
    const order = await prisma.order.findUnique({ where: { orderNumber } });
    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: success ? "paid" : "failed", paymentRef: payload.txnRefNo || payload.transactionId || null }
      });
    }
  }

  return NextResponse.json({ received: true });
}
