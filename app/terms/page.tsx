import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for ElderCarePeek.",
};

export default function TermsPage() {
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: March 27, 2026</p>

      <p>
        Welcome to ElderCarePeek. By accessing or using our website at eldercarepeek.com, you agree to be bound by
        these Terms of Service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Use of the Website</h2>
      <p>
        ElderCarePeek provides senior care cost data, comparisons, and calculators for informational and educational
        purposes only. The information provided should not be the sole basis for care decisions. Always consult with
        healthcare professionals and financial advisors.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Accuracy of Information</h2>
      <p>
        While we strive to provide accurate and up-to-date information, we make no warranties or representations
        regarding the completeness, accuracy, or reliability of any content. The data is sourced from publicly
        available surveys and government databases. Actual care costs may vary by facility and individual needs.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Intellectual Property</h2>
      <p>
        The content, design, and layout of this website are the property of ElderCarePeek and are protected by
        copyright and other intellectual property laws.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Third-Party Links and Advertising</h2>
      <p>
        Our website may contain links to third-party websites and display advertisements served by third-party ad
        networks. We are not responsible for the content or practices of any third-party websites.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, ElderCarePeek shall not be liable for any indirect, incidental,
        special, consequential, or punitive damages arising out of your use of the website.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Changes to These Terms</h2>
      <p>
        We reserve the right to modify these Terms of Service at any time. Your continued use of the website
        constitutes acceptance of the revised terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact Us</h2>
      <p>
        If you have any questions, please visit our{" "}
        <a href="/contact" className="text-teal-600 hover:underline">contact page</a>.
      </p>
    </article>
  );
}
