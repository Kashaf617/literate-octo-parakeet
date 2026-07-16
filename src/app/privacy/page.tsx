import PolicyLayout from "@/components/ui/PolicyLayout";

export default function PrivacyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="October 2023">
      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">1. Data Collection</h2>
        <p>
          We collect personal information such as your name, contact information, and payment details to process your orders securely. This data is collected when you register on our site, place an order, subscribe to our newsletter, or fill out a form.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">2. How We Use Your Information</h2>
        <p>
          Any of the information we collect from you may be used in one of the following ways:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li>To personalize your experience (your information helps us to better respond to your individual needs)</li>
          <li>To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you)</li>
          <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)</li>
          <li>To process transactions securely</li>
          <li>To send periodic emails regarding your order or other products and services</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">3. Data Protection</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database only to be accessible by those authorized with special access rights to such systems.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-[#0f172a] mb-4">4. Cookies</h2>
        <p>
          We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits, and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.
        </p>
      </section>
    </PolicyLayout>
  );
}
