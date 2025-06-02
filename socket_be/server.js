process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config();
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const https = require("https");

const express = require("express");
const externalServerUrl = process.env.EXTERNAL_SERVER_URL;
const axios = require("axios");
const cert = fs.readFileSync(path.join(__dirname, "./certs/client.crt"));
const key = fs.readFileSync(path.join(__dirname, "./certs/client.key"));
const ca = fs.readFileSync(path.join(__dirname, "./certs/root_ca.crt"));

const app = express();
app.use(express.json()); // parse JSON body
let externalSocket = null;
let reconnectTimeout = null;
// Tạo Agent dùng client certificate
const httpsAgent = new https.Agent({
  cert,
  key,
  ca,
  rejectUnauthorized: false, // hoặc true nếu server ngoài có chứng chỉ hợp lệ
});
function connectExternalSocket() {
  externalSocket = new WebSocket(externalServerUrl, {
    cert,
    key,
    // ca,
    rejectUnauthorized: false,
  });

  externalSocket.on("open", () => {
    console.log("Connected to external websocket server");
    externalSocket.send(
      JSON.stringify({ type: "new_user", nickname: "backend" })
    );
  });

  externalSocket.on("message", (data) => {
    const str = data.toString();
    console.log("Received from external server:", str);
    broadcastToFrontendClients(str);
  });

  externalSocket.on("close", () => {
    console.log("External websocket disconnected");
    // Tự động reconnect sau 3 giây
    reconnectTimeout = setTimeout(connectExternalSocket, 3000);
  });

  externalSocket.on("error", (err) => {
    console.error("External websocket error:", err);
    // Nếu socket bị lỗi và đã đóng, thử reconnect
    if (externalSocket.readyState !== WebSocket.OPEN && !reconnectTimeout) {
      reconnectTimeout = setTimeout(connectExternalSocket, 3000);
    }
  });
}

// Gọi hàm kết nối lần đầu
connectExternalSocket();

// WebSocket server cho FE
const wss = new WebSocket.Server({ port: 3001 });
let frontendClients = [];

wss.on("connection", (ws) => {
  console.log("Frontend client connected");
  frontendClients.push(ws);

  ws.on("message", (message) => {
    console.log("Received from FE:", message.toString());
    // Nếu externalSocket chưa kết nối, thử reconnect
    if (!externalSocket || externalSocket.readyState !== WebSocket.OPEN) {
      console.log("External socket not connected, reconnecting...");
      connectExternalSocket();
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Đang kết nối lại tới server ngoài...",
        })
      );
      return;
    }
    externalSocket.send(message);
  });

  ws.on("close", () => {
    console.log("Frontend client disconnected");
    frontendClients = frontendClients.filter((client) => client !== ws);
  });
});

function broadcastToFrontendClients(data) {
  frontendClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

console.log("WebSocket server listening on port 3001");
// ✅ API route: POST /api/edrs
app.post("/api/edrs", async (req, res) => {
  const body = req.body;
  console.log("Received data:", body);
  try {
    const response = await axios.post(
      `${process.env.SOCKET_SERVER_URL}/api/edrs`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        httpsAgent, // gắn agent để xử lý SSL
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Failed to send to socket server:", error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});
app.post("/api/edrs/get", async (req, res) => {
  const body = req.body;
  try {
    const response = await axios.post(
      `${process.env.SOCKET_SERVER_URL}/api/edrs/get`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        httpsAgent, // gắn agent để xử lý SSL
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Failed to send to socket server:", error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/api/ndrs", async (req, res) => {
  const body = req.body;

  try {
    const response = await fetch(`${process.env.SOCKET_SERVER_URL}/api/ndrs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body.columns),
      agent: httpsAgent,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Failed to send to socket server:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/api/ndrs/get", async (req, res) => {
  const body = req.body;

  try {
    const response = await fetch(`${process.env.SOCKET_SERVER_URL}/api/ndrs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      agent: httpsAgent,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Failed to send to socket server:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// HTTP server
const server = https.createServer({ key, cert }, app);
server.listen(3002, () => {
  console.log("HTTPS + WebSocket server running on port 3002");
});
