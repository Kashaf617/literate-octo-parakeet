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
}) {
  try {
    // 1. Fetch settings from DB
    const settingsRows = await prisma.setting.findMany({
      where: { key: { startsWith: "email_" } }
    });
    
    const settings = settingsRows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);

    const provider = settings.email_provider || "brevo";
    const fromName = settings.email_from_name || "DEVINE ORA";
    const fromEmail = settings.email_from_address || "devineora7@gmail.com";

    // 2. Route based on provider
    if (provider === "gmail") {
      const gmailUser = settings.email_gmail_user;
      const gmailPass = settings.email_gmail_pass;
      if (!gmailUser || !gmailPass) return console.error("Gmail SMTP config missing");

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      await transporter.sendMail({
        from: `"${fromName}" <${gmailUser}>`,
        to,
        subject,
        html: htmlContent,
        replyTo: replyTo ? `"${replyTo.name}" <${replyTo.email}>` : undefined,
      });
    }
    else if (provider === "smtp") {
      const host = settings.email_smtp_host;
      const port = parseInt(settings.email_smtp_port || "587");
      const user = settings.email_smtp_user;
      const pass = settings.email_smtp_pass;
      
      if (!host || !user || !pass) return console.error("Custom SMTP config missing");

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to,
        subject,
        html: htmlContent,
        replyTo: replyTo ? `"${replyTo.name}" <${replyTo.email}>` : undefined,
      });
    }
    else if (provider === "brevo") {
      const apiKey = settings.email_brevo_api_key;
      if (!apiKey) return console.error("Brevo API key missing");

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
      if (!response.ok) {
        console.error("Brevo error:", await response.text());
      }
    } 
    else if (provider === "mailgun") {
      const domain = settings.email_mailgun_domain;
      const apiKey = settings.email_mailgun_api_key;
      if (!domain || !apiKey) return console.error("Mailgun config missing");

      const formData = new URLSearchParams();
      formData.append("from", `${fromName} <${fromEmail}>`);
      formData.append("to", to);
      formData.append("subject", subject);
      formData.append("html", htmlContent);
      if (replyTo) {
        formData.append("h:Reply-To", `${replyTo.name} <${replyTo.email}>`);
      }

      const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      if (!response.ok) {
        console.error("Mailgun error:", await response.text());
      }
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
