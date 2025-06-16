// app/terms/page.tsx

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
          Terms and Conditions
        </h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            These Terms and Conditions (&quot;Terms&quot;) govern your use of
            our website. By accessing or using the site, you agree to be bound
            by these Terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Use of the Site</h2>
          <p>
            You agree to use the site only for lawful purposes and in a way that
            does not infringe the rights of, restrict, or inhibit anyone
            else&quot;s use and enjoyment.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            3. Intellectual Property
          </h2>
          <p>
            All content on this website is the property of our company and is
            protected by copyright and intellectual property laws.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Termination</h2>
          <p>
            We may suspend or terminate your access to the site at any time,
            without notice, for conduct that we believe violates these Terms.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Contact Us</h2>
          <p>
            If you have any questions about these Terms, you can contact us at
            support@example.com.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-10 text-center">
          © {new Date().getFullYear()} Example Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
