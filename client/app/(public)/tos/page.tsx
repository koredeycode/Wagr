const TOS = () => {
  return (
    <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-text mt-2">Last updated: October 26, 2023</p>
        </div>
        <div className="space-y-6 text-text">
          <div className="prose max-w-none">
            <h3 className="text-xl font-bold text-primary mb-2 mt-0">
              1. Acceptance of Terms
            </h3>
            <p>
              By accessing or using the Wagr application (the "App"), you agree
              to be bound by these Terms of Service ("Terms"). If you do not
              agree to these Terms, you may not use the App.
            </p>
            <h3 className="text-xl font-bold text-primary mb-2">
              2. Description of Service
            </h3>
            <p>
              Wagr is a decentralized application (dApp) that allows users to
              create and participate in wagers on the Base blockchain. The App
              facilitates the creation, management, and settlement of wagers
              based on predefined conditions.
            </p>
            <h3 className="text-xl font-bold text-primary mb-2">
              3. User Accounts
            </h3>
            <p>
              To use certain features of the App, you may need to connect your
              Base-compatible wallet. You are responsible for maintaining the
              security of your wallet and any associated private keys. Wagr is
              not responsible for any losses resulting from unauthorized access
              to your wallet.
            </p>
            <h3 className="text-xl font-bold text-primary mb-2">
              4. Wager Creation and Participation
            </h3>
            <p>
              Users can create wagers by specifying the terms, conditions, and
              stakes. By participating in a wager, you agree to abide by the
              specified terms. Wagr acts as an intermediary to facilitate the
              wager and is not responsible for the outcome or enforcement of the
              wager terms.
            </p>
            <h3 className="text-xl font-bold text-primary mb-2">
              5. Fees and Payments
            </h3>
            <p>
              Wagr may charge fees for creating or participating in wagers.
              These fees will be clearly disclosed before you commit to any
              transaction. All payments are processed through the Base
              blockchain, and you are responsible for any transaction fees
              associated with your wallet.
            </p>
            <h3 className="text-xl font-bold text-primary mb-2">
              6. Dispute Resolution
            </h3>
            <p>
              In the event of a dispute regarding a wager, Wagr will provide a
              dispute resolution mechanism. Decisions made by Wagr regarding
              disputes are final and binding.
            </p>
            <h3 className="text-xl font-bold text-primary mb-2">
              7. Prohibited Activities
            </h3>
            <p>
              You agree not to use the App for any unlawful or prohibited
              activities, including but not limited to fraud, money laundering,
              or any activity that violates applicable laws or regulations.
            </p>
            <h3 className="text-xl font-bold text-primary mb-2">
              8. Disclaimer of Warranties
            </h3>
            <p>
              The App is provided "as is" without any warranties, express or
              implied. Wagr does not warrant that the App will be error-free or
              uninterrupted.
            </p>
            <h3 className="text-xl font-bold text-primary mb-2">
              9. Limitation of Liability
            </h3>
            <p>
              Wagr shall not be liable for any indirect, incidental, special, or
              consequential damages arising out of or in connection with your
              use of the App.
            </p>
            <h3 className="text-xl font-bold text-primary mb-2">
              10. Modifications to Terms
            </h3>
            <p>
              Wagr reserves the right to modify these Terms at any time. Your
              continued use of the App after any such changes constitutes your
              acceptance of the new Terms.
            </p>
            <h3 className="text-xl font-bold text-primary mb-2">
              11. Governing Law
            </h3>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which Wagr operates.
            </p>
            <h3 className="text-xl font-bold text-primary mb-2">
              12. Contact Information
            </h3>
            <p>
              If you have any questions about these Terms, please contact us at
              <a
                className="text-[var(--primary-color)] hover:underline"
                href="mailto:support@wagr.io"
              >
                support@wagr.io
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TOS;
