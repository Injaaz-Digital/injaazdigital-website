import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";
import { Geist, IBM_Plex_Sans_Arabic, Manrope, Syne } from "next/font/google";
import { SITE_URL } from "@/lib/config/site-config";
import { getLocaleDirection } from "@/lib/i18n/locale";
import { getInitialLang } from "@/lib/i18n/locale.server";
import { getServerEnv } from "@/lib/config/env";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-syne",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
  display: "swap",
});

const domaine = localFont({
  src: [
    {
      path: "../fonts/domaine/DomaineDispNar-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/domaine/DomaineDispNar-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/domaine/DomaineDispNar-Semibold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-domaine",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Injaaz Digital",
    template: "%s",
  },
  description: "Data-driven digital growth systems for ambitious brands.",
};

export default async function RootLayout({ children }) {
  const htmlLang = await getInitialLang();
  const htmlDir = getLocaleDirection(htmlLang);
  const flowEnv = getServerEnv();
  const flowSiteId = flowEnv.CONTENT_ANALYZER_BOOKING_SITE_ID;
  const flowSdkUrl = flowEnv.CONTENT_ANALYZER_API_URL ? new URL('/flow.js', flowEnv.CONTENT_ANALYZER_API_URL).toString() : '';

  return (
    <html lang={htmlLang} dir={htmlDir} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geist.className} ${arabic.className} ${geist.variable} ${manrope.variable} ${syne.variable} ${arabic.variable} ${domaine.variable} bg-white/88`}
      >
        {process.env.NODE_ENV === 'development' ? <Script src="https://mcp.figma.com/mcp/html-to-design/capture.js" strategy="afterInteractive" /> : null}
        {flowSiteId && flowSdkUrl ? <Script id="flow-website-intelligence" src={flowSdkUrl} data-site-id={flowSiteId} strategy="afterInteractive" /> : null}
        {children}
      </body>
    </html>
  );
}
