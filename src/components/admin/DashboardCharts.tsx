"use client";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from "recharts";

const COLORS = ["#1f6fdb", "#2fa84f", "#f5921f", "#7b5df0", "#e0362c", "#f5a623"];

export function RevenueChart({ data }: { data: { day: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1f6fdb" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#1f6fdb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6eaf1" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6b7688" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7688" }} axisLine={false} tickLine={false} width={40} />
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e6eaf1", fontSize: 12 }} />
        <Area type="monotone" dataKey="revenue" stroke="#1f6fdb" strokeWidth={2.5} fill="url(#rev)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function OrderStatusPie({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e6eaf1", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TopProductsBar({ data }: { data: { name: string; sold: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6eaf1" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7688" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11.5, fill: "#1b2436" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e6eaf1", fontSize: 12 }} />
        <Bar dataKey="sold" fill="#1f6fdb" radius={[0, 6, 6, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CategorySalesPie({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(value: number) => `PKR ${value.toLocaleString()}`} contentStyle={{ borderRadius: 10, border: "1px solid #e6eaf1", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function InventoryHealthBar({ data }: { data: { name: string; stock: number; sold: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e6eaf1" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7688" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11.5, fill: "#1b2436" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e6eaf1", fontSize: 12 }} />
        <Bar dataKey="stock" name="Remaining Stock" fill="#e0362c" radius={[0, 6, 6, 0]} barSize={10} />
        <Bar dataKey="sold" name="Units Sold" fill="#1f6fdb" radius={[0, 6, 6, 0]} barSize={10} />
      </BarChart>
    </ResponsiveContainer>
  );
}
