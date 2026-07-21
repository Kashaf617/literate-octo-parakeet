import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 1. Save to Database
    const newMessage = await prisma.contactMessage.create({
      data: {
        firstName,
        lastName,
        email,
        message,
      },
    });

    // 2. Prepare Email Notifications
    const adminEmail = process.env.ADMIN_EMAIL || "devineora7@gmail.com";

    const adminEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #0b1221; background-color: #ffffff;">
        <h2 style="font-weight: 800; border-bottom: 2px solid #C9A227; padding-bottom: 12px; margin-top: 0; color: #0b1221;">📩 New Customer Inquiry Received</h2>
        <p style="color: #475569; font-size: 14px;">You have received a new contact message from your storefront.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; font-weight: bold; width: 130px; border: 1px solid #e2e8f0;">Customer Name:</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Customer Email:</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${email}" style="color: #c9a227; font-weight: bold;">${email}</a></td>
          </tr>
        </table>

        <div style="background-color: #faf5e6; border-left: 4px solid #C9A227; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #8a6d1c;">Message Query:</h4>
          <p style="margin: 0; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${message}</p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          💡 <strong>Tip:</strong> Simply reply directly to this email to respond to <strong>${firstName}</strong> (${email}).
        </p>
      </div>
    `;

    const customerEmailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1eec8; border-radius: 12px; padding: 24px; color: #0b1221; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #C9A227; padding-bottom: 15px; margin-bottom: 20px;">
          <h1 style="color: #111827; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;">DEVINE ORA</h1>
          <p style="color: #c9a227; margin: 5px 0 0 0; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;">Luxury Timepieces</p>
        </div>
        <h2 style="font-size: 18px; color: #0b1221; margin-top: 0;">We Received Your Message, ${firstName}!</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Thank you for reaching out to DEVINE ORA. Our support team has received your query and will reply to you shortly.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 5px 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Your Submitted Query:</p>
          <p style="margin: 0; font-size: 13px; color: #334155; font-style: italic;">"${message}"</p>
        </div>
        <p style="font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 20px;">
          DEVINE ORA Customer Concierge • <a href="mailto:devineora7@gmail.com" style="color: #c9a227; text-decoration: none;">devineora7@gmail.com</a>
        </p>
      </div>
    `;

    // 3. Await sending both emails using Promise.allSettled so Vercel Serverless Function does not kill execution
    await Promise.allSettled([
      sendEmail({
        to: adminEmail,
        subject: `📩 New Customer Query from ${firstName} ${lastName}`,
        htmlContent: adminEmailHtml,
        replyTo: { name: `${firstName} ${lastName}`, email }
      }),
      sendEmail({
        to: email,
        subject: `We Received Your Message — DEVINE ORA Support`,
        htmlContent: customerEmailHtml
      })
    ]);

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error("Error processing contact message:", error);
    return NextResponse.json(
      { error: "Failed to process message. Please try again later." },
      { status: 500 }
    );
  }
}
