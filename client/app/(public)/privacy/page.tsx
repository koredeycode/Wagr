const Privacy = () => {
  return (
    <main className="flex-1 px-40 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-color text-5xl font-bold leading-tight tracking-tighter">
            Privacy Policy
          </h1>
          <p className="muted-text mt-4 text-lg">
            Last updated: October 26, 2023
          </p>
        </div>
        <div className="space-y-10">
          <section>
            <p className="text-color text-base leading-relaxed">
              At Wagr, we value your privacy and are committed to protecting
              your personal information. This Privacy Policy explains how we
              collect, use, and safeguard your data when you use our
              application. By using Wagr, you agree to the terms outlined in
              this policy.
            </p>
          </section>
          <section>
            <h2 className="text-color text-2xl font-bold tracking-tight mb-4">
              Information We Collect
            </h2>
            <p className="muted-text text-base leading-relaxed">
              We collect various types of information to provide and improve our
              services, including:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 muted-text text-base leading-relaxed">
              <li>
                <strong>Personal Information:</strong> This includes your name,
                email address, and wallet address, which are necessary for
                account creation and transaction processing.
              </li>
              <li>
                <strong>Usage Data:</strong> We collect data about your
                interactions with the application, such as bets placed,
                transactions made, and time spent on the platform.
              </li>
              <li>
                <strong>Device Information:</strong> We may collect information
                about the device you use to access Wagr, including the device
                type, operating system, and unique device identifiers.
              </li>
              <li>
                <strong>Cookies and Similar Technologies:</strong> We use
                cookies and similar technologies to enhance your experience,
                personalize content, and analyze usage patterns.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-color text-2xl font-bold tracking-tight mb-4">
              How We Use Your Information
            </h2>
            <p className="muted-text text-base leading-relaxed">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 muted-text text-base leading-relaxed">
              <li>
                <strong>Providing and Improving Services:</strong> To facilitate
                betting activities, process transactions, and enhance the
                functionality of Wagr.
              </li>
              <li>
                <strong>Personalization:</strong> To tailor your experience,
                recommend relevant bets, and provide personalized content.
              </li>
              <li>
                <strong>Communication:</strong> To send you important updates,
                notifications, and promotional materials related to Wagr.
              </li>
              <li>
                <strong>Security:</strong> To protect against fraud,
                unauthorized access, and other security risks.
              </li>
              <li>
                <strong>Analytics:</strong> To analyze usage patterns and
                improve our services.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-color text-2xl font-bold tracking-tight mb-4">
              Data Sharing and Disclosure
            </h2>
            <p className="muted-text text-base leading-relaxed">
              We may share your information with third parties under the
              following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-4 muted-text text-base leading-relaxed">
              <li>
                <strong>Service Providers:</strong> We may engage third-party
                service providers to assist with various functions, such as
                payment processing, data analysis, and customer support.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your
                information if required by law or in response to valid legal
                requests.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, or sale of assets, your information may be
                transferred to the acquiring entity.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share your
                information with third parties if you provide explicit consent.
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-color text-2xl font-bold tracking-tight mb-4">
              Data Security
            </h2>
            <p className="muted-text text-base leading-relaxed">
              We implement appropriate security measures to protect your
              personal information from unauthorized access, alteration,
              disclosure, or destruction. These measures include encryption,
              access controls, and regular security assessments.
            </p>
          </section>
          <section>
            <h2 className="text-color text-2xl font-bold tracking-tight mb-4">
              Your Rights
            </h2>
            <p className="muted-text text-base leading-relaxed">
              You have the right to access, correct, or delete your personal
              information. You may also have the right to object to or restrict
              certain processing activities. To exercise these rights, please
              contact us at
              <a
                className="text-color hover:underline"
                href="mailto:support@Wagr.xyz"
              >
                support@Wagr.xyz
              </a>
              .
            </p>
          </section>
          <section>
            <h2 className="text-color text-2xl font-bold tracking-tight mb-4">
              Changes to This Policy
            </h2>
            <p className="muted-text text-base leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any significant changes by posting the updated
              policy on our application and/or sending you a direct
              notification. Your continued use of Wagr after such changes
              constitutes your acceptance of the new policy.
            </p>
          </section>
          <section>
            <h2 className="text-color text-2xl font-bold tracking-tight mb-4">
              Contact Us
            </h2>
            <p className="muted-text text-base leading-relaxed">
              If you have any questions or concerns about this Privacy Policy,
              please contact us at
              <a
                className="text-color hover:underline"
                href="mailto:support@wagr.xyz"
              >
                support@wagr.xyz
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
