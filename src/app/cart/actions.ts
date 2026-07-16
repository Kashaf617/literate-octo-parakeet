"use server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { getCustomerSession } from "@/lib/auth";

export async function createOrder(data: {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  total: number;
  couponCode?: string;
  discountAmount?: number;
  paymentMethod?: string; // 'cod' | 'advance'
  items: Array<{
    productId?: string | null;
    name: string;
    price: number;
    qty: number;
    image?: string | null;
  }>;
}) {
  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const session = await getCustomerSession();

  // Resolve advance payment discount from DB settings
  let finalTotal = data.total;
  const paymentMethod = data.paymentMethod || "cod";
  if (paymentMethod === "advance") {
    const setting = await prisma.setting.findUnique({ where: { key: "advance_payment_discount" } });
    const discount = setting ? parseFloat(setting.value) || 0 : 200;
    finalTotal = Math.max(0, finalTotal - discount);
  }
  
  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: session ? session.sub : null,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      province: data.province,
      postalCode: data.postalCode,
      subtotal: data.total,
      total: finalTotal,
      paymentMethod: paymentMethod,
      items: {
        create: data.items.map(item => ({
          productId: item.productId || null,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image || null
        }))
      }
    }
  });

  // If a coupon was used, increment its usageCount
  if (data.couponCode) {
    try {
      await prisma.coupon.update({
        where: { code: data.couponCode },
        data: { usageCount: { increment: 1 } }
      });
    } catch (e) {
      console.error("Failed to increment coupon usage:", e);
    }
  }

  // Delete any abandoned cart drafts for this email now that they purchased!
  if (data.email) {
    await prisma.abandonedCart.deleteMany({
      where: { email: data.email }
    });
  }

  // Send transactional email if user provided an email
  if (data.email) {
    await sendEmail({
      to: data.email,
      subject: `Order Confirmation #${orderNumber}`,
      htmlContent: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Thank you for your order!</h2>
          <p>Hi ${data.customerName},</p>
          <p>We've received your order <strong>#${orderNumber}</strong> and it is now being processed.</p>
          <p><strong>Total:</strong> PKR ${data.total.toFixed(2)}</p>
          <p><strong>Shipping Address:</strong><br/>
            ${data.address}<br/>
            ${data.city}, ${data.province}
          </p>
          <p>We'll notify you once it ships!</p>
        </div>
      `
    });
  }

  return { success: true, orderId: order.id, orderNumber };
}
