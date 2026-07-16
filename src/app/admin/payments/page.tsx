import { getSetting, DEFAULT_SETTINGS } from "@/lib/settings";
import PageHeader from "@/components/admin/PageHeader";
import PaymentsForm from "@/components/admin/PaymentsForm";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const payments = await getSetting("payments", DEFAULT_SETTINGS.payments);
  return (
    <div>
      <PageHeader title="Payment Gateways" subtitle="Connect Pakistan-based payment methods for checkout." />
      <PaymentsForm initial={payments} />
    </div>
  );
}
