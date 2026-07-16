export default function StatCard({ label, value, sub, tone = "brand" }: { label: string; value: string; sub?: string; tone?: "brand" | "success" | "warn" | "danger"; }) {
  const toneMap: Record<string, string> = {
    brand: "from-brand to-brand-dark",
    success: "from-success to-[#1f7a38]",
    warn: "from-warn to-[#c9700f]",
    danger: "from-danger to-[#a3241c]"
  };
  return (
    <div className="admin-card relative overflow-hidden">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${toneMap[tone]} opacity-10`} />
      <div className="text-sub text-xs font-bold uppercase tracking-wide mb-2">{label}</div>
      <div className="text-2xl font-extrabold text-ink">{value}</div>
      {sub && <div className="text-[12px] text-success font-semibold mt-1">{sub}</div>}
    </div>
  );
}
