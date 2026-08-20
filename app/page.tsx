import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { ServicesSection } from "@/components/landing/services-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { CoverageZone } from "@/components/landing/coverage-zone";
import { Footer } from "@/components/landing/footer";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
    languages: { fr: SITE_URL, ar: `${SITE_URL}/ar` },
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ServicesSection />
        <HowItWorks />
        <Testimonials />
        <CoverageZone />
      </main>
      <Footer />
    </>
  );
}
