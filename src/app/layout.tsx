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
  title: "جمالكِ | Jamalik - موقع المرأة العربية الشامل",
  description:
    "موقع شامل للمرأة العربية يغطي الموضة والطبخ والعناية بالبشرة والشعر واللياقة البدنية والتجميل والصحة. نصائح ومقالات ووصفات يومية تناسب جميع الأعمار.",
  keywords: [
    "جمالك",
    "موضة",
    "طبخ",
    "بشرة",
    "شعر",
    "لياقة",
    "تجميل",
    "صحة",
    "وصفات",
    "مرأة عربية",
    "عناية بالبشرة",
    "عناية بالشعر",
    "مكياج",
    "أزياء",
    " رجيم",
    "حمية",
    "تمارين رياضية",
    "وصفات طبيعية",
    "نصائح جمالية",
    "صحة المرأة",
    "إطلالات",
    "ديكور",
    "أمومة",
    "طبخ صحي",
    "خلطات طبيعية",
    "فاشن",
    "ستايل",
  ],
  authors: [{ name: "جمالكِ" }],
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
    title: "جمالكِ | Jamalik",
    description: "موقع المرأة العربية الشامل - الموضة والطبخ والجمال والصحة",
    type: "website",
    locale: "ar_AR",
    siteName: "جمالكِ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "جمالكِ - موقع المرأة العربية الشامل",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "جمالكِ | Jamalik",
    description: "موقع المرأة العربية الشامل - الموضة والطبخ والجمال والصحة",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'جمالكِ',
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
        <meta name="apple-mobile-web-app-title" content="جمالكِ" />
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
              name: 'جمالكِ',
              alternateName: 'Jamalik',
              url: 'https://jamalik.app',
              description: 'موقع شامل للمرأة العربية يغطي الموضة والطبخ والعناية بالبشرة والشعر واللياقة والتجميل والصحة',
              inLanguage: 'ar',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://jamalik.app/?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'جمالكِ',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://jamalik.app/icons/icon-512.png',
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
