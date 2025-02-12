/* eslint-disable*/
"use client";
import React, { useEffect, useState } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import { Input, List, Avatar, Badge } from "antd";
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

const computers: Computer[] = [
  { mac: "00:1A:2B:3C:4D:5E", name: "NH/AUTHOR", online: true },
  { mac: "00:1A:2B:3C:4D:5F", name: "RED/FOX", online: false },
  { mac: "0C:1A:2D:3C:4D:5G", name: "GREEN/LEAF", online: true },
  { mac: "0C:1A:2B:3C:4D:5H", name: "BLUE/SKY", online: false },
  // Add more computers as needed
];

const CLIPage = () => {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key="welcome">
      <span className="">{`Welcome to terminal`} </span>
    </TerminalOutput>,
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [matchingCommands, setMatchingCommands] = useState<string[]>([]);
  //@ts-ignore
  const [selectedMac, setSelectedMac] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkInputValue = () => {
      const inputElement = document.querySelector(
        ".terminal-hidden-input"
      ) as HTMLInputElement;
      if (inputElement) {
        setCurrentInput(inputElement.value);
      }
    };

    const intervalId = setInterval(checkInputValue, 100); // Check every 100ms

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const matchCommands = () => {
      const matches = Object.keys(commands).filter((cmd) =>
        cmd.startsWith(currentInput)
      );
      setMatchingCommands(matches);
    };

    matchCommands();
  }, [currentInput]);

  const handleComputerClick = (mac: string) => {
    setSelectedMac(mac);
    setTerminalLineData([
      <TerminalOutput key="welcome">
        <span className="">{`Welcome to ${mac}`} </span>
      </TerminalOutput>,
    ]);
  };

  const filteredComputers = computers.filter((computer) =>
    computer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{ width: "20%", padding: "10px", borderRight: "1px solid #ccc" }}
      >
        <h3>Computers</h3>
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
              onClick={() => handleComputerClick(computer.mac)}
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
          onInput={(terminalInput: string) => {
            console.log(`New terminal input received: '${terminalInput}'`);
            setCurrentInput(terminalInput); // Cập nhật đầu vào

            if (commands[terminalInput]) {
              setTerminalLineData([
                ...terminalLineData,
                <TerminalOutput key={terminalInput}>
                  {terminalInput}
                </TerminalOutput>,
                <TerminalOutput key={`output-${terminalInput}`}>
                  <span style={{ color: "#00ff00" }}>
                    {" "}
                    {commands[terminalInput]}
                  </span>
                </TerminalOutput>,
              ]);
            } else {
              setTerminalLineData([
                ...terminalLineData,
                <TerminalOutput key={terminalInput}>
                  {terminalInput}
                </TerminalOutput>,
                <TerminalOutput key="not-found">
                  <span style={{ color: "red" }}> Command not found</span>
                </TerminalOutput>,
              ]);
            }
          }}
          startingInputValue="" // Đầu vào mặc định
        >
          {terminalLineData}

          {/* Hiển thị gợi ý nếu có */}
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
