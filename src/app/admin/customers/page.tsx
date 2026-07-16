"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/admin/PageHeader";
import { Search, ShieldAlert, UserX, UserCheck, Trash2, Shield, Calendar, ShoppingBag, Loader2 } from "lucide-react";
import { cx } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  isBlocked: boolean;
  createdAt: string;
  _count: {
    orders: number;
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Fetch customers
  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  // Toggle block status
  async function handleToggleBlock(id: string, currentStatus: boolean) {
    if (!confirm(`Are you sure you want to ${currentStatus ? "UNBLOCK" : "BLOCK"} this customer?`)) {
      return;
    }

    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !currentStatus })
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      // Update local state
      setCustomers(customers.map(c => c.id === id ? { ...c, isBlocked: !currentStatus } : c));
    } catch (err: any) {
      alert(err.message || "Failed to update customer status");
    } finally {
      setActionLoadingId(null);
    }
  }

  // Delete customer
  async function handleDeleteCustomer(id: string) {
    if (!confirm("WARNING: Are you sure you want to PERMANENTLY delete this customer? This will delete their account details and is irreversible.")) {
      return;
    }

    try {
      setActionLoadingId(id);
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete customer");
      
      // Remove from state
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete customer");
    } finally {
      setActionLoadingId(null);
    }
  }

  // Filter customers based on search
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.city && c.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Customer Management" 
        subtitle="Manage registered shopper accounts, monitor access control, and suspend/remove users."
      />

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name, email, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 text-[13px] transition-all"
          />
        </div>
        <div className="text-[12px] font-medium text-gray-500 font-mono">
          Total Shoppers: {customers.length}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-500 rounded-xl p-4 text-[13px] font-medium flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Table view */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
            <span className="text-[13px] font-medium text-gray-400">Loading shoppers database...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-24 text-center">
            <UserX className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-bold text-gray-700 mb-1">No Customers Found</h3>
            <p className="text-xs text-gray-400 max-w-[280px] mx-auto">
              {search ? "No matches found for your search query. Try checking spelling." : "No customer accounts have registered yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Shopper Details</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Location</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Joined Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Orders</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Access Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* User profile details */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <div className={cx(
                          "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                          customer.isBlocked ? "bg-red-50 text-red-500" : "bg-brand/10 text-brand"
                        )}>
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-bold text-gray-900 truncate">{customer.name}</span>
                          <span className="text-[11px] text-gray-400 truncate font-mono">{customer.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Location detail */}
                    <td className="px-6 py-4.5">
                      <div className="flex flex-col text-[12px]">
                        <span className="text-gray-700 font-medium">
                          {customer.city ? `${customer.city}, ${customer.province || ""}` : "Not Specified"}
                        </span>
                        {customer.phone && (
                          <span className="text-gray-400 font-mono text-[10px]">{customer.phone}</span>
                        )}
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-2 text-[12px] text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{new Date(customer.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                      </div>
                    </td>

                    {/* Total Orders */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-700">
                        <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />
                        <span>{customer._count.orders} {customer._count.orders === 1 ? "order" : "orders"}</span>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4.5">
                      <span className={cx(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        customer.isBlocked 
                          ? "bg-red-50 text-red-600 border border-red-100" 
                          : "bg-green-50 text-green-700 border border-green-100"
                      )}>
                        <Shield className="w-3 h-3" />
                        {customer.isBlocked ? "Suspended" : "Active"}
                      </span>
                    </td>

                    {/* Access Controls */}
                    <td className="px-6 py-4.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Suspension Toggle */}
                        <button
                          disabled={actionLoadingId === customer.id}
                          onClick={() => handleToggleBlock(customer.id, customer.isBlocked)}
                          className={cx(
                            "p-2 rounded-lg border transition-all text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50",
                            customer.isBlocked
                              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                              : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                          )}
                          title={customer.isBlocked ? "Reactivate shopper account" : "Suspend shopper account"}
                        >
                          {customer.isBlocked ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Activate</span>
                            </>
                          ) : (
                            <>
                              <UserX className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Suspend</span>
                            </>
                          )}
                        </button>

                        {/* Account Deletion */}
                        <button
                          disabled={actionLoadingId === customer.id}
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="p-2 rounded-lg border border-red-100 bg-red-50/50 text-red-600 hover:bg-red-100/70 transition-all disabled:opacity-50"
                          title="Permanently remove account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
