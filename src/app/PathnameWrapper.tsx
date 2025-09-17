"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import { ReactNode } from "react";

export default function PathnameWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Header />}
      <main className="mt-24">{children}</main>
    </>
  );
}
