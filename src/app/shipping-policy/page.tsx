import PolicyLayout from "@/components/ui/PolicyLayout";

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy" lastUpdated="July 2026">
      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">1. Order Processing Time</h2>
        <p>
          All orders are processed within 1 to 2 business days (excluding weekends and holidays) after receiving your order confirmation email/SMS. You will receive another notification when your order has shipped. 
        </p>
        <p className="mt-4 text-sm bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-100">
          <strong>Note:</strong> High volume periods or unforeseen circumstances may cause slight delays. We will communicate any significant delays directly.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">2. Shipping Rates and Estimates</h2>
        <p>
          We offer <strong>FREE Shipping on all orders above Rs. 10,000</strong> all over Pakistan. For orders below Rs. 10,000, a flat delivery charge of <strong>Rs. 270</strong> applies.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li><strong>Free Shipping:</strong> Orders Rs. 10,000 and above — 2-4 business days, completely free.</li>
          <li><strong>Standard Delivery:</strong> Orders below Rs. 10,000 — Rs. 270 flat charge, 2-4 business days.</li>
          <li><strong>Cash on Delivery:</strong> Available across all major cities of Pakistan at no additional charge.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">3. International Shipping</h2>
        <p>
          Currently, we only ship within Pakistan. We do not offer international shipping at this time.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">4. Order Status & Support</h2>
        <p>
          When your order has shipped, you will receive a tracking number you can use to check its status. If you have any questions or concerns regarding your shipment, please reach out to us at <strong>devineora7@gmail.com</strong>.
        </p>
      </section>
    </PolicyLayout>
  );
}
