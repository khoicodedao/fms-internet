"use client";
import { Divider } from "antd";
import ObjectDetailHeader from "./header";
import getFileIcon from "../../object-type/object-type";
import Diagram from "./description/react-flow";
import Communication from "./communication/communication";
export default function MalOpsManagementDetail() {
  return (
    <div className="pb-20 gap-16 sm:py-20 font-[family-name:var(--font-geist-sans)]">
      <ObjectDetailHeader
        type={"Ransomware"}
        icon={getFileIcon("file")}
        title="cerber.exe"
        description="Ransomware hash"
      />
      <Diagram />
      <Divider></Divider>
      <Communication />
    </div>
  );
}
