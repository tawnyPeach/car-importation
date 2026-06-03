import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation lang={lang} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  );
}
