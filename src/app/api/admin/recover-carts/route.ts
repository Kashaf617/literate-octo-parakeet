import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Find all abandoned carts
    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: { status: "abandoned" }
    });

    if (abandonedCarts.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    let sentCount = 0;

    // In a production environment, you would use a queue here.
    // For this prototype, we'll just map over them.
    for (const cart of abandonedCarts) {
      try {
        const items = JSON.parse(cart.cartData);
        const itemHtml = items.map((it: any) => `
          <div style="display: flex; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <div style="flex: 1;">
              <p style="margin: 0; font-weight: bold;">${it.name}</p>
              <p style="margin: 5px 0 0; color: #666;">Qty: ${it.qty} x PKR ${it.price.toLocaleString()}</p>
            </div>
          </div>
        `).join('');

        await sendEmail({
          to: cart.email,
          subject: "Did you forget something? 🛒",
          htmlContent: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e6eaf1; border-radius: 10px;">
              <h2 style="color: #122043;">You left some great items in your cart!</h2>
              <p style="color: #6b7688; line-height: 1.5;">We noticed you were halfway through your purchase. Good news—we've saved your cart for you!</p>
              <div style="background-color: #f6f8fb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                ${itemHtml}
              </div>
              <a href="http://localhost:3000/cart" style="display: inline-block; background-color: #1f6fdb; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; text-transform: uppercase; font-size: 13px;">Complete Your Purchase</a>
              <p style="color: #8e9bb0; font-size: 11px; margin-top: 20px;">If you have any questions, reply to this email. We're here to help.</p>
            </div>
          `
        });

        // Mark as recovered
        await prisma.abandonedCart.update({
          where: { id: cart.id },
          data: { status: "recovered" }
        });

        sentCount++;
      } catch (e) {
        console.error("Failed to send recovery email to", cart.email, e);
      }
    }

    return NextResponse.json({ success: true, count: sentCount });
  } catch (error) {
    console.error("Failed to recover carts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
