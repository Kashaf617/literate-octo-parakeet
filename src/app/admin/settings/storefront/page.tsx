import PageHeader from "@/components/admin/PageHeader";
import StorefrontSettingsForm from "@/components/admin/StorefrontSettingsForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StorefrontSettingsPage() {
  const settings = await prisma.setting.findMany();
  const dict = settings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div>
      <PageHeader title="Storefront Headings" subtitle="Customize the text headings displayed on the homepage." />
      <StorefrontSettingsForm initialSettings={dict} />
    </div>
  );
}
