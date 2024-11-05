"use client";
import ObjectDetailHeader from "./header";
import getFileIcon from "../../object-type/object-type";
import Diagram from "./react-flow";
export default function MalOpsManagementDetail({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="pb-20 gap-16 sm:py-20 font-[family-name:var(--font-geist-sans)]">
      <ObjectDetailHeader
        type={"Ransomware"}
        icon={getFileIcon("file")}
        title="cerber.exe"
        description="Ransomware hash"
      />
      <p className="opacity-0">{params.id}</p>
      <Diagram />
    </div>
  );
}
