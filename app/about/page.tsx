import type { Metadata } from "next";
import { EditorNote } from "@/components/EditorNote";
import { CrossSiteLinks } from "@/components/CrossSiteLinks";

const desc = "About ElderCarePeek — free senior care cost data for 440+ US cities powered by Genworth & CMS data.";
export const metadata: Metadata = {
  title: "About ElderCarePeek",
  description: desc,
  alternates: { canonical: "/about/" },
  openGraph: { title: "About ElderCarePeek", description: desc, url: "/about/" },
};

export default function AboutPage() {
  return (
    <article className="prose prose-slate max-w-3xl mx-auto">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebPage', name: 'About ElderCarePeek',
        description: desc, url: 'https://eldercarepeek.com/about/',
        isPartOf: { '@type': 'WebSite', name: 'ElderCarePeek', url: 'https://eldercarepeek.com' },
      }) }} />
      <h1 className="text-3xl font-bold text-teal-700 mb-6">About ElderCarePeek</h1>

      <EditorNote note="ElderCarePeek is part of the DataPeek Facts network — 30+ free data tools powered by official government and institutional sources." />

      <p>
        ElderCarePeek is a free resource helping families, caregivers, and seniors navigate the complex landscape of
        elder care costs across the United States. We provide transparent, up-to-date cost data for nursing homes,
        assisted living, home health aides, and adult day care in 50 states, 440+ cities, and 32,000+ ZIP codes.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Our Mission</h2>
      <p>
        Every family deserves access to clear, accurate information when making senior care decisions.
        Whether researching care for a parent, planning your own future, or working in the aging services industry.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">The DataPeek Network</h2>
      <p>
        ElderCarePeek is part of <a href="https://datapeekfacts.com" className="text-teal-600 hover:underline">DataPeek Facts</a>,
        a network of data platforms. Related tools:
        <a href="https://medcheckwize.com" className="text-teal-600 hover:underline ml-1">Medicare costs</a>,
        <a href="https://medcostpeek.com" className="text-teal-600 hover:underline ml-1">global healthcare</a>,
        <a href="https://costbycity.com" className="text-teal-600 hover:underline ml-1">cost of living</a>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Data Sources</h2>
      <p>
        Primary data from the <strong>Genworth Cost of Care Survey</strong> (60,000+ care providers) and
        <strong> Centers for Medicare & Medicaid Services (CMS)</strong>.
        See our <a href="/methodology/" className="text-teal-600 hover:underline">Methodology</a>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">Contact Us</h2>
      <p>Visit our <a href="/contact/" className="text-teal-600 hover:underline">Contact page</a>.</p>

      <CrossSiteLinks current="ElderCarePeek" />
    </article>
  );
}
