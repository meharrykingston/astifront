import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://astikan.ai"),
  title: {
    default: "Astikan",
    template: "%s | Astikan",
  },
  description:
    "Astikan is an AI-powered health navigator that helps you understand symptoms and find the right next steps.",
  applicationName: "Astikan",
  keywords: [
    "Astikan",
    "health",
    "symptom checker",
    "AI health assistant",
    "telemedicine",
    "clinical decision support",
  ],
  authors: [{ name: "Astikan" }],
  creator: "Astikan",
  publisher: "Astikan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Astikan",
    description:
      "AI-powered health navigator for symptom analysis and next-step guidance.",
    url: "/",
    siteName: "Astikan",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astikan",
    description:
      "AI-powered health navigator for symptom analysis and next-step guidance.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2f6df6",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
