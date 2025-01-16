"use client";
// import type { Metadata } from "next";
import localFont from "next/font/local";
import { ConfigProvider } from "antd";
import Header from "@/components/Header";
import "./globals.css";
import { DateProvider } from "../common/date-context"; // Import Context
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const queryClient = new QueryClient();
// export const metadata: Metadata = {
//   title: "FMS Internet",
//   description: "FMS Internet Management System",
// };

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
        <ConfigProvider>
          <Header />

          <DateProvider>
            <QueryClientProvider client={queryClient}>
              <main className="mt-8">{children}</main>
            </QueryClientProvider>
          </DateProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
