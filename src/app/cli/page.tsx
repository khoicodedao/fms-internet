/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { Input, List, Avatar, Badge, Button, message } from "antd";
import { DesktopOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
// const  = process.env.SOCKET_SERVER_URL;
const CLIPage = () => {
  const token = Cookies.get("auth_token");
  const [messageApi, contextHolder] = message.useMessage();
  const success = (text: string) => {
    messageApi.open({
      type: "success",
      content: text,
    });
  };

  const error = (text: string) => {
    messageApi.open({
      type: "error",
      content: text,
    });
  };

  const warning = (text: string) => {
    messageApi.open({
      type: "warning",
      content: text,
    });
  };

  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key="welcome">
      <span className="">{`Welcome to terminal`} </span>
    </TerminalOutput>,
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [selectedMac, setSelectedMac] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [filteredComputers, setFilteredComputers] = useState<any[]>([]);

  useEffect(() => {
    connectToWebSocket();
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);
  const connectToWebSocket = () => {
    const ws = new WebSocket("wss://10.32.116.195:8443");
    setSocket(ws);

    ws.onopen = () => {
      success("Connected to WebSocket server");
      // Request the list of connected computers
      ws.send(
        JSON.stringify({
          type: "new_user",
          nickname: "webclient",
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data", data);
      if (data) {
        if (data.type === "response") {
          setTerminalLineData((prev) => [
            ...prev,
            <TerminalOutput key={`output-${data.message}`}>
              <span style={{ color: "#00ff00" }}>{data.message}</span>
            </TerminalOutput>,
          ]);
        }
        if (data.type === "clients_list") {
          console.log("data.clients", data.clients);
          setFilteredComputers(data.clients);
        }
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
      error("Disconnected from WebSocket server");
    };

    return () => {
      ws.close();
    };
  };

  const handleComputerClick = (computer: any) => {
    setSelectedMac(computer);
    setTerminalLineData([
      <TerminalOutput key="welcome">
        <span className="">{`Welcome to (${computer})`} </span>
      </TerminalOutput>,
    ]);
  };

  const handleCommandInput = (terminalInput: string) => {
    setCurrentInput(terminalInput);
    setTerminalLineData([
      ...terminalLineData,
      <TerminalOutput key={terminalInput}>{terminalInput}</TerminalOutput>,
    ]);

    if (socket) {
      socket.send(
        JSON.stringify({
          type: "request",
          from_user: "webclient",
          token: token,
          to_user: selectedMac,
          message: terminalInput,
        })
      );
    } else {
      error("WebSocket is not open");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {contextHolder}
      <div
        style={{ width: "20%", padding: "10px", borderRight: "1px solid #ccc" }}
      >
        <Button type="link" href="https://10.32.116.195:8443" target="_blank">
          Open WebSocket
        </Button>
        {/* <Button type="primary" onClick={connectToWebSocket}>
          Connect to WebSocket
        </Button> */}

        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <List
          itemLayout="horizontal"
          dataSource={filteredComputers}
          renderItem={(computer) => (
            <List.Item
              onClick={() => handleComputerClick(computer)}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor:
                        selectedMac == computer ? "green" : "gray",
                    }}
                    icon={
                      <DesktopOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                  />
                }
                title={computer}
              />
              <Badge status={"success"} style={{ marginLeft: "auto" }} />
            </List.Item>
          )}
        />
      </div>
      <div style={{ width: "80%", padding: "10px", height: "100vh" }}>
        <Terminal
          name="Terminal"
          colorMode={ColorMode.Dark}
          prompt=">"
          onInput={handleCommandInput}
          startingInputValue=""
        >
          {terminalLineData}
        </Terminal>
      </div>
    </div>
  );
};

export default CLIPage;
