import PolicyLayout from "@/components/ui/PolicyLayout";

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions" lastUpdated="October 2023">
      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">1. Introduction</h2>
        <p>
          Welcome to DEVINE ORA. These terms and conditions outline the rules and regulations for the use of DEVINE ORA's Website. 
          By accessing this website we assume you accept these terms and conditions. Do not continue to use DEVINE ORA if you do not agree to take all of the terms and conditions stated on this page.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">2. Intellectual Property Rights</h2>
        <p>
          Other than the content you own, under these Terms, DEVINE ORA and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">3. Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li>publishing any Website material in any other media;</li>
          <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>
          <li>publicly performing and/or showing any Website material;</li>
          <li>using this Website in any way that is or may be damaging to this Website;</li>
          <li>using this Website in any way that impacts user access to this Website;</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">4. Limitation of Liability</h2>
        <p>
          In no event shall DEVINE ORA, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. DEVINE ORA, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
        </p>
      </section>
    </PolicyLayout>
  );
}
