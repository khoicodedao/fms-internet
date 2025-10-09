import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
export async function middleware(request) {
  const url = request.nextUrl.clone();
  const authToken = request.cookies.get("auth_token")?.value || "";

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

  // ✅ Cho phép mọi request khác nếu có token
  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (url.pathname === "/users" && authToken) {
    const payload = jwtDecode(authToken);
    const role = payload?.role;
    console.log(role);
    if (role == "user") {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
