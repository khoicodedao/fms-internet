"use client";
// import type { Metadata } from "next";
import localFont from "next/font/local";
import { ConfigProvider } from "antd";
import Header from "@/components/Header";
import { TerminalContextProvider } from "react-terminal";
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
import { usePathname } from "next/navigation";
const queryClient = new QueryClient();
// export const metadata: Metadata = {
//   title: "FMS Internet",
//   description: "FMS Internet Management System",
// };

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TerminalContextProvider>
          <ConfigProvider>
            {!isLoginPage && <Header />}
            <DateProvider>
              <QueryClientProvider client={queryClient}>
                <main className="mt-24">{children}</main>
              </QueryClientProvider>
            </DateProvider>
          </ConfigProvider>
        </TerminalContextProvider>
      </body>
    </html>
  );
}
