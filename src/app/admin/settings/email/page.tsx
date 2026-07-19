import PageHeader from "@/components/admin/PageHeader";
import EmailSettingsForm from "@/components/admin/EmailSettingsForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EmailSettingsPage() {
  const settings = await prisma.setting.findMany({
    where: { key: { startsWith: "email_" } }
  });
  
  const dict = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div>
      <PageHeader title="Email Settings" subtitle="Configure transactional email providers (Brevo, Mailgun, Gmail SMTP, or Custom SMTP)." />
      <EmailSettingsForm initialSettings={dict} />
    </div>
  );
}
