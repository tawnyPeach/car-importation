import type { Metadata } from "next";
import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Metadata {
  return {
    title: "Newsletter - Car Import Deals & Updates",
    description: "Subscribe to receive weekly car import deals, price alerts, and expert tips for importing cars from Europe.",
    alternates: {
      languages: {
        en: "/en/newsletter",
        fr: "/fr/newsletter",
      },
    },
  };
}

export default async function NewsletterPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <div className="animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link href={`/${lang}`} className="hover:text-[#10b981] transition">
          {isFr ? "Accueil" : "Home"}
        </Link>
        <span>/</span>
        <span className="text-[#1a1f36] dark:text-white font-medium">
          Newsletter
        </span>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] dark:text-white mb-4">
          {isFr ? "Abonnez-vous aux mises a jour" : "Subscribe to Import Updates"}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          {isFr
            ? "Recevez les meilleures offres d'importation, les alertes de prix et les conseils d'experts directement dans votre boite mail."
            : "Get the best import deals, price alerts, and expert tips delivered straight to your inbox every week."}
        </p>

        <div className="mb-12">
          <EmailCapture />
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-[#1a1f36] dark:text-white mb-4">
            {isFr ? "Ce que vous recevrez" : "What you will get"}
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-[#10b981] mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {isFr ? "Alertes de prix hebdomadaires sur les voitures populaires" : "Weekly price alerts on popular cars"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#10b981] mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {isFr ? "Mises a jour sur les nouveaux pays et reglementations" : "New country updates and regulation changes"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#10b981] mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {isFr ? "Conseils et astuces pour economiser sur l'importation" : "Tips and tricks to save money on imports"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#10b981] mt-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-gray-700 dark:text-gray-300">
                {isFr ? "Guides exclusifs sur le processus d'importation" : "Exclusive guides on the import process"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
