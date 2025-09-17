/* eslint-disable */
"use client";

import localFont from "next/font/local";
import { ConfigProvider } from "antd";
import { TerminalContextProvider } from "react-terminal";
import "./globals.css";
import { DateProvider } from "../common/date-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appWithTranslation } from "next-i18next";
import "../common/i18n";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "vis-network/styles/vis-network.css";

import { ReactNode, Suspense } from "react";
import PathnameWrapper from "./PathnameWrapper"; // 👈 tạo file riêng để xử lý usePathname

// Fonts
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

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TerminalContextProvider>
          <ConfigProvider>
            <QueryClientProvider client={queryClient}>
              <DateProvider>
                <Suspense fallback={null}>
                  <PathnameWrapper>{children}</PathnameWrapper>
                </Suspense>
              </DateProvider>
            </QueryClientProvider>
          </ConfigProvider>
        </TerminalContextProvider>
      </body>
    </html>
  );
}

// @ts-ignore
export default appWithTranslation(RootLayout);
