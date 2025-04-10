/* eslint-disable */
import React, { useCallback, useRef } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useEdgesState,
  useNodesState,
  Handle,
  Position,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { v4 as uuidv4 } from "uuid";
import ResultBuilder from "./result-builder";
const operators = ["=", "!=", ">", "<", ">=", "<=", "like"];
import { usePostApi } from "@/common/usePostApi";
import API_URL from "@/common/api-url";
import { on } from "events";
//@ts-ignore
const CustomNode = ({ data, id }) => {
  const updateField = (e) => data.onChange(id, "field", e.target.value);
  const updateOperator = (e) => data.onChange(id, "operator", e.target.value);
  const updateValue = (e) => data.onChange(id, "value", e.target.value);
  const handleDelete = () => data.onDelete(id);

  return (
    <div className="bg-white rounded-lg shadow-md p-3 w-64 border border-gray-200">
      <div className="mb-2">
        <label className="block text-xs text-gray-500">Field</label>
        <input
          type="text"
          value={data.field}
          onChange={updateField}
          className="w-full border p-1 rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500">Operator</label>
        <select
          value={data.operator}
          onChange={updateOperator}
          className="w-full border p-1 rounded"
        >
          {operators.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-500">Value</label>
        <input
          value={data.value}
          onChange={updateValue}
          className="w-full border p-1 rounded"
        />
      </div>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-2 py-1 text-xs rounded"
      >
        Delete
      </button>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

const nodeTypes = { customNode: CustomNode };

interface QueryFlowBuilderProps {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  reload: boolean;
}

export default function QueryFlowBuilder({
  setReload,
  reload,
}: QueryFlowBuilderProps) {
  const { mutation, contextHolder } = usePostApi(
    API_URL.INVESTIGATION_PAGE.ADD,
    true
  );
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  //@ts-ignore
  const handleNodeChange = (id, key, val) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [key]: val } } : node
      )
    );
  };

  const handleNodeDelete = (id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setTimeout(() => {
      reactFlowInstance.current?.fitView();
    }, 0);
  };

  const handleAddNode = () => {
    const id = uuidv4();
    const lastNode = nodes[nodes.length - 1];

    const newNode = {
      id,
      type: "customNode",
      data: {
        field: "",
        operator: "=",
        value: "",
        onChange: handleNodeChange,
        onDelete: handleNodeDelete,
      },
      position: lastNode
        ? { x: lastNode.position.x + 300, y: lastNode.position.y }
        : { x: 100, y: 100 },
    };

    setNodes((nds) => {
      const updatedNodes = [...nds, newNode];
      setTimeout(() => {
        reactFlowInstance.current?.fitView({ padding: 0.2 });
      }, 0);
      return updatedNodes;
    });

    if (lastNode) {
      const newEdge = {
        id: `${lastNode.id}-${id}`,
        source: lastNode.id,
        target: id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#4f46e5" },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }
  };

  const handleAdd = () => {
    const result = nodes.map(({ data }) => {
      return `${data.field} ${data.operator} '${data.value}'`;
    });
    console.log(result);
    mutation.mutate(
      {
        filter: result.join(" AND "),
      },
      {
        onSuccess: () => {
          setReload(!reload);
        },
      }
    );
  };

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds)),
    [setEdges]
  );

  return (
    <div style={{ height: "400px" }} className="w-full">
      {contextHolder}
      <div className="p-4 flex gap-2">
        <button
          onClick={handleAddNode}
          className="bg-primary text-black px-3 py-1 rounded"
        >
          Add
        </button>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Done
        </button>

        <ResultBuilder
          current={nodes.length - 1}
          items={nodes.map((n) => ({
            title: `${n.data.field} ${n.data.operator} ${n.data.value}`,
          }))}
        />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={(instance) => (reactFlowInstance.current = instance)}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
