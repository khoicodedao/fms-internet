/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { Input, List, Avatar, Badge, Button, message } from "antd";
import { DesktopOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

const commands: { [key: string]: string } = {
  help: "Available commands: help, clear, exit, list, show, start, stop, restart, ipconfig, dir, copy, del, move, mkdir, rmdir, ping, tasklist, taskkill, chkdsk, cls, color, date, echo, find, hostname, netstat, path, pause, shutdown, systeminfo, time, tree, type, ver, wmic",
  list: "Listing items...",
  show: "Showing item...",
  start: "Starting service...",
  stop: "Stopping service...",
  restart: "Restarting service...",
  ipconfig: "Displaying IP configuration...",
  dir: "Displaying list of directories...",
  copy: "Copying files...",
  del: "Deleting files...",
  move: "Moving files...",
  mkdir: "Creating directory...",
  rmdir: "Removing directory...",
  ping: "Pinging network...",
  tasklist: "Listing tasks...",
  taskkill: "Killing task...",
  chkdsk: "Checking disk...",
  cls: "Clearing screen...",
  color: "Changing console color...",
  date: "Displaying or setting date...",
  echo: "Displaying messages...",
  find: "Finding text in a file...",
  hostname: "Displaying hostname...",
  netstat: "Displaying network statistics...",
  path: "Displaying or setting path...",
  pause: "Pausing the command prompt...",
  shutdown: "Shutting down the computer...",
  systeminfo: "Displaying system information...",
  time: "Displaying or setting time...",
  tree: "Displaying directory tree...",
  type: "Displaying contents of a file...",
  ver: "Displaying Windows version...",
  wmic: "Windows Management Instrumentation Command-line...",
};

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

  const connectToWebSocket = () => {
    const ws = new WebSocket("wss://localhost:8443");
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
        <span className="">{`Welcome to ${computer.name} (${computer})`} </span>
      </TerminalOutput>,
    ]);
  };

  const handleCommandInput = (terminalInput: string) => {
    setCurrentInput(terminalInput);

    if (commands[terminalInput]) {
      setTerminalLineData([
        ...terminalLineData,
        <TerminalOutput key={terminalInput}>{terminalInput}</TerminalOutput>,
      ]);

      if (socket) {
        socket.send(
          JSON.stringify({
            type: "request",
            token: token,
            to_user: selectedMac,
            message: terminalInput,
          })
        );
      } else {
        error("WebSocket is not open");
      }
    } else {
      setTerminalLineData([
        ...terminalLineData,
        <TerminalOutput key={terminalInput}>{terminalInput}</TerminalOutput>,
      ]);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {contextHolder}
      <div
        style={{ width: "20%", padding: "10px", borderRight: "1px solid #ccc" }}
      >
        <Button type="link" href="https://localhost:8443" target="_blank">
          Open WebSocket
        </Button>
        <Button type="primary" onClick={connectToWebSocket}>
          Connect to WebSocket
        </Button>

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
