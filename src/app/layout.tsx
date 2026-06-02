import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Morocco Car Import Cost Calculator",
    template: "%s | Morocco Car Import Calculator",
  },
  description:
    "Calculate the total cost of importing a car from Europe to Morocco. Includes customs duty, VAT, transport, and administrative fees.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Morocco Car Import Calculator",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col`}
      >
        {/* Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition">
              Morocco Car Import
            </Link>
            <div className="flex gap-6">
              <Link
                href="/"
                className="text-gray-600 hover:text-blue-600 font-medium transition"
              >
                Home
              </Link>
              <Link
                href="/calculator"
                className="text-gray-600 hover:text-blue-600 font-medium transition"
              >
                Calculator
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl mx-auto w-full py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300 py-8 mt-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-3">Morocco Car Import Calculator</h3>
                <p className="text-sm text-gray-400">
                  Free tool to calculate the total cost of importing a car from Europe to Morocco.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="hover:text-white transition">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculator" className="hover:text-white transition">
                      Calculator
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Disclaimer</h3>
                <p className="text-sm text-gray-400">
                  This calculator provides estimates only. Actual costs may vary based on current
                  exchange rates, specific vehicle condition, and regulatory changes.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Morocco Car Import Calculator. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
