/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";

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

interface CLIPageProps {
  params: {
    id: string;
  };
}

const CLIPage = ({ params }: CLIPageProps) => {
  const [terminalLineData, setTerminalLineData] = useState([
    <TerminalOutput key="welcome">{`Welcome to ${params.id}`}</TerminalOutput>,
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [matchingCommands, setMatchingCommands] = useState<string[]>([]);
  // Gợi ý lệnh phù hợp

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
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        marginTop: "50px",
      }}
    >
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
  );
};
export default CLIPage;
