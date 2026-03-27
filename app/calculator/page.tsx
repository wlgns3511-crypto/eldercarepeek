import type { Metadata } from "next";
import { ElderCareCalculator } from "@/components/ElderCareCalculator";
import { EmbedButton } from "@/components/EmbedButton";
import { FAQ } from "@/components/FAQ";
import { AdSlot } from "@/components/AdSlot";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Elder Care Cost Calculator - Estimate Senior Care Costs by State",
  description: "Calculate nursing home, assisted living, home health aide, and adult day care costs by state. Compare costs with national averages and get 5-year cost projections.",
};

export default function CalculatorPage() {
  const faqs = [
    {
      question: "How accurate is this elder care cost calculator?",
      answer: "Our calculator uses data from the Genworth Cost of Care Survey, which surveys over 60,000 care providers annually. Actual costs may vary based on specific facility, level of care, and location within a state.",
    },
    {
      question: "What factors affect senior care costs?",
      answer: "Key factors include: geographic location (state and city), type of care needed, level of medical care required, facility amenities, private vs. shared rooms, and the number of hours of care per day for home-based services.",
    },
    {
      question: "How much should I budget for long-term care?",
      answer: "The average stay in a nursing home is 2.5 years. At the national average of about $9,500/month for a private room, that's approximately $285,000. For assisted living (average stay 2.5 years), budget around $135,000. Having long-term care insurance can significantly reduce out-of-pocket costs.",
    },
    {
      question: "Are senior care costs tax deductible?",
      answer: "Some senior care expenses may be tax deductible as medical expenses if they exceed 7.5% of your adjusted gross income. This includes nursing home care if the primary reason is medical. Consult a tax professional for your specific situation.",
    },
    {
      question: "How do I pay for senior care if I can't afford it?",
      answer: "Options include: Medicaid (if you meet income/asset requirements), VA benefits for veterans, long-term care insurance, reverse mortgages, life insurance policy conversions, bridge loans, and nonprofit assistance programs. An elder law attorney can help with Medicaid planning strategies.",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-3">
        Elder Care Cost Calculator
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mb-6">
        Estimate senior care costs based on your state, care type, and duration.
        Compare your costs with national averages and plan for the future.
      </p>

      <ElderCareCalculator />

      <EmbedButton
        url="https://eldercarepeek.com/embed/care-calculator"
        title="Elder Care Cost Calculator"
      />

      <AdSlot id="calculator-mid" />

      <FAQ items={faqs} />

      {/* High-CPC section */}
      <section className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-5">
        <h2 className="text-lg font-bold mb-3">Plan for Senior Care Costs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Long-Term Care Insurance</h3>
            <p className="text-slate-500 text-xs">Get quotes from top-rated LTC insurance providers.</p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Medicare Supplement Plans</h3>
            <p className="text-slate-500 text-xs">Find Medigap plans to cover gaps in Medicare coverage.</p>
          </div>
          <div className="p-3 bg-white rounded border border-slate-100">
            <h3 className="font-semibold mb-1">Financial Advisors for Seniors</h3>
            <p className="text-slate-500 text-xs">Connect with fiduciary advisors specializing in retirement care planning.</p>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />
    </div>
  );
}
