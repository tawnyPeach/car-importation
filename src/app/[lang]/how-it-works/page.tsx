import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "How Car Import Works - Step by Step Guide",
    description:
      "Learn how to import a car step by step: research, purchase, shipping, customs clearance, inspection, and registration. Complete guide for Africa and Middle East.",
    openGraph: {
      title: "How Car Import Works - Step by Step Guide",
      description:
        "Learn how to import a car step by step: research, purchase, shipping, customs clearance, inspection, and registration.",
      type: "website",
    },
    alternates: {
      languages: {
        en: "/en/how-it-works",
        fr: "/fr/how-it-works",
      },
    },
  };
}

const stepsEn = [
  {
    number: 1,
    title: "Research & Choose Your Car",
    description:
      "Search online marketplaces like AutoScout24, Mobile.de, and local dealers. Compare prices across countries, check vehicle history reports, and identify models that meet your destination country's import requirements. Consider age restrictions, emission standards, and right-hand vs left-hand drive regulations.",
  },
  {
    number: 2,
    title: "Purchase the Vehicle",
    description:
      "Negotiate the price with the seller, arrange a pre-purchase inspection by an independent mechanic, and complete the sale. Obtain all necessary documents including the title, invoice, export certificate, and any service records. Ensure the vehicle identification number (VIN) matches all paperwork.",
  },
  {
    number: 3,
    title: "Arrange Shipping",
    description:
      "Choose between Roll-on/Roll-off (RoRo) shipping for cost efficiency or container shipping for maximum protection. Book with a reputable freight forwarder, purchase marine insurance covering the full vehicle value, and coordinate pickup from the seller's location to the port of departure.",
  },
  {
    number: 4,
    title: "Customs Clearance",
    description:
      "Upon arrival at the destination port, present your documents to customs: bill of lading, commercial invoice, certificate of origin, and export papers. Pay the applicable import duties and VAT based on the vehicle's assessed value. A customs broker can expedite this process significantly.",
  },
  {
    number: 5,
    title: "Vehicle Inspection",
    description:
      "Submit the vehicle for mandatory technical control and emissions testing at an authorized inspection center. Requirements vary by country but typically include roadworthiness checks, headlight alignment, brake efficiency tests, and exhaust emission measurements. Some countries require modifications for compliance.",
  },
  {
    number: 6,
    title: "Registration",
    description:
      "Complete the final step by registering the vehicle with local transport authorities. Obtain local license plates, purchase mandatory third-party insurance, and receive your registration card. You may also need to pay a road tax or registration fee depending on the destination country.",
  },
];

const stepsFr = [
  {
    number: 1,
    title: "Recherche et Choix du Vehicule",
    description:
      "Explorez les marketplaces en ligne comme AutoScout24, Mobile.de et les concessionnaires locaux. Comparez les prix entre pays, verifiez les historiques de vehicules et identifiez les modeles conformes aux exigences d'importation de votre pays de destination. Tenez compte des restrictions d'age, des normes d'emission et des reglementations sur la conduite.",
  },
  {
    number: 2,
    title: "Achat du Vehicule",
    description:
      "Negociez le prix avec le vendeur, organisez une inspection pre-achat par un mecanicien independant et finalisez la vente. Obtenez tous les documents necessaires : titre de propriete, facture, certificat d'exportation et carnet d'entretien. Assurez-vous que le numero VIN correspond a tous les documents.",
  },
  {
    number: 3,
    title: "Organisation du Transport",
    description:
      "Choisissez entre le transport Roulier (RoRo) pour l'economie ou le conteneur pour une protection maximale. Reservez aupres d'un transitaire repute, souscrivez une assurance maritime couvrant la valeur totale du vehicule et coordonnez l'enlevement depuis le lieu du vendeur jusqu'au port de depart.",
  },
  {
    number: 4,
    title: "Dedouanement",
    description:
      "A l'arrivee au port de destination, presentez vos documents aux douanes : connaissement, facture commerciale, certificat d'origine et documents d'exportation. Payez les droits de douane et la TVA applicables selon la valeur estimee du vehicule. Un courtier en douane peut accelerer considerablement ce processus.",
  },
  {
    number: 5,
    title: "Inspection Technique",
    description:
      "Soumettez le vehicule au controle technique obligatoire et aux tests d'emissions dans un centre d'inspection agree. Les exigences varient selon les pays mais incluent generalement des controles d'aptitude a la route, l'alignement des phares, l'efficacite du freinage et les mesures d'emission d'echappement.",
  },
  {
    number: 6,
    title: "Immatriculation",
    description:
      "Completez l'etape finale en immatriculant le vehicule aupres des autorites de transport locales. Obtenez les plaques d'immatriculation locales, souscrivez une assurance obligatoire au tiers et recevez votre carte grise. Vous devrez peut-etre egalement payer une taxe de circulation selon le pays de destination.",
  },
];

const faqsEn = [
  {
    question: "How long does the entire car import process take?",
    answer:
      "The typical car import process takes 4 to 8 weeks from purchase to registration. Shipping usually takes 2-4 weeks depending on the route, customs clearance 3-7 business days, and inspection plus registration another 1-2 weeks.",
  },
  {
    question: "What documents do I need to import a car?",
    answer:
      "Essential documents include: the original vehicle title, commercial invoice with purchase price, bill of lading from the shipping company, export certificate from the origin country, certificate of conformity, valid passport/ID, and proof of address in the destination country.",
  },
  {
    question: "Is it cheaper to import a car or buy locally?",
    answer:
      "In many African and Middle Eastern markets, importing from Europe can save 20-40% even after duties and shipping costs. Use our calculator to compare the total landed cost with local market prices for your specific vehicle.",
  },
  {
    question: "What is the difference between RoRo and container shipping?",
    answer:
      "RoRo (Roll-on/Roll-off) is cheaper as the car is driven onto the ship deck. Container shipping costs more but provides full protection from weather and theft. Choose container for luxury vehicles or if you want to ship personal belongings inside the car.",
  },
  {
    question: "Can I import any car regardless of age?",
    answer:
      "No, many countries have age restrictions on imported vehicles. For example, some West African countries limit imports to cars under 5-8 years old. Morocco allows older vehicles but charges higher duties. Always check your destination country's specific regulations before purchasing.",
  },
];

const faqsFr = [
  {
    question: "Combien de temps dure le processus complet d'importation ?",
    answer:
      "Le processus d'importation typique prend de 4 a 8 semaines de l'achat a l'immatriculation. Le transport maritime prend generalement 2 a 4 semaines selon la route, le dedouanement 3 a 7 jours ouvrables, et l'inspection plus l'immatriculation encore 1 a 2 semaines.",
  },
  {
    question: "Quels documents sont necessaires pour importer un vehicule ?",
    answer:
      "Les documents essentiels comprennent : le titre de propriete original, la facture commerciale avec le prix d'achat, le connaissement de la compagnie maritime, le certificat d'exportation du pays d'origine, le certificat de conformite, un passeport/piece d'identite valide et un justificatif de domicile dans le pays de destination.",
  },
  {
    question: "Est-il moins cher d'importer une voiture ou d'acheter localement ?",
    answer:
      "Dans de nombreux marches africains et du Moyen-Orient, l'importation depuis l'Europe peut economiser 20 a 40% meme apres les droits de douane et les frais de transport. Utilisez notre calculateur pour comparer le cout total debarque avec les prix du marche local.",
  },
  {
    question: "Quelle est la difference entre le transport RoRo et conteneur ?",
    answer:
      "Le RoRo (Roll-on/Roll-off) est moins cher car la voiture est conduite sur le pont du navire. Le conteneur coute plus cher mais offre une protection totale contre les intemperies et le vol. Choisissez le conteneur pour les vehicules de luxe ou si vous souhaitez expedier des effets personnels dans la voiture.",
  },
  {
    question: "Peut-on importer n'importe quel vehicule quel que soit son age ?",
    answer:
      "Non, de nombreux pays ont des restrictions d'age sur les vehicules importes. Par exemple, certains pays d'Afrique de l'Ouest limitent les importations aux voitures de moins de 5 a 8 ans. Le Maroc autorise les vehicules plus anciens mais applique des droits plus eleves. Verifiez toujours la reglementation specifique de votre pays de destination.",
  },
];

const stepIcons = [
  // Search/Research icon
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>`,
  // Purchase/Cart icon
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" /></svg>`,
  // Shipping/Truck icon
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>`,
  // Customs/Document icon
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>`,
  // Inspection/Wrench icon
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg>`,
  // Registration/Key icon
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>`,
];

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const steps = lang === "fr" ? stepsFr : stepsEn;
  const faqs = lang === "fr" ? faqsFr : faqsEn;

  const breadcrumbs = [
    { label: lang === "fr" ? "Accueil" : "Home", href: `/${lang}` },
    {
      label: lang === "fr" ? "Comment ca Marche" : "How it Works",
      href: `/${lang}/how-it-works`,
    },
  ];

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name:
      lang === "fr"
        ? "Comment Importer une Voiture"
        : "How Car Import Works",
    description:
      lang === "fr"
        ? "Guide etape par etape pour importer une voiture en Afrique et au Moyen-Orient"
        : "Step by step guide to importing a car to Africa and the Middle East",
    step: steps.map((s) => ({
      "@type": "HowToStep",
      position: s.number,
      name: s.title,
      text: s.description,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1f36] mb-3">
          {lang === "fr" ? "Comment Importer une Voiture" : "How Car Import Works"}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          {lang === "fr"
            ? "Suivez ces 6 etapes pour importer votre vehicule en toute confiance. De la recherche a l'immatriculation, nous vous guidons a chaque etape du processus."
            : "Follow these 6 steps to import your vehicle with confidence. From research to registration, we guide you through every stage of the process."}
        </p>
      </div>

      {/* Timeline Section */}
      <section className="mb-16">
        {/* Desktop horizontal timeline */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-6 gap-4 mb-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="relative flex flex-col items-center">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className="absolute top-8 left-1/2 w-full h-0.5 bg-[#10b981]/30" />
                )}
                {/* Step circle */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-lg mb-4">
                  <div
                    dangerouslySetInnerHTML={{ __html: stepIcons[idx] }}
                  />
                </div>
                {/* Step number badge */}
                <span className="absolute -top-2 -right-1 w-6 h-6 rounded-full bg-[#f59e0b] text-[#1a1f36] text-xs font-bold flex items-center justify-center shadow">
                  {step.number}
                </span>
                {/* Content */}
                <h3 className="text-sm font-bold text-[#1a1f36] text-center mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="lg:hidden space-y-0">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative flex gap-4">
              {/* Vertical line */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-lg shrink-0 relative">
                  <div
                    className="w-6 h-6"
                    dangerouslySetInnerHTML={{ __html: stepIcons[idx].replace('class="w-8 h-8"', 'class="w-6 h-6"') }}
                  />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#f59e0b] text-[#1a1f36] text-[10px] font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-0.5 flex-1 bg-[#10b981]/30 my-2" />
                )}
              </div>
              {/* Content */}
              <div className="pb-8">
                <h3 className="font-bold text-[#1a1f36] mb-1">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-[#1a1f36] mb-6">
          {lang === "fr" ? "Questions Frequentes" : "Frequently Asked Questions"}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="border border-gray-200 rounded-lg p-4 group"
            >
              <summary className="font-semibold text-[#1a1f36] cursor-pointer list-none flex items-center justify-between">
                {faq.question}
                <span className="ml-2 text-[#10b981] group-open:rotate-180 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#1a1f36] to-[#2d3452] rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          {lang === "fr"
            ? "Pret a Calculer Vos Couts d'Importation ?"
            : "Ready to Calculate Your Import Cost?"}
        </h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          {lang === "fr"
            ? "Utilisez notre calculateur gratuit pour estimer les droits de douane, la TVA et les frais totaux pour votre vehicule."
            : "Use our free calculator to estimate duties, VAT, and total fees for your specific vehicle."}
        </p>
        <a
          href={`/${lang}/calculator`}
          className="inline-block bg-[#f59e0b] hover:bg-[#d97706] text-[#1a1f36] font-bold py-3 px-8 rounded-lg transition shadow-lg"
        >
          {lang === "fr"
            ? "Calculer Mon Cout d'Importation"
            : "Calculate Your Import Cost Now"}
        </a>
      </section>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
