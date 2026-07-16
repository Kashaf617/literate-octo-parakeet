import { prisma } from "@/lib/prisma";
import ReviewActions from "./ReviewActions";
import { Star } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      product: { select: { name: true, slug: true } },
      customer: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and moderate customer reviews</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No reviews found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-[12px] uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Review</th>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-brand mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3 h-3 ${review.rating >= s ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <div className="font-bold text-sm text-gray-900">{review.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2 mt-1 max-w-xs">{review.content}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a href={`/product/${review.product.slug}`} target="_blank" className="text-sm font-medium text-blue-600 hover:underline">
                        {review.product.name}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{review.customer.name}</div>
                      <div className="text-xs text-gray-500">{review.customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        review.status === 'published' ? 'bg-green-100 text-green-800' :
                        review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ReviewActions reviewId={review.id} currentStatus={review.status} />
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
