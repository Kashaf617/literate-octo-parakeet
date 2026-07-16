import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import PageHeader from "@/components/admin/PageHeader";
import GeneralSettingsForm from "@/components/admin/GeneralSettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const general = await getSetting("general", DEFAULT_SETTINGS.general);
  return (
    <div>
      <PageHeader title="Store Settings" subtitle="Basic store information used across the storefront." />
      <GeneralSettingsForm initial={general} />
    </div>
  );
}
