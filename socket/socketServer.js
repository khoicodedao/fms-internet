/* eslint-disable no-console */
const fs = require("fs");
const https = require("https");
const WebSocket = require("ws");
const path = require("path");

// Load SSL certificate and key
const server = https.createServer(
  {
    cert: fs.readFileSync("server.cert"),
    key: fs.readFileSync("server.key"),
  },
  (req, res) => {
    // Serve the HTML file
    if (req.method === "GET" && req.url === "/") {
      fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Error loading index.html");
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        }
      });
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  }
);

const wss = new WebSocket.Server({ server });

const clients = new Map(); // Map to store clients by MAC address

const broadcastComputers = () => {
  const computers = Array.from(clients.values()).map((client) => ({
    mac: client.mac,
    name: client.name,
    online: client.ws.readyState === WebSocket.OPEN,
  }));

  wss.clients.forEach((client) => {
    console.log("client", client.mac);
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "update", computers }));
    }
  });
};

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    try {
      const data = JSON.parse(message);

      if (data.type === "register") {
        clients.set(data.mac, { ws, mac: data.mac, name: data.name });
        ws.mac = data.mac;
        ws.name = data.name;
        console.log(`Computer ${data.mac} (${data.name}) connected`);
        broadcastComputers();
      } else if (data.type === "command") {
        const targetClient = clients.get(data.mac);
        if (targetClient && targetClient.ws.readyState === WebSocket.OPEN) {
          console.log(`Sending command to ${data.mac}: ${data.command}`);
          wss.clients.forEach((client) => {
            if (
              client.readyState === WebSocket.OPEN &&
              client.mac === data.mac
            ) {
              client.send(
                JSON.stringify({ type: "command", command: data.command })
              );
            }
          });
        } else {
          console.log(`Client ${data.mac} is not available or disconnected.`);
        }
      } else if (data.type === "response") {
        console.log(`Response from ${data.mac}: ${data.result}`);
      } else if (data.type === "request_computers") {
        const computers = Array.from(clients.values()).map((client) => ({
          mac: client.mac,
          name: client.name,
          online: client.ws.readyState === WebSocket.OPEN,
        }));
        ws.send(JSON.stringify({ type: "update", computers }));
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    if (ws.mac) {
      clients.delete(ws.mac);
      console.log(`Computer ${ws.mac} disconnected`);
      broadcastComputers();
    }
  });
});

server.listen(8080, () => {
  console.log("WebSocket Secure server is running on wss://localhost:8080");
});
