/* eslint-disable */
/* 
    +----------------------+
    |  WebSocket Server    |
    +----------------------+
               |
               | (1) Client kết nối
               v
    +----------------------+
    |   Nhận kết nối mới   |
    +----------------------+
               |
               | (2) Gửi xác nhận "you connected"
               v
    +----------------------+
    | Chờ nhận tin nhắn WS |
    +----------------------+
               |
               | (3) Client gửi tin nhắn (message event)
               v
    +----------------------+
    |   Phân loại message  |
    +----------------------+
       |       |       |
       |       |       |
       |       |       |-------------------+
       |       |                           |
       v       v                           v
 +----------------+             +----------------+
 |  new_user     |             | request/response|
 +----------------+             +----------------+
       |                              |
       | (4) Lưu user vào users{}     | (5) Xác thực JWT
       |                              | Nếu lỗi -> đóng WS
       |                              v
       v                  +-----------------------+
 +----------------+       | Gửi tin nhắn tới user |
 | Broadcast user|       +-----------------------+
 +----------------+
       |
       v
    (6) Chờ tin nhắn tiếp theo hoặc ngắt kết nối


Gửi tin nhắn JSON để đăng ký user mới
{
  "type": "new_user",
  "nickname": "user123"
}

Gửi tin nhắn đến user khác

{
  "type": "request",
  "token": "YOUR_JWT_TOKEN",
  "from_user": "user456",
  "to_user": "user456",
  "dir":"/var"
  "message": "Hello!"
}

{
  "type": "request",
  "token": "YOUR_JWT_TOKEN",
  "from_user": "user456",
  "to_user": "user456",
  "message": "Get directory"
}

Gửi phản hồi lại
{
  "type": "response",
  "token": "YOUR_JWT_TOKEN",
  "from_user": "user456",
  "to_user": "user123",
  "message": "Hi, user123!"
  dir":"/root/"
}
*/

const fs = require("fs");
const https = require("https");
const { WebSocketServer, WebSocket } = require("ws");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = "TT5P25fms@2022";

// Đọc chứng chỉ SSL từ file `server.cert` và `server.key`
const options = {
  cert: fs.readFileSync("server.cert"),
  key: fs.readFileSync("server.key"),
};

// Tạo HTTPS Server sử dụng chứng chỉ SSL
const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end("WebSocket Secure Server is running!");
});

// Khởi tạo WebSocket Server trên HTTPS
const wss = new WebSocketServer({ server });
const clients = {};

console.log("WebSocket server đang chạy trên HTTPS...");

wss.on("connection", (ws) => {
  let nickname = null;
  console.log("Client mới kết nối");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Nhận tin nhắn:", data);

      if (data.type === "new_user") {
        nickname = data.nickname;
        clients[nickname] = ws;
        console.log(`Người dùng ${nickname} đã kết nối.`);

        broadcastClients();
      }

      if (data.type === "request" || data.type === "response") {
        let token = data.token;
        jwt.verify(token, secretKey, (err, decoded) => {
          if (err) {
            console.log("Lỗi xác thực token:", err.message);
            ws.send(
              JSON.stringify({ type: "error", message: "Token không hợp lệ" })
            );
            ws.close();
          } else {
            let from_user = decoded.user_name;
            let to_user = data.to_user;

            if (clients[to_user]) {
              clients[to_user].send(JSON.stringify(data));
              console.log(`Gửi tin nhắn từ ${from_user} đến ${to_user}`);
            } else {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Người nhận không online",
                })
              );
            }
          }
        });
      }

      if (data.type === "get_clients") {
        sendClientList(ws);
      }
    } catch (error) {
      console.error("Lỗi xử lý tin nhắn:", error);
    }
  });

  ws.on("close", () => {
    if (nickname) {
      console.log(`Người dùng ${nickname} đã ngắt kết nối.`);
      delete clients[nickname];
      broadcastClients();
    }
  });
});

// Lắng nghe HTTPS trên cổng 8443
server.listen(8443, () => {
  console.log("Server HTTPS đang chạy trên cổng 8443...");
});

// Broadcast tin nhắn đến tất cả client trừ người gửi
function broadcastClients(data, sender) {
  Object.values(clients).forEach((client) => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });

  let clientList = Object.keys(clients);
  let message = JSON.stringify({ type: "clients_list", clients: clientList });

  Object.values(clients).forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  console.log("Danh sách clients đã được cập nhật:", clientList);
}
function sendClientList(ws) {
  let clientList = Object.keys(clients);
  ws.send(JSON.stringify({ type: "clients_list", clients: clientList }));
}
