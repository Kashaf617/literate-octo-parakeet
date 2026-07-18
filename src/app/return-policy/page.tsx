import PolicyLayout from "@/components/ui/PolicyLayout";

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout title="Return Policy" lastUpdated="October 2023">
      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">1. Return Window</h2>
        <p>
          We want you to be completely satisfied with your purchase. If for any reason you are not entirely pleased with a product you purchased, you may return it within <strong>3 days</strong> of the original delivery date for a full return. Returns requested after 3 days of delivery will not be accepted.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">2. Condition of Returned Items</h2>
        <p>
          To be eligible for a return, your item must be unused, unworn, and in the same condition that you received it. It must also be in the original packaging with all tags attached. Items that appear worn, used, or damaged will not be accepted for return.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">3. Non-Returnable Items</h2>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li>Gift cards</li>
          <li>Downloadable software products</li>
          <li>Some health and personal care items</li>
          <li>Customized or personalized products</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">4. How to Initiate a Return</h2>
        <p>
          To complete your return, we require a receipt or proof of purchase. Please contact our customer support team at <strong>devineora7@gmail.com</strong> to initiate the return process and obtain a Return Merchandise Authorization (RMA) number.
        </p>
      </section>
    </PolicyLayout>
  );
}
