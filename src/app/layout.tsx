/* eslint-disable */
"use client";
// import type { Metadata } from "next";
import localFont from "next/font/local";
import { ConfigProvider } from "antd";
import Header from "@/components/Header";
import { TerminalContextProvider } from "react-terminal";
import "./globals.css";
import { DateProvider } from "../common/date-context"; // Import Context
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appWithTranslation } from "next-i18next";
import "../common/i18n";
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
import "@fortawesome/fontawesome-free/css/all.min.css";
import "vis-network/styles/vis-network.css";

import { usePathname } from "next/navigation";
const queryClient = new QueryClient();
// export const metadata: Metadata = {
//   title: "FMS Internet",
//   description: "FMS Internet Management System",
// };

import { ReactNode } from "react";

function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TerminalContextProvider>
          <ConfigProvider>
            <QueryClientProvider client={queryClient}>
              {!isLoginPage && <Header />}
              <DateProvider>
                <main className="mt-24">{children}</main>
              </DateProvider>
            </QueryClientProvider>
          </ConfigProvider>
        </TerminalContextProvider>
      </body>
    </html>
  );
}
//@ts-ignore
export default appWithTranslation(RootLayout);
