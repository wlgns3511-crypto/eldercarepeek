import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const SITE_NAME = "ElderCarePeek";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eldercarepeek.com";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - US Senior Care & Elder Care Costs by State and City`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Compare senior care costs across all 50 US states and 200+ cities. Nursing home, assisted living, home health aide, and adult day care costs with Medicare and Medicaid coverage information.",
  metadataBase: new URL(SITE_URL),
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2LFRPS67NH" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","G-2LFRPS67NH")` }} />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5724806562146685"
          crossOrigin="anonymous"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "name": "ElderCarePeek",
              "url": "https://eldercarepeek.com",
              "description": "Compare senior care costs across all 50 US states and 200+ cities. Nursing home, assisted living, home health aide, and adult day care costs with Medicare and Medicaid coverage information.",
              "inLanguage": "en-US"
            },
            {
              "@type": "Organization",
              "name": "ElderCarePeek",
              "url": "https://eldercarepeek.com",
              "description": "Compare senior care costs across all 50 US states and 200+ cities. Nursing home, assisted living, home health aide, and adult day care costs with Medicare and Medicaid coverage information.",
              "sameAs": []
            }
          ]
        }) }} />
      </head>
      <body className={`${inter.className} antialiased bg-white text-slate-900 min-h-screen flex flex-col`}>
        <header className="border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-teal-700">
              {SITE_NAME}
            </a>
            <nav className="flex gap-6 text-sm">
              <a href="/state/florida" className="hover:text-teal-600">States</a>
              <a href="/care/nursing-home" className="hover:text-teal-600">Care Types</a>
              <a href="/compare/florida-vs-arizona-senior-care" className="hover:text-teal-600">Compare</a>
              <a href="/calculator" className="hover:text-teal-600">Calculator</a>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">{children}</main>
        <footer className="border-t border-slate-200 mt-16">
          <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-slate-500">
            <p>
              Data based on the Genworth Cost of Care Survey and CMS Medicare/Medicaid data.
              Costs are estimates and may vary by facility and individual needs.
            </p>
            <p className="mt-2">
              <a href="/about" className="hover:text-teal-600">About</a>
              {" | "}
              <a href="/privacy" className="hover:text-teal-600">Privacy</a>
              {" | "}
              <a href="/terms" className="hover:text-teal-600">Terms</a>
              {" | "}
              <a href="/contact" className="hover:text-teal-600">Contact</a>
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Related Resources</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                <a href="https://medcheckwize.com" className="hover:text-teal-600">Medicare</a>
                <a href="https://zippeek.com" className="hover:text-teal-600">ZIP Codes</a>
                <a href="https://costbycity.com" className="hover:text-teal-600">Cost of Living</a>
                <a href="https://sunpowerpeek.com" className="hover:text-teal-600">Solar Power</a>
              </div>
            </div>
            <p className="mt-1">
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
