import { NextResponse } from "next/server";

export async function middleware(request) {
  const backendUrlBase = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith("/api")) {
    // Thay đổi path của API khi gọi tới backend
    const backendUrl = `${backendUrlBase}${url.pathname}`;
    const body = request.method !== "GET" ? await request.json() : null;
    try {
      const response = await fetch(backendUrl, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
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

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
