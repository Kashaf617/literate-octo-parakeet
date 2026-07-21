import { prisma } from "./prisma";
import nodemailer from "nodemailer";

export async function sendEmail({ 
  to, 
  subject, 
  htmlContent, 
  replyTo 
}: { 
  to: string; 
  subject: string; 
  htmlContent: string; 
  replyTo?: { name: string; email: string } 
}): Promise<{ success: boolean; message?: string; providerUsed?: string }> {
  try {
    // 1. Fetch email settings from DB
    const settingsRows = await prisma.setting.findMany({
      where: { key: { startsWith: "email_" } }
    });
    
    const settings = settingsRows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);

    const activeProvider = settings.email_provider || "gmail";
    const fromName = settings.email_from_name || "DEVINE ORA";
    const fromEmail = settings.email_from_address || settings.email_gmail_user || "devineora7@gmail.com";

    // Clean Gmail App Password (remove all whitespace spaces)
    const gmailUser = settings.email_gmail_user?.trim();
    const gmailPass = (settings.email_gmail_pass || "").replace(/\s+/g, "").trim();

    // Provider order based on selection, with automatic fallback
    const providerQueue: string[] = [];
    const isGmailAddress = fromEmail.toLowerCase().includes("@gmail.com");

    if (isGmailAddress && gmailUser && gmailPass) {
      providerQueue.push("gmail");
    }
    if (!providerQueue.includes(activeProvider)) {
      providerQueue.push(activeProvider);
    }
    if (!providerQueue.includes("gmail") && gmailUser && gmailPass) providerQueue.push("gmail");
    if (!providerQueue.includes("brevo") && settings.email_brevo_api_key) providerQueue.push("brevo");
    if (!providerQueue.includes("smtp") && settings.email_smtp_host) providerQueue.push("smtp");

    let lastError = "";

    for (const provider of providerQueue) {
      // ---------------- GMAIL SMTP ----------------
      if (provider === "gmail") {
        if (!gmailUser || !gmailPass) {
          lastError = "Gmail credentials missing";
          continue;
        }

        try {
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: gmailUser,
              pass: gmailPass,
            },
          });

          const info = await transporter.sendMail({
            from: `"${fromName}" <${gmailUser}>`,
            to,
            subject,
            html: htmlContent,
            replyTo: replyTo ? `"${replyTo.name}" <${replyTo.email}>` : undefined,
          });

          console.log(`[Mailer] Successfully sent email to ${to} via Gmail SMTP (${info.messageId})`);
          return { success: true, providerUsed: "Gmail SMTP", message: `MessageId: ${info.messageId}` };
        } catch (err: any) {
          console.error("[Mailer] Gmail SMTP Error:", err.message);
          lastError = `Gmail SMTP: ${err.message}`;
        }
      }

      // ---------------- CUSTOM SMTP ----------------
      if (provider === "smtp") {
        const host = settings.email_smtp_host;
        const port = parseInt(settings.email_smtp_port || "587");
        const user = settings.email_smtp_user;
        const pass = settings.email_smtp_pass;
        
        if (!host || !user || !pass) {
          lastError = "Custom SMTP credentials missing";
          continue;
        }

        try {
          const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass },
          });

          const info = await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            html: htmlContent,
            replyTo: replyTo ? `"${replyTo.name}" <${replyTo.email}>` : undefined,
          });

          console.log(`[Mailer] Successfully sent email to ${to} via Custom SMTP (${info.messageId})`);
          return { success: true, providerUsed: "Custom SMTP", message: `MessageId: ${info.messageId}` };
        } catch (err: any) {
          console.error("[Mailer] Custom SMTP Error:", err.message);
          lastError = `Custom SMTP: ${err.message}`;
        }
      }

      // ---------------- BREVO API ----------------
      if (provider === "brevo") {
        const apiKey = settings.email_brevo_api_key;
        if (!apiKey) {
          lastError = "Brevo API key missing";
          continue;
        }

        try {
          const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
              "accept": "application/json",
              "api-key": apiKey,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              sender: { name: fromName, email: fromEmail },
              to: [{ email: to }],
              replyTo: replyTo ? { name: replyTo.name, email: replyTo.email } : undefined,
              subject,
              htmlContent,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`[Mailer] Successfully sent email to ${to} via Brevo API`);
            return { success: true, providerUsed: "Brevo API", message: JSON.stringify(data) };
          } else {
            const errText = await response.text();
            console.error("[Mailer] Brevo API Error:", errText);
            lastError = `Brevo API: ${errText}`;
          }
        } catch (err: any) {
          console.error("[Mailer] Brevo exception:", err.message);
          lastError = `Brevo API: ${err.message}`;
        }
      }
    }

    return { success: false, message: lastError || "No email provider configured or all providers failed." };
  } catch (error: any) {
    console.error("[Mailer] Exception in sendEmail:", error);
    return { success: false, message: error.message };
  }
}
