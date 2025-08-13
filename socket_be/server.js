process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config();
const url = require("url");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const https = require("https");
const express = require("express");
const axios = require("axios");

const cert = fs.readFileSync(path.join(__dirname, "./certs/client.crt"));
const key = fs.readFileSync(path.join(__dirname, "./certs/client.key"));
const ca = fs.readFileSync(path.join(__dirname, "./certs/root_ca.crt"));

const externalServerUrl = process.env.EXTERNAL_SERVER_URL;
const socketServerUrl = process.env.SOCKET_SERVER_URL;
const certServerUrl = process.env.CERTIFICATE_URL;

const app = express();
app.use(express.json());

let externalSocket = null;
let reconnectTimeout = null;

// Agent dùng client cert
const httpsAgent = new https.Agent({
  cert,
  key,
  ca,
  rejectUnauthorized: false,
});

// 🔌 Kết nối tới WebSocket ngoài
function connectExternalSocket() {
  externalSocket = new WebSocket(externalServerUrl, {
    cert,
    key,
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
    reconnectTimeout = setTimeout(connectExternalSocket, 3000);
  });

  externalSocket.on("error", (err) => {
    console.error("External websocket error:", err);
    if (externalSocket.readyState !== WebSocket.OPEN && !reconnectTimeout) {
      reconnectTimeout = setTimeout(connectExternalSocket, 3000);
    }
  });
}

connectExternalSocket();

// 📦 HTTPS server cho API (port 3002)
const apiServer = https.createServer({ key, cert }, app);
apiServer.listen(3002, () => {
  console.log("HTTPS API server running on port 3002");
});

// 🛰️ WSS WebSocket server cho frontend (port 3001)
const wssServer = https.createServer({ key, cert });
const wss = new WebSocket.Server({ server: wssServer });

let frontendClients = [];

wss.on("connection", (ws, req) => {
  console.log("Frontend client connected");
  const parsedUrl = url.parse(req.url, true); // parse query string
  const token = parsedUrl.query.token;

  // Nếu không có token thì từ chối kết nối
  if (!token) {
    ws.send(JSON.stringify({ type: "error", message: "Unauthorized" }));
    return ws.close();
  }
  frontendClients.push(ws);

  ws.on("message", (message) => {
    console.log("Received from FE:", message.toString());
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

wssServer.listen(3003, () => {
  console.log("Secure WebSocket (wss) server running on port 3003");
});

// ✅ API routes
app.post("/api/edrs", async (req, res) => {
  try {
    const macAddress = req.body?.mac_address;
    console.log("macAddress", macAddress);
    if (!macAddress) {
      return res.status(400).json({ error: "Missing mac_address" });
    }

    // Lấy certificate từ server
    const certResponse = await axios.post(
      `${certServerUrl}/get-certificate`,
      { common_name: macAddress },
      { httpsAgent } // agent có client cert để truy cập server
    );
    console.log("certResponse", certResponse.data);
    const { certificate, private_key } = certResponse.data;

    // Thêm vào body trước khi gửi
    const bodyWithCert = {
      ...req.body,
      crt: certificate,
      key: private_key,
    };
    console.log("bodyWithCert", bodyWithCert);
    const response = await axios.post(
      `${socketServerUrl}/api/edrs`,
      bodyWithCert,
      {
        headers: { "Content-Type": "application/json" },
        httpsAgent,
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error /api/edrs:", error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/api/edrs/get", async (req, res) => {
  try {
    const response = await axios.post(
      `${socketServerUrl}/api/edrs/get`,
      req.body,
      {
        headers: { "Content-Type": "application/json" },
        httpsAgent,
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error /api/edrs/get:", error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/api/ndrs", async (req, res) => {
  try {
    const macAddress = req.body?.mac_address;
    const columns = req.body;
    if (!macAddress) {
      return res.status(400).json({ error: "Missing mac_address or columns" });
    }

    // Lấy certificate từ server
    const certResponse = await axios.post(
      `${certServerUrl}/get-certificate`,
      { common_name: macAddress },
      { httpsAgent }
    );

    const { certificate, private_key } = certResponse.data;
    const bodyWithCert = {
      ...columns,
      crt: certificate,
      key: private_key,
    };
    const response = await axios.post(
      `${socketServerUrl}/api/ndrs`,
      bodyWithCert,
      {
        headers: { "Content-Type": "application/json" },
        httpsAgent,
      }
    );

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error /api/ndrs:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/ndrs/get", async (req, res) => {
  console.log("req.body", req.body);
  try {
    const response = await axios.post(
      `${socketServerUrl}/api/ndrs/get`,
      req.body,
      {
        headers: { "Content-Type": "application/json" },
        httpsAgent,
      }
    );
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error /api/ndrs/get:", error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});
