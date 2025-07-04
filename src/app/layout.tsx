import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ระบบขอใช้โดเมน - มหาวิทยาลัยราชภัฏนครศรีธรรมราช",
  description: "ระบบขอใช้ชื่อโดเมนของมหาวิทยาลัยราชภัฏนครศรีธรรมราช",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
