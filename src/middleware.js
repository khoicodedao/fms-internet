import { NextResponse } from "next/server";

export async function middleware(request) {
  const backendUrlBase = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = request.nextUrl.clone();
  const authToken = request.cookies.get("auth_token")?.value;

  // ✅ Cho phép Next.js xử lý các API nội bộ
  if (url.pathname.startsWith("/api/filters")) {
    return NextResponse.next(); // không proxy, xử lý bằng route.ts
  }

  // Redirect nếu đã đăng nhập và vào /login
  if (url.pathname === "/login") {
    if (authToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ✅ Proxy các API khác sang backend
  if (url.pathname.startsWith("/api")) {
    const backendUrl = `${backendUrlBase}${url.pathname}`;
    const body = request.method !== "GET" ? await request.json() : null;

    try {
      const response = await fetch(backendUrl, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        body: body ? JSON.stringify(body) : null,
      });

      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      return NextResponse.json(
        { error: "Internal Server Error", message: error.message },
        { status: 500 }
      );
    }
  }

  // Bảo vệ route không có token
  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|favicon.ico).*)"],
};
