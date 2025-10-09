// lib/client-role.ts
"use client";
import { jwtDecode } from "jwt-decode";

export type Role = "admin" | "user" | "superAdmin";

export function readRoleFromCookieNonSecure(
  cookieName = "auth_token"
): Role | null {
  const cookie =
    typeof document !== "undefined"
      ? document.cookie.split("; ").find((c) => c.startsWith(cookieName + "="))
      : undefined;
  if (!cookie) return null;
  try {
    const token = cookie.split("=")[1];
    const payload = jwtDecode<any>(token);
    return (payload?.role as Role) ?? null;
  } catch {
    return null;
  }
}
