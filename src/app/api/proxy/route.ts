import path from "path";
import https from "https";
import fs from "fs";
// / @ts-ignore
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

// / @ts-ignore
export async function POST(req: any) {
  const cert = fs.readFileSync(path.join(process.cwd(), "certs", "client.crt"));
  const key = fs.readFileSync(path.join(process.cwd(), "certs", "client.key"));
  // const ca = fs.readFileSync(path.join(process.cwd(), "certs", "root_ca.crt"));

  const agent = new https.Agent({ cert, key, rejectUnauthorized: false });

  const body = await req.json();
  const response = await fetch(
    `${process.env.CERTIFICATE_URL}/get-certificate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      agent,
    }
  );

  const data = await response.json();
  return Response.json(data, { status: response.status });
}
