"use client";

import React, { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";
import { Card } from "antd";

type SocketEvent = {
  log_time: string;
  xxHash_path: string;
  data: {
    fields: {
      image_path: string;
      local_address: string;
      local_port: number;
      remote_address: string;
      remote_port: number;
    };
  };
};

type Props = {
  events: SocketEvent[];
};

const fetchIPInfo = async (ip: string) => {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await res.json();
    return data.status === "success" ? data : null;
  } catch (error) {
    return null;
  }
};

const SocketGraph: React.FC<Props> = ({ events }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !Array.isArray(events) || events.length === 0)
      return;

    const drawNetwork = async () => {
      const sortedEvents = [...events].sort(
        (a, b) =>
          new Date(a.log_time).getTime() - new Date(b.log_time).getTime()
      );

      const nodes: any[] = [];
      const edges: any[] = [];
      const addedProcesses = new Map<string, string>();
      const ipInfoCache = new Map<string, any>(); // cache IP info
      let x = 0;

      for (let index = 0; index < sortedEvents.length; index++) {
        const event = sortedEvents[index];
        const {
          data: { fields },
          xxHash_path,
          log_time,
        } = event;

        const processNodeId = `process-${xxHash_path}`;
        const remoteNodeId = `remote-${index}`;

        // Add process node if not added
        if (!addedProcesses.has(xxHash_path)) {
          nodes.push({
            id: processNodeId,
            label: fields.image_path.split("\\").pop(),
            shape: "icon",
            icon: {
              face: "FontAwesome",
              code: "\uf2db", // laptop icon
              size: 50,
              color: "#007bff",
            },
            x,
            y: 0,
            fixed: true,
            title: `Exe path: ${fields.image_path}`,
          });
          addedProcesses.set(xxHash_path, processNodeId);
        }

        x += 250;

        // Fetch IP info (with cache)
        const ip = fields.remote_address;
        let ipInfo = ipInfoCache.get(ip);
        if (!ipInfo) {
          ipInfo = await fetchIPInfo(ip);
          ipInfoCache.set(ip, ipInfo);
        }

        const ipDetails = ipInfo
          ? `Location: ${ipInfo.city}, ${ipInfo.country}\nISP: ${ipInfo.isp}`
          : "Location: Unknown";

        // Add remote node
        nodes.push({
          id: remoteNodeId,
          label: `${fields.remote_address}:${fields.remote_port}`,
          shape: "icon",
          icon: {
            face: "FontAwesome",
            code: "\uf0ac", // globe
            size: 40,
            color: "#28a745",
          },
          x,
          y: 0,
          fixed: true,
          title: `Connect time: ${new Date(
            log_time
          ).toLocaleString()}\nLocal Port: ${fields.local_port}\n${ipDetails}`,
        });

        // Add edge
        edges.push({
          from: addedProcesses.get(xxHash_path),
          to: remoteNodeId,
          arrows: "to",
          label: new Date(log_time).toLocaleTimeString(),
          font: { align: "middle" },
        });
      }

      const network = new Network(
        containerRef.current!,
        { nodes, edges },
        {
          physics: false,
          layout: { hierarchical: false },
          edges: {
            smooth: { enabled: true, type: "curvedCW", roundness: 0.5 },
            arrows: { to: { enabled: true, type: "arrow" } },
          },
          nodes: {
            font: { size: 14 },
          },
        }
      );

      return () => {
        network.destroy();
      };
    };

    drawNetwork();
  }, [events]);

  return (
    <Card title="Socket Connection Graph (By Time)">
      <div ref={containerRef} style={{ height: "600px", width: "100%" }} />
    </Card>
  );
};

export default SocketGraph;
