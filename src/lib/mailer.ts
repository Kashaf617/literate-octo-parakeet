import { prisma } from "./prisma";

export async function sendEmail({ to, subject, htmlContent }: { to: string; subject: string; htmlContent: string }) {
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
    if (provider === "brevo") {
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
