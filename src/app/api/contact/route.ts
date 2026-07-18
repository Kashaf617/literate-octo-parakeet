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

    // 2. Send email notification to store owner (Gmail)
    const fromAddressSetting = await prisma.setting.findUnique({
      where: { key: "email_from_address" },
    });
    const adminEmail = fromAddressSetting?.value || "devineora7@gmail.com";

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; color: #0b1221;">
        <h2 style="font-weight: 800; border-bottom: 2px solid #C9A227; padding-bottom: 12px; margin-top: 0;">New Contact Message Received</h2>
        <p>You have received a new message from the contact form on your storefront.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; font-weight: bold; width: 130px; border: 1px solid #e2e8f0;">First Name:</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${firstName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Last Name:</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;">${lastName}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2e8f0;">Email:</td>
            <td style="padding: 10px; border: 1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
        </table>

        <div style="background-color: #faf5e6; border-left: 4px solid #C9A227; padding: 15px; border-radius: 4px; margin-top: 20px;">
          <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #8a6d1c;">Message:</h4>
          <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>

        <p style="margin-top: 30px; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          💡 <strong>Tip:</strong> Simply click <strong>Reply</strong> in your email client to email this customer directly.
        </p>
      </div>
    `;

    // Send the email with a Reply-To header pointing to the customer
    await sendEmail({
      to: adminEmail,
      subject: `New Message from ${firstName} ${lastName} (Devine Ora Contact)`,
      htmlContent: emailHtml,
      replyTo: { name: `${firstName} ${lastName}`, email }
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: any) {
    console.error("Error processing contact message:", error);
    return NextResponse.json(
      { error: "Failed to process message. Please try again later." },
      { status: 500 }
    );
  }
}
