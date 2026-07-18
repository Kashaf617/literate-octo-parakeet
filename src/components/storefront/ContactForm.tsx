'use client';

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, message }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to send message. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 border border-[#DFD1A5]/40 h-full">
      <h2 className="text-2xl font-bold text-[#0f172a] mb-8 font-heading">Send us a Message</h2>
      
      {submitted ? (
        <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#C9A227]/10 flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-[#C9A227]" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-[#0f172a] font-sans">Message Sent!</h3>
            <p className="text-[#475569] font-sans font-light max-w-md">
              Thank you, <span className="font-semibold text-black">{firstName}</span>. Your message has been sent successfully. We will get back to you at <span className="font-semibold text-black">{email}</span> within 24 hours.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFirstName("");
              setLastName("");
              setEmail("");
              setMessage("");
            }}
            className="bg-black hover:bg-[#C9A227] text-white hover:text-black border border-black hover:border-[#C9A227] px-8 py-3 rounded-lg font-bold uppercase tracking-widest transition-all text-sm font-sans"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0f172a] font-sans">First Name</label>
              <input 
                type="text" 
                placeholder="John" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#f8fafc] border border-line rounded-lg px-4 py-3 outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all text-[#0f172a] font-sans" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#0f172a] font-sans">Last Name</label>
              <input 
                type="text" 
                placeholder="Doe" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-[#f8fafc] border border-line rounded-lg px-4 py-3 outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all text-[#0f172a] font-sans" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#0f172a] font-sans">Email Address</label>
            <input 
              type="email" 
              placeholder="john@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#f8fafc] border border-line rounded-lg px-4 py-3 outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all text-[#0f172a] font-sans" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#0f172a] font-sans">Message</label>
            <textarea 
              placeholder="How can we help you?" 
              rows={6} 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#f8fafc] border border-line rounded-lg px-4 py-3 outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all text-[#0f172a] resize-none font-sans"
            ></textarea>
          </div>

          {error && (
            <p className="text-red-500 font-sans text-sm font-medium">{error}</p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black hover:bg-[#C9A227] text-white hover:text-black border border-black hover:border-[#C9A227] px-8 py-4 rounded-lg font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 group font-sans disabled:opacity-55 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                Sending...
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                Send Message
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
