export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import https from "https";
import http from "http";
import { NextRequest, NextResponse } from "next/server";
import { URL } from "url";

// 👉 Export từng HTTP method theo cách cho phép dùng `params`
export async function GET(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  return handler(req, context.params);
}
export async function POST(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  return handler(req, context.params);
}
export async function PUT(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  return handler(req, context.params);
}
export async function DELETE(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  return handler(req, context.params);
}
export async function PATCH(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  return handler(req, context.params);
}
export async function OPTIONS(
  req: NextRequest,
  context: { params: { path: string[] } }
) {
  return handler(req, context.params);
}

// 👉 Hàm xử lý chính
async function handler(req: NextRequest, params: { path: string[] }) {
  // console.log("Request received:", req.method, params.path);
  return proxyRequest(req, params.path);
}

// 👉 Hàm proxy request
async function proxyRequest(req: NextRequest, path: string[]) {
  const backendUrlBase = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrlBase) {
    return NextResponse.json({ error: "Missing backend URL" }, { status: 500 });
  }

  const targetUrl = new URL(`/api-auth/api/${path.join("/")}`, backendUrlBase);
  console.log("[Proxy to]:", targetUrl.href);

  const method = req.method;
  const headers: Record<string, string> = {};

  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();

    // Bỏ qua các header không cần thiết
    if (["host", "content-length"].includes(lowerKey)) return;
    // Đảm bảo giữ lại Authorization
    headers[key] = value;
  });

  const body = !["GET", "HEAD"].includes(method) ? await req.text() : undefined;

  return new Promise((resolve) => {
    const lib = targetUrl.protocol === "https:" ? https : http;

    const request = lib.request(
      {
        method,
        headers,
        hostname: targetUrl.hostname,
        port: targetUrl.port,
        path: targetUrl.pathname + targetUrl.search,
        rejectUnauthorized: false,
        agent: new https.Agent({ rejectUnauthorized: false }),
      },
      (res) => {
        const chunks: Uint8Array[] = [];

        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          const responseBody = Buffer.concat(chunks);
          const response = new NextResponse(responseBody, {
            status: res.statusCode,
          });

          for (const [key, value] of Object.entries(res.headers)) {
            if (value) {
              response.headers.set(
                key,
                Array.isArray(value) ? value.join(", ") : value
              );
            }
          }

          resolve(response);
        });
      }
    );

    request.on("error", (err) => {
      console.error("Proxy error:", err);
      resolve(
        NextResponse.json(
          { error: "Proxy failed", message: err.message },
          { status: 500 }
        )
      );
    });

    if (body) request.write(body);
    request.end();
  });
}
