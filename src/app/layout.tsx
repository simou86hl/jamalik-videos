import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مسلسلات أونلاين | شاهد أحدث المسلسلات",
  description:
    "شاهد أحدث المسلسلات العربية والعالمية بجودة عالية. دراما، كوميدي، أكشن، رومانسي، تركية، هندية، كرتون، وثائقي. بث مباشر وتحميل.",
  keywords: [
    "مسلسلات",
    "دراما",
    "كوميدي",
    "أكشن",
    "رومانسي",
    "تركية",
    "هندية",
    "كرتون",
    "وثائقي",
    "مسلسلات عربية",
    "مسلسلات تركية",
    "بث مباشر",
    "مشاهدة أونلاين",
    "أفلام",
    "حلقات جديدة",
  ],
  authors: [{ name: "مسلسلات أونلاين" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "مسلسلات أونلاين | Musalsalat Online",
    description: "شاهد أحدث المسلسلات العربية والعالمية بجودة عالية",
    type: "website",
    locale: "ar_AR",
    siteName: "مسلسلات أونلاين",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "مسلسلات أونلاين - شاهد أحدث المسلسلات",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "مسلسلات أونلاين | Musalsalat Online",
    description: "شاهد أحدث المسلسلات العربية والعالمية بجودة عالية",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'مسلسلات أونلاين',
    'theme-color': '#c2185b',
    'msapplication-TileColor': '#c2185b',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="theme-color" content="#c2185b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="مسلسلات أونلاين" />
      </head>
      <body
        className={`${cairo.variable} ${tajawal.variable} min-h-screen antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>

        {/* JSON-LD Structured Data - WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'مسلسلات أونلاين',
              alternateName: 'Musalsalat Online',
              url: 'https://musalsalat.online',
              description: 'شاهد أحدث المسلسلات العربية والعالمية بجودة عالية. دراما، كوميدي، أكشن، رومانسي، تركية، هندية، كرتون، وثائقي',
              inLanguage: 'ar',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://musalsalat.online/?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'مسلسلات أونلاين',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://musalsalat.online/icons/icon-512.png',
                },
              },
            }),
          }}
        />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
