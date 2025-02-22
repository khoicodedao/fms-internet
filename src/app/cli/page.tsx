/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { Input, List, Avatar, Badge, Button, message } from "antd";
import { DesktopOutlined } from "@ant-design/icons";

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

interface Computer {
  mac: string;
  name: string;
  online: boolean;
}

const CLIPage = () => {
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
  const [matchingCommands, setMatchingCommands] = useState<string[]>([]);
  const [selectedMac, setSelectedMac] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [filteredComputers, setFilteredComputers] = useState<Computer[]>([]);

  const connectToWebSocket = () => {
    const ws = new WebSocket("wss://localhost:8080");
    setSocket(ws);

    ws.onopen = () => {
      success("Connected to WebSocket server");
      // Request the list of connected computers
      ws.send(JSON.stringify({ type: "request_computers" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.command) {
        setTerminalLineData((prev) => [
          ...prev,
          <TerminalOutput key={`output-${data.command}`}>
            <span style={{ color: "#00ff00" }}>{data.command}</span>
          </TerminalOutput>,
        ]);
      } else if (data.type === "update") {
        // Update the list of computers dynamically
        const updatedComputers = data.computers;
        setFilteredComputers(updatedComputers);
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

  useEffect(() => {
    const matchCommands = () => {
      const matches = Object.keys(commands).filter((cmd) =>
        cmd.startsWith(currentInput)
      );
      setMatchingCommands(matches);
    };

    matchCommands();
  }, [currentInput]);

  const handleComputerClick = (computer: Computer) => {
    setSelectedMac(computer.mac);
    setTerminalLineData([
      <TerminalOutput key="welcome">
        <span className="">
          {`Welcome to ${computer.name} (${computer.mac})`}{" "}
        </span>
      </TerminalOutput>,
    ]);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "register", mac: computer.mac }));
    } else {
      error("WebSocket is not open");
    }
  };

  const handleCommandInput = (terminalInput: string) => {
    setCurrentInput(terminalInput);

    if (commands[terminalInput]) {
      setTerminalLineData([
        ...terminalLineData,
        <TerminalOutput key={terminalInput}>{terminalInput}</TerminalOutput>,
        <TerminalOutput key={`output-${terminalInput}`}>
          <span style={{ color: "#00ff00" }}>{commands[terminalInput]}</span>
        </TerminalOutput>,
      ]);

      if (selectedMac && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "command",
            mac: selectedMac,
            command: terminalInput,
          })
        );
      } else {
        error("WebSocket is not open");
      }
    } else {
      setTerminalLineData([
        ...terminalLineData,
        <TerminalOutput key={terminalInput}>{terminalInput}</TerminalOutput>,
        <TerminalOutput key="not-found">
          <span style={{ color: "red" }}> Command not found</span>
        </TerminalOutput>,
      ]);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      {contextHolder}
      <div
        style={{ width: "20%", padding: "10px", borderRight: "1px solid #ccc" }}
      >
        <Button type="link" href="https://localhost:8080" target="_blank">
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
                      backgroundColor: computer.online ? "green" : "#bb161c",
                    }}
                    icon={
                      <DesktopOutlined
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                    }
                  />
                }
                title={computer.name}
                description={computer.mac}
              />
              <Badge
                status={computer.online ? "success" : "error"}
                style={{ marginLeft: "auto" }}
              />
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
          {currentInput && matchingCommands.length > 0 && (
            <TerminalOutput key="suggestions">
              <span style={{ color: "#00ff00" }}>
                {matchingCommands.join(", ")}
              </span>
            </TerminalOutput>
          )}
        </Terminal>
      </div>
    </div>
  );
};

export default CLIPage;
