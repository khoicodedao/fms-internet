import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
export async function middleware(request) {
  const url = request.nextUrl.clone();
  const authToken = request.cookies.get("auth_token")?.value || "";
  const { pathname } = url;
  // ✅ Cho phép Next xử lý các route nội bộ hoặc API proxy tới backend
  if (
    url.pathname.startsWith("/api/remote_edrs") ||
    url.pathname.startsWith("/api/remote_ndrs") ||
    url.pathname.startsWith("/api/be") // 👈 thêm dòng này
  ) {
    return NextResponse.next();
  }

  // Cho phép truy cập login nếu chưa có token
  if (url.pathname === "/login") {
    if (authToken) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  let role;
  try {
    const payload = jwtDecode(authToken);
    role = payload?.role;
  } catch {
    // token hỏng -> tuỳ bạn: cho next hoặc redirect login
    return NextResponse.next();
  }
  // ✅ Cho phép mọi request khác nếu có token
  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const BLOCKED_PREFIXES = ["/users", "/cli", "/investigation"];
  if (
    role === "user" &&
    BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
