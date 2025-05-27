// socketClient.js
require("dotenv").config();
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const externalServerUrl = process.env.EXTERNAL_SERVER_URL;

let socket = null;

function connectToSocketServer() {
  const cert = fs.readFileSync(path.join(__dirname, "./certs/client.crt"));
  const key = fs.readFileSync(path.join(__dirname, "./certs/client.key"));
  // Nếu cần CA, bỏ comment dòng dưới
  // const ca = fs.readFileSync(path.join(__dirname, "../certs/root_ca.crt"));

  socket = new WebSocket(externalServerUrl, {
    cert,
    key,
    // ca,
    rejectUnauthorized: false, // Để test, production nên để true và truyền đúng CA
  });

  socket.on("open", () => {
    console.log("Connected to WebSocket server");
    socket.send(JSON.stringify({ type: "new_user", nickname: "backend" }));
  });

  socket.on("message", (data) => {
    const message = JSON.parse(data);
    console.log("Message from WS server:", message);
    // Optionally emit to clients via SSE or socket.io
  });

  socket.on("close", () => {
    console.log("WebSocket connection closed");
    // Reconnect logic can go here
  });

  socket.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
}

function sendMessageToSocketServer(messageObj) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(messageObj));
  } else {
    throw new Error("WebSocket not connected");
  }
}

module.exports = {
  connectToSocketServer,
  sendMessageToSocketServer,
};
