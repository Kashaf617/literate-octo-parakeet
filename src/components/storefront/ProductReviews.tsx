"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductReviews({ 
  productId, 
  reviews, 
  customerSession 
}: { 
  productId: string; 
  reviews: any[];
  customerSession: any;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  
  const currentReviews = reviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerSession) return;
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, title, content })
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setTitle("");
      setContent("");
      setRating(5);
      router.refresh();
    }
  }

  return (
    <div className="w-full">
      {/* Reviews Header with Sort By Dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black pb-4 mb-12">
        <h2 className="text-lg font-black text-black uppercase tracking-wider">
          Reviews ({reviews.length})
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sort By</span>
          <select className="border border-black rounded-lg px-3 py-1.5 text-[11px] font-bold bg-white text-black outline-none">
            <option>Most Recent</option>
            <option>Highest Rating</option>
            <option>Lowest Rating</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-16 items-start">
        {/* Left Side - Form */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 border border-black rounded-2xl bg-white/40 p-6">
          <h3 className="text-md font-black text-black mb-6 uppercase tracking-wider">Write a Review</h3>
          {customerSession ? (
            success ? (
              <div className="bg-white border border-black text-gray-700 p-6 text-[13px] font-light leading-relaxed rounded-xl">
                Thank you for your feedback. Your review has been submitted and is pending moderation.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-black mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star className={`w-5 h-5 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-black mb-2">Review Title</label>
                  <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white border border-black rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-black text-[13px] font-light transition-colors placeholder:text-gray-400 text-black" placeholder="Summarize your experience" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-black mb-2">Review Content</label>
                  <textarea required value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full bg-white border border-black rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-black text-[13px] font-light resize-none transition-colors placeholder:text-gray-400 text-black" placeholder="Tell us what you liked or disliked" />
                </div>
                <button disabled={loading} className="w-full bg-black text-white font-bold text-[11px] uppercase tracking-wider py-4 hover:bg-[#27272a] transition-all duration-300 disabled:opacity-50 rounded-xl">
                  {loading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )
          ) : (
            <div className="bg-white border border-black p-4 md:p-8 text-center flex flex-col items-center rounded-xl">
              <p className="text-gray-600 text-[13px] font-light mb-6">Please log in to share your experience with this product.</p>
              <a href="/login" className="bg-black text-white font-bold text-[10px] uppercase tracking-wider px-8 py-3 hover:bg-[#27272a] transition-colors rounded-lg">Sign In</a>
            </div>
          )}
        </div>

        {/* Right Side - Reviews List */}
        <div className="lg:col-span-8">
          {reviews.length === 0 ? (
            <div className="h-full flex items-center justify-center min-h-[200px] border border-black bg-white rounded-2xl">
              <p className="text-gray-500 font-light text-[14px]">No reviews yet. Be the first to share your thoughts.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {currentReviews.map((review: any) => (
                <div key={review.id} className="bg-white border border-black rounded-2xl p-4 md:p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                    <div>
                      <div className="font-extrabold text-[13px] text-black tracking-wide">{review.customer.name}</div>
                      <div className="flex gap-0.5 mt-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3.5 h-3.5 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                      {(() => {
                        const d = new Date(review.createdAt);
                        const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
                        return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
                      })()}
                    </div>
                  </div>
                  <h4 className="font-black text-[14px] text-black mb-2 tracking-wide uppercase">{review.title}</h4>
                  <p className="text-gray-700 font-light leading-relaxed text-[13px] mb-4">{review.content}</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-black mt-auto">
                    <span>✓</span>
                    <span>I recommend this product</span>
                  </div>
                </div>
              ))}
              
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center gap-2 mt-8 pt-4">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-[12px] font-bold transition-colors ${
                        currentPage === i + 1 ? 'bg-[#ff5a1f] text-white shadow-sm' : 'bg-white text-black hover:bg-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
