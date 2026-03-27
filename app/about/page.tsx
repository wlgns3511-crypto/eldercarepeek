import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ElderCarePeek",
  description: "Learn about ElderCarePeek, our mission, and data sources for senior care cost information.",
};

export default function AboutPage() {
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">About ElderCarePeek</h1>

      <p>
        ElderCarePeek is a free resource helping families, caregivers, and seniors navigate the complex landscape of
        elder care costs across the United States. We provide transparent, up-to-date cost data for nursing homes,
        assisted living facilities, home health aides, and adult day care programs in all 50 states and 200+ cities.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Our Mission</h2>
      <p>
        We believe every family deserves access to clear, accurate information when making senior care decisions.
        Our goal is to help you understand what elder care costs in your area, compare options, and plan financially
        for the care your loved ones need. Whether you are researching care for a parent, planning your own future,
        or working as a professional in the aging services industry, ElderCarePeek is here to help.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Data Sources</h2>
      <p>
        Our cost data is primarily sourced from the <strong>Genworth Cost of Care Survey</strong>, one of the most
        comprehensive annual studies of long-term care costs in the United States. This survey collects data from
        over 60,000 care providers including nursing homes, assisted living facilities, home health agencies, and
        adult day health care centers. We also reference data from the Centers for Medicare &amp; Medicaid Services (CMS)
        and state Medicaid agencies for coverage information.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact Us</h2>
      <p>
        Have questions or feedback? Visit our <a href="/contact" className="text-teal-600 hover:underline">Contact page</a> to get in touch.
      </p>
    </article>
  );
}
