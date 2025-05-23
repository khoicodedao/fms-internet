const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const externalServerUrl = "wss://10.32.116.195:8444";
const cert = fs.readFileSync(path.join(__dirname, "./certs/client.crt"));
const key = fs.readFileSync(path.join(__dirname, "./certs/client.key"));
// const ca = fs.readFileSync(path.join(__dirname, "../certs/root_ca.crt"));

let externalSocket = null;
let reconnectTimeout = null;

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
