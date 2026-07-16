import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import PageHeader from "@/components/admin/PageHeader";
import LogisticsForm from "@/components/admin/LogisticsForm";

export const dynamic = "force-dynamic";

export default async function LogisticsPage() {
  const logistics = await getSetting("logistics", DEFAULT_SETTINGS.logistics);
  return (
    <div>
      <PageHeader title="Logistics & Couriers" subtitle="Connect Pakistan-based courier companies for order fulfillment." />
      <LogisticsForm initial={logistics} />
    </div>
  );
}
