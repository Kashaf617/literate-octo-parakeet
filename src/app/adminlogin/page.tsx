"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1221] flex">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative z-10 bg-white">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#DFD1A5]/30 bg-white flex items-center justify-center shadow-md">
              <img 
                src="/uploads/logo.png" 
                alt="DEVINE ORA" 
                className="absolute w-[185%] h-[185%] object-cover object-center max-w-none" 
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-md font-bold tracking-[0.15em] text-[#111827] uppercase font-heading">DEVINE ORA</span>
              <span className="text-[8px] font-bold tracking-widest text-[#C9A227] uppercase">LUXURY TIMEPIECES</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="text-brand w-8 h-8" />
            <h1 className="text-3xl md:text-4xl font-extrabold text-ink leading-tight">Admin Portal</h1>
          </div>
          <p className="text-sub text-[14px] mb-8 font-medium">Please enter your credentials to access the command center.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-100 text-red-500 text-[13px] rounded-lg px-4 py-3 font-medium">{error}</div>}

            <div>
              <label className="block text-[12px] uppercase tracking-wider text-ink font-bold mb-2">Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl px-4 py-3.5 text-ink text-[14px] outline-none focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 transition-all placeholder:text-gray-400 font-mono" 
                placeholder="admin@buysial.com" 
              />
            </div>

            <div>
              <label className="block text-[12px] uppercase tracking-wider text-ink font-bold mb-2">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-[#f8f9fa] border border-[#e2e8f0] rounded-xl px-4 py-3.5 text-ink text-[14px] outline-none focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10 transition-all placeholder:text-gray-400 font-mono" 
                placeholder="••••••••" 
              />
            </div>

            <button disabled={loading} className="w-full bg-[#0b1221] text-white font-bold text-[14px] py-4 rounded-xl hover:bg-[#1a2942] transition-all shadow-[0_10px_20px_-10px_rgba(11,18,33,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(11,18,33,0.6)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group">
              {loading ? "Authenticating..." : (
                <>Secure Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[12px] text-sub font-mono">
            &copy; {new Date().getFullYear()} DEVINE ORA Luxury Timepieces. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side - Abstract Banner */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#0b1221] overflow-hidden">
        {/* We use an ultra premium abstract Unsplash image here since the image generator quota is exhausted */}
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")' }} />
        
        {/* Complex gradients to give it that ultra-premium feel */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0b1221] via-transparent to-brand/20 mix-blend-color" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1221] via-[#0b1221]/50 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-20 z-10">
          <div className="w-16 h-1 bg-brand mb-8 rounded-full"></div>
          <h2 className="text-white text-4xl font-black mb-6 leading-tight tracking-tight">Command Center<br/>Operations & Analytics</h2>
          <p className="text-[#94a3b8] text-lg max-w-lg leading-relaxed">Manage your storefront, track inventory, and analyze customer behaviors from one unified, powerful dashboard designed for scale.</p>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-brand/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
}
