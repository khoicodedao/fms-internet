"use client";

import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";
import "vis-network/styles/vis-network.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const sampleConnections: any[] = [
  {
    source: "DESKTOP-I9T8DIF",
    target: "DESKTOP-AS",
    ip: "192.168.1.1",
    port: "8080",
    mac: "00:1A:2B:3C:4D:5E",
    viaRouter: false,
  },
  {
    source: "DESKTOP-AZ",
    target: "My_PC",
    ip: "192.168.1.2",
    port: "8081",
    mac: "00:1A:2B:3C:4D:5F",
    viaRouter: true, // This connection passes through a router
  },
  {
    source: "My_PC",
    target: "DESKTOP",
    ip: "192.168.1.3",
    port: "8082",
    mac: "00:1A:2B:3C:4D:60",
    viaRouter: true,
  },
];

export default function NetworkGraph() {
  const networkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!networkRef.current) return;

    const nodesMap = new Map<string, any>();

    // Add router node
    nodesMap.set("Router", {
      id: "Router",
      label: "Router",
      shape: "icon",
      icon: { face: "FontAwesome", code: "\uf6ff", size: 50, color: "#ff5722" }, // Router icon (WiFi)
    });

    // Generate nodes and edges
    const edges: any[] = [];
    sampleConnections.forEach((conn) => {
      // Add source node
      if (!nodesMap.has(conn.source)) {
        nodesMap.set(conn.source, {
          id: conn.source,
          label: conn.source,
          shape: "icon",
          icon: {
            face: "FontAwesome",
            code: "\uf108",
            size: 40,
            color: "#007bff",
          }, // Computer icon (Blue)
        });
      }

      // Add target node
      if (!nodesMap.has(conn.target)) {
        nodesMap.set(conn.target, {
          id: conn.target,
          label: conn.target,
          shape: "icon",
          icon: {
            face: "FontAwesome",
            code: "\uf108",
            size: 40,
            color: "#28a745",
          }, // Computer icon (Green)
        });
      }

      // If connection goes through router, split into two edges
      if (conn.viaRouter) {
        edges.push(
          {
            from: conn.source,
            to: "Router",
            label: `IP: ${conn.ip}\nPort: ${conn.port}`,
            arrows: "to",
            color: "#ffcc00",
            dashes: true,
          },
          {
            from: "Router",
            to: conn.target,
            label: `MAC: ${conn.mac}`,
            arrows: "to",
            color: "#ffcc00",
          }
        );
      } else {
        // Direct connection
        edges.push({
          from: conn.source,
          to: conn.target,
          label: `IP: ${conn.ip}\nPort: ${conn.port}\nMAC: ${conn.mac}`,
          arrows: { to: { enabled: true, type: "arrow" } },
          color: "#00c2ff",
          width: 2,
          smooth: { type: "dynamic" },
        });
      }
    });

    const nodes = Array.from(nodesMap.values());

    const container = networkRef.current;
    const data = { nodes, edges };
    const options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: "LR", // Sắp xếp Left → Right (hàng ngang)
          nodeSpacing: 200, // Khoảng cách giữa các node
          levelSeparation: 200, // Khoảng cách giữa các cấp
        },
      },
      physics: {
        enabled: false, // Tắt physics để tránh di chuyển tự do
      },
      nodes: {
        fixed: { x: true, y: true }, // Cố định vị trí
      },
    };
    const network = new Network(container, data, options);

    return () => network.destroy();
  }, []);

  return <div ref={networkRef} style={{ height: "500px" }} />;
}
