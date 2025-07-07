import type { Metadata } from "next";
import { Inter, Sarabun } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const sarabun = Sarabun({ 
  subsets: ["thai", "latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-sarabun",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ระบบขอใช้โดเมน - มหาวิทยาลัยราชภัฏนครศรีธรรมราช",
  description: "ระบบขอใช้ชื่อโดเมนของมหาวิทยาลัยราชภัฏนครศรีธรรมราช",
  keywords: "โดเมน, มหาวิทยาลัยราชภัฏนครศรีธรรมราช, NSTRU, domain request",
  authors: [{ name: "NSTRU IT Department" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ea580c",
  robots: "index, follow",
  openGraph: {
    title: "ระบบขอใช้โดเมน - มหาวิทยาลัยราชภัฏนครศรีธรรมราช",
    description: "ระบบขอใช้ชื่อโดเมนของมหาวิทยาลัยราชภัฏนครศรีธรรมราช",
    type: "website",
    locale: "th_TH",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${inter.variable} ${sarabun.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#ea580c" />
        <meta name="theme-color" content="#ea580c" />
      </head>
      <body className={`${sarabun.className} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
