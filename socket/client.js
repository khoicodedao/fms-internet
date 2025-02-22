const WebSocket = require("ws");

const ws = new WebSocket("wss://localhost:8080", {
  rejectUnauthorized: false, // Accept self-signed certificates
});

const macAddress = "00:1A:2B:3C:4D:5C"; // Replace with actual MAC address
const computerName = "NH/AUTHOR"; // Replace with actual computer name

ws.on("open", () => {
  console.log("Connected to WebSocket server");
  ws.send(
    JSON.stringify({ type: "register", mac: macAddress, name: computerName })
  );
  console.log(
    JSON.stringify({ type: "register", mac: macAddress, name: computerName })
  );
});

ws.on("message", (message) => {
  try {
    const data = JSON.parse(message);
    console.log(`Received message: ${JSON.stringify(data)}`);

    if (data.type === "command") {
      console.log(`Executing command: ${data.command}`);

      // Simulating command execution
      const result = `Command "${data.command}" executed successfully`;

      // Send response back to server
      ws.send(
        JSON.stringify({
          type: "response",
          mac: macAddress,
          command: data.command,
          result: result,
        })
      );
    }
    if (data.type == "update") {
      console.log("Computers: ", data.computers);
    }
  } catch (error) {
    console.error("Error processing message:", error);
  }
});

ws.on("close", () => {
  console.log("Disconnected from WebSocket server");
});

ws.on("error", (error) => {
  console.error(`WebSocket error: ${error.message}`);
});
