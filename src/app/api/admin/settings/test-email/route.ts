import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, unauthorized } from "@/lib/api-auth";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return unauthorized();

  try {
    const { testEmail } = await req.json();
    if (!testEmail || !testEmail.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const result = await sendEmail({
      to: testEmail,
      subject: "DEVINE ORA — Email System Test",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #ffffff;">
          <h2 style="color: #0b1221; margin-bottom: 12px;">DEVINE ORA Email System</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Congratulations! Your email system is working perfectly. Transactional order emails, status updates, and contact form messages will be sent automatically.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 12px;">
            Sent automatically from your DEVINE ORA Store Admin.
          </p>
        </div>
      `
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: `Email sent via ${result.providerUsed || "configured provider"}!` });
    } else {
      return NextResponse.json({ error: result.message || "Failed to send email." }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
