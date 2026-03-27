import { Metadata } from "next";
import { ElderCareCalculator } from "@/components/ElderCareCalculator";

export const metadata: Metadata = {
  title: "Elder Care Cost Calculator - Embeddable Widget",
  robots: "noindex, nofollow",
};

export default function EmbedCareCalculatorPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <ElderCareCalculator />
      <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 12 }}>
        Powered by{" "}
        <a href="https://eldercarepeek.com" target="_blank" rel="noopener" style={{ color: "#0d9488", textDecoration: "underline" }}>
          ElderCarePeek
        </a>
      </p>
    </div>
  );
}
