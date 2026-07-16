import { cx } from "@/lib/utils";

const MAP: Record<string, string> = {
  processing: "bg-blue-50 text-brand",
  confirmed: "bg-indigo-50 text-indigo-600",
  packed: "bg-amber-50 text-amber-600",
  shipped: "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-success",
  cancelled: "bg-red-50 text-danger",
  returned: "bg-gray-100 text-gray-600",
  pending: "bg-amber-50 text-amber-600",
  paid: "bg-green-50 text-success",
  failed: "bg-red-50 text-danger",
  refunded: "bg-gray-100 text-gray-600",
  active: "bg-green-50 text-success",
  draft: "bg-gray-100 text-gray-600",
  archived: "bg-red-50 text-danger"
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cx("inline-block text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full", MAP[status] || "bg-gray-100 text-gray-600")}>
      {status}
    </span>
  );
}
