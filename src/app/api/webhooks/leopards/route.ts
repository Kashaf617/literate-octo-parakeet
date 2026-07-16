import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Courier status webhook — maps Leopards tracking events to internal order status.
export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => ({}));
  const trackingNumber = payload.trackingNumber || payload.cn_number;
  const courierStatus: string = (payload.status || "").toLowerCase();

  const map: Record<string, string> = {
    booked: "confirmed",
    "picked up": "packed",
    "in transit": "shipped",
    delivered: "delivered",
    returned: "returned"
  };

  if (trackingNumber) {
    const order = await prisma.order.findFirst({ where: { trackingNumber } });
    if (order && map[courierStatus]) {
      await prisma.order.update({ where: { id: order.id }, data: { orderStatus: map[courierStatus] } });
    }
  }

  return NextResponse.json({ received: true });
}
