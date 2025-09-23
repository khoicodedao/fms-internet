/* eslint-disable */
"use client";
import React, { useEffect, useState } from "react";
import Terminal, { ColorMode, TerminalOutput } from "react-terminal-ui";
import {
  Input,
  List,
  Avatar,
  Badge,
  Button,
  message,
  Tooltip,
  Tabs,
  Col,
  Row,
} from "antd";
import API_URL from "@/common/api-url";
const DataTable = dynamic(() => import("@/components/DataTableCustom"), {
  ssr: false,
});
// import DataTable from "@/components/DataTableCustom";

import { Radio, Form } from "antd";
import {
  ApiOutlined,
  DesktopOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
type SOCKET_DATA = {
  type: "request" | "response";
  cmd_type: "cmd" | "upload" | "donwload" | "excute";
  from_user: string;
  to_user: string;
  data: Object;
  // with cmd type
  //cmd: data:{message:"message content",dir:""}
  //upload: data:{file_path:"", upload_url:"", dir:""}
  //download: data:"data:{"file_path":"", download_url:"",message:"",dir:"" }
};
const token = Cookies.get("auth_token");
// const  = process.env.SOCKET_SERVER_URL;
const CLIPage = () => {
  const { TabPane } = Tabs;
  const [cmdType, setCmdType] = useState<
    "cmd" | "upload" | "donwload" | "excute"
  >("cmd");
  const [form] = Form.useForm();

  const [serverStatus, setServerStatus] = useState<"online" | "offline">(
    "offline"
  );
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
  const [selectedMac, setSelectedMac] = useState<string | null>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [filteredComputers, setFilteredComputers] = useState<any[]>([]);
  const [dir, setDir] = useState<string>("");
  useEffect(() => {
    connectToWebSocket();
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const connectToWebSocket = () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname; // ví dụ: myapp.local hoặc example.com
    const wsUrl = `${protocol}//${host}:3003?token=${token}`;

    const ws = new WebSocket(wsUrl);
    setSocket(ws);

    ws.onopen = () => {
      setServerStatus("online");
      success("Connected to WebSocket server");
      // Request the list of connected computers
      ws.send(
        JSON.stringify({
          type: "new_user",
          nickname: "webclient",
        })
      );
    };
    ws.onerror = () => {
      setServerStatus("offline");
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      console.log("Received data from server:", response);
      if (response) {
        if (response.type === "response") {
          //check response type cmd show data on terminal
          if (response.cmd_type == "cmd") {
            setDir(response.data.dir);
            setTerminalLineData((prev) => [
              ...prev,
              <TerminalOutput key={`output-${response.data.message}`}>
                <span style={{ color: "#00ff00" }}>
                  {response.data.message}
                </span>
              </TerminalOutput>,
            ]);
          } else {
            messageApi.open({
              type: "info",
              content: response.data.message,
            });
          }
        }
        if (response.type === "clients_list") {
          console.log("data.clients", response.clients);
          setFilteredComputers(response.clients);
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

  const handleComputerClick = (computer: any, wss: WebSocket | null) => {
    const payload: SOCKET_DATA = {
      type: "request",
      cmd_type: cmdType,
      from_user: "server",
      to_user: selectedMac || "",
      data: { message: "Get directory", dir: dir, type: cmdType },
    };
    if (wss) {
      wss.send(JSON.stringify(payload));
    }
    setSelectedMac(computer);
    setTerminalLineData([
      <TerminalOutput key="welcome">
        <span className="">{`Welcome to (${computer})`} </span>
      </TerminalOutput>,
    ]);
  };
  const handleSubmit = (values: any) => {
    console.log(values);
    const payload: SOCKET_DATA = {
      type: "request",
      cmd_type: cmdType,
      from_user: "server",
      to_user: selectedMac || "",
      data: { type: cmdType },
    };

    if (cmdType === "cmd") {
      const terminalCmd = values.data.message;
      setCurrentInput(terminalCmd);
      setTerminalLineData((prev) => [
        ...prev,
        <TerminalOutput
          key={terminalCmd}
        >{`${dir}${terminalCmd}`}</TerminalOutput>,
      ]);
      payload.data = { message: terminalCmd };
    } else if (cmdType === "upload") {
      payload.data = {
        file_path: values.file_path,
        upload_url: values.upload_url,
        type: cmdType,
      };
    } else if (cmdType === "donwload") {
      payload.data = {
        file_path: values.file_path,
        download_url: values.download_url,
        type: cmdType,
      };
    } else if (cmdType === "excute") {
      payload.data = {
        message: values.message,
        script_path: values.script_path,
        type: cmdType,
      };
    }

    if (socket) {
      console.log(payload);
      socket.send(JSON.stringify(payload));
      success("Command sent.");
    } else {
      error("WebSocket is not connected.");
    }
  };

  const handleCommandInput = (terminalInput: string) => {
    setCurrentInput(terminalInput);
    setTerminalLineData([
      ...terminalLineData,
      <TerminalOutput
        key={terminalInput}
      >{`${dir}${terminalInput}`}</TerminalOutput>,
    ]);

    if (socket) {
      const payload: SOCKET_DATA = {
        type: "request",
        cmd_type: cmdType,
        from_user: "server",
        to_user: selectedMac || "",
        data: { message: terminalInput, dir: dir, type: cmdType },
      };
      socket.send(JSON.stringify(payload));
    } else {
      error("WebSocket is not open");
    }
  };

  return (
    <div id="cli-page" style={{ display: "flex", flexDirection: "row" }}>
      {contextHolder}
      <div style={{ width: "20%", padding: "10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          {serverStatus === "offline" ? (
            <Tooltip title=" Click here to Check server status">
              <Button
                type="link"
                href="https://localhost:444"
                target="_blank"
                icon={
                  <DisconnectOutlined
                    style={{ fontSize: "20px", color: "red" }}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                }
              />
            </Tooltip>
          ) : (
            <Tooltip title="Connected to server">
              <ApiOutlined
                style={{ color: "green", fontSize: "20px", marginLeft: "10px" }}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            </Tooltip>
          )}
        </div>

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
              //ts-ignore
              onClick={() => handleComputerClick(computer, socket)}
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
      <div style={{ width: "80%", paddingRight: "10px" }}>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          style={{ marginBottom: "5px", marginTop: "5px" }}
        >
          <Form.Item label="Command Type">
            <Radio.Group
              onChange={(e) => setCmdType(e.target.value)}
              value={cmdType}
            >
              <Radio value="cmd">CMD</Radio>
              <Radio value="upload">Upload</Radio>
              <Radio value="donwload">Download</Radio>
              <Radio value="excute">Execute</Radio>
            </Radio.Group>
          </Form.Item>

          {cmdType !== "cmd" &&
            cmdType != "upload" &&
            cmdType != "donwload" && (
              <Form.Item
                label="Message"
                name="message"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter command to execute" />
              </Form.Item>
            )}
          {cmdType === "upload" && (
            <>
              <Form.Item
                label="File Path"
                name="file_path"
                rules={[{ required: true, message: "Please input file path" }]}
              >
                <Input placeholder="/path/to/file" />
              </Form.Item>
              <Form.Item
                label="Upload URL"
                name="upload_url"
                rules={[{ required: true, message: "Please input upload url" }]}
              >
                <Input placeholder="https://upload.target" />
              </Form.Item>

              <DataTable
                title="Files"
                showFilter={false}
                showDatepicker={false}
                tableHeight="400px"
                dataFieldName="files"
                apiUrl={API_URL.FLIE.DEFAULT}
                columns={[
                  {
                    headerName: "Client",
                    field: "edr_id",
                    width: 150,
                  },
                  {
                    headerName: "File name",
                    field: "filename",
                    width: 250,
                    cellRenderer: (params: any) => {
                      const fileName = params.value;
                      const edrId = params.data?.edr_id;
                      const downloadUrl = `http://10.32.116.217:5000/api/files/download/${edrId}/${encodeURIComponent(
                        fileName
                      )}`;
                      return (
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {fileName}
                        </a>
                      );
                    },
                  },
                  {
                    headerName: "Time",
                    field: "created_at",
                    width: 300,
                  },
                ]}
              />
            </>
          )}
          {cmdType === "donwload" && (
            <>
              <Form.Item
                label="File Path"
                name="file_path"
                rules={[{ required: true }]}
              >
                <Input placeholder="/path/to/file" />
              </Form.Item>
              <Form.Item
                label="Download URL"
                name="download_url"
                rules={[{ required: true }]}
              >
                <Input placeholder="https://download.target" />
              </Form.Item>
            </>
          )}
          {cmdType === "excute" && (
            <Form.Item
              label="Script Path"
              name="script_path"
              rules={[{ required: true }]}
            >
              <Input placeholder="File url" />
            </Form.Item>
          )}

          {cmdType !== "cmd" && (
            <Form.Item>
              <Button type="primary" htmlType="submit" disabled={!selectedMac}>
                Send
              </Button>
            </Form.Item>
          )}
        </Form>

        {cmdType == "cmd" && (
          <Terminal
            name="Terminal"
            colorMode={ColorMode.Dark}
            prompt={`${dir}>`}
            onInput={handleCommandInput}
            startingInputValue=""
          >
            {terminalLineData}
          </Terminal>
        )}
      </div>
    </div>
  );
};

export default CLIPage;
