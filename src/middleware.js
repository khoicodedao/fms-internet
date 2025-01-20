import { NextResponse } from "next/server";

export async function middleware(request) {
  const backendUrlBase = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = request.nextUrl.clone();

  // Get auth token from cookies
  const authToken = request.cookies.get("auth_token")?.value;

  // Check if path is /login
  if (url.pathname === "/login") {
    // If user has valid token, redirect to home
    if (authToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // For API routes
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

  // Protect all other routes
  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|favicon.ico).*)"],
};
