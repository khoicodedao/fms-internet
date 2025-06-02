import fetch from "node-fetch";
import https from "https";
import dotenv from "dotenv";
dotenv.config();

// Convert ENV cert/key with proper newlines
const cert = process.env.CLIENT_CERT?.replace(/\\n/g, "\n");
const key = process.env.CLIENT_KEY?.replace(/\\n/g, "\n");

const httpsAgent = new https.Agent({
  cert,
  key,
  rejectUnauthorized: false, // 🔒 Tùy chọn: false nếu server dùng self-signed cert
});

// @ts-ignore
export async function POST(req: any) {
  const body = await req.json();
  console.log(body);

  const response = await fetch(
    `${process.env.SOCKET_SERVER_URL_API}/api/edrs`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      agent: httpsAgent, // 👈 Thêm agent vào đây
    }
  );

  const data = await response.json();
  return Response.json(data, { status: response.status });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mac_address = url.searchParams.get("mac_address");

  if (!mac_address) {
    return new Response(JSON.stringify({ error: "mac_address is required" }), {
      status: 400,
    });
  }

  const response = await fetch(
    `${process.env.SOCKET_SERVER_URL_API}/api/edrs/get`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mac_address }), // 👈 Send mac_address in the body
      agent: httpsAgent, // 👈 Include httpsAgent if needed
    }
  );

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
