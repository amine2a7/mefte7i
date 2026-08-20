import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import {
  APP_NAME,
  APP_TAGLINE,
  SITE_CITY,
  SITE_COUNTRY,
  SITE_URL,
  SUPPORT_PHONE,
} from "@/lib/constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "Serrurerie et sécurité en Tunisie : réparation et vente de clés pour voitures et maisons. Intervention rapide à Tunis et sa région, service 24h/24 et 7j/7.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s — ${APP_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "serrurier Tunisie",
    "serrurier Tunis",
    "réparation clé voiture",
    "clé voiture perdue",
    "double de clé",
    "changement serrure",
    "dépannage serrurerie",
    "clé de maison cassée",
    "programmation clé voiture",
  ],
  applicationName: APP_NAME,
  openGraph: {
    type: "website",
    locale: "fr_TN",
    siteName: APP_NAME,
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Locksmith",
  name: APP_NAME,
  description: DESCRIPTION,
  areaServed: SITE_COUNTRY,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE_CITY,
    addressCountry: "TN",
  },
  telephone: SUPPORT_PHONE,
  priceRange: "$$",
  openingHours: "Mo-Su 00:00-23:59",
  url: SITE_URL,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
