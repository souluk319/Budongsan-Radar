import type { Metadata, Viewport } from "next";
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

const appUrl =
  process.env.APP_URL?.startsWith("http") ? process.env.APP_URL : "http://localhost:3000";
const appDescription =
  "오늘 부동산 이슈를 내 상황 기준으로 쉽게 집어주는 데일리 브리프";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  applicationName: "집집",
  title: {
    default: "집집",
    template: "%s | 집집",
  },
  description: appDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "집집",
    title: "집집",
    description: appDescription,
  },
  twitter: {
    card: "summary",
    title: "집집",
    description: appDescription,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5ef",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
