import PolicyLayout from "@/components/ui/PolicyLayout";

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund Policy" lastUpdated="October 2023">
      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">1. Refund Processing</h2>
        <p>
          Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">2. Approved Refunds</h2>
        <p>
          If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days (usually 5-10 business days depending on your bank).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">3. Late or Missing Refunds</h2>
        <p>
          If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time before a refund is posted.
        </p>
        <p className="mt-4">
          If you’ve done all of this and you still have not received your refund yet, please contact us at <strong>devineora7@gmail.com</strong>.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">4. Sale Items</h2>
        <p>
          Only regular priced items may be refunded, unfortunately sale items cannot be refunded unless specifically stated otherwise during the promotional period.
        </p>
      </section>
    </PolicyLayout>
  );
}
